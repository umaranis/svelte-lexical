# DecoratorNode - Mechanism for plugging in UI framework in Lexical

DecoratorNode provides a way for UI frameworks to plug into lexical. DecoratorNode is the only base class available for extension.

Here is the order of execution when a decorator node is created or changed:

1. Reconciler starts
2. DecoratorNode.createDOM
    - Only called when a new node is created or a node is re-created.
    - Re-creation of a node is required in some cases like drag and drop.
    - Responsible for creating the target DOM node where the component will be rendered
    - If this method is called for an existing node, it means the whole component has to be re-rendered
3. DecoratorNode.decorate
    - Responsible for returning the relevant component and props which will be used later to render the component using decorator listener
        - Instead of props, it returns a function for updating props in Svelte 5. We cannot call `$.set` to update properties like you used to in Svelte 4. rather props is a `$state` rune that to be updated in place.
    - Called every time there is change in node properties
4. Reconciler ends
5. Mutation Listeners are called
6. Decorator listener called
    - Registered through registerDecoratorListener
    - Supposed to be used by UI frameworks to render the Decorator Nodes

`DecoratorNode.decorate` is only called for the node that is changed. For instance, resizing an image will call the decorate method of the specific image being resized. But when decorator listeners (registered through registerDecoratorListener) are called, they will contain the full list of decorator nodes, not just the changed ones.

## Implementing custom nodes without using DecoratorNode mechanism

We can avoid decorator concept and implement the whole logic in createDOM or decorate method but it leads to a number of problems:

1- if the whole logic is in node.createDOM

- We are not going to get updates, when lexical node object model changes
- drag and dropping a image with caption generates a null pointer exception (from lexical reconciler)

2- if the whole logic is in node.decorate method

- drag and dropping a image with caption generates a null pointer exception (from lexical reconciler)

### Null pointer exception on dragging dropping an image with caption

We get a null pointer exception on dragging and dropping an image with caption. There is a reconciliation process, part of lexical, that is triggered when any change happens in the editor. This reconciliation process calls createDOM and decorate methods on the lexical nodes as required. This reconciliation process should complete before reconciliation can start on any of the nested editors. This is because reconcilation process uses a global variable for storing the active editor being reconciled.  What happens in our case, if we do the whole rendering inside of createDOM or decorate method is that the reconciler starts and it does the reconciliation and runs createDOM and decorate methods. And if any of those methods is fully rendering the decorator nodes, then an image having a caption will create a nested editor triggering a reconciliation process from within a reconciliation process and overwriting the global active editor variable. The reconciliation process for the caption editor works fine, but when it ends, it sets the root, the global active editor as null, and then when it returns back to reconcile root editor data. This is where the whole thing breaks down and we get a null pointer exception.

### Ephemeral Decorator Node object

Decorator Nodes object like `ImageNode` are often cloned and replaced. Whenever a property changes, a new clooned object is created. The new object takes the place previous one during reconciliation. This cloning of object helps with maintaining undo/redo stack as well.

The upshot is:

- Decorator Nodes cannot hold any references or data, other than the node properties
- We cannot hold a reference to a Decorator Node. We can save the `nodeKey` and use `editor.getElementByKey(nodeKey)` to get to the node when needed.

### svelte-lexical implementation of DecoratorNode

Initially, I avoided DecoratorNode rendering mechanism and tried rendering the full component logic in `createDom` or `decorate` methods. But I run into problems with lexical reconciler trying to reconcile nested editors.

So now Decorator Nodes are implemented in a way that is in line with how it has been designed by the lexical authors. DecoratorNode.decorate method returns the information required to render a component. The returned data for all the decorator nodes are available to the decorator listener when it is called. The  listener is registered through `registerDecoraterListener` and is called when any of the decorator nodes require rendering. This listener is where actual rendering of Svelte components takes place.

`Decorator Listener` is called when any of the decorator node needs rendering. But it doesn't tell us which nodes have changed. Every time the listener is triggered, it contains the full list of decorator nodes data in the document. To track, which nodes have changed, svelte-lexical uses another listener called mutation listener. It is always called before the decorator listener and is only called for nodes which are changed.

The mutation listener provides us with the type of mutation which can be `created`, `updated` or `destroyed`. 

In case of created and updated mutation, the nodeKey is stored in the list of dirty components. These dirty components are created or updated during decorator listener. Mutation type is not a reliable way to determine rather we need to create or update a component because certain user actions like drag/drop may require re-creaton of the component even though the mutation type is updated. This happens because the lexical reconciler may re-create the parent DOM node in certain cases of `updated` mutation. All new instances of Svelte Components instantiated during decorator listener are stored in a Map with nodeKey as the key. This cache is used to find the Svelte Components when they need to be updated in decorator listener.

In case of `destroyed` mutation type, the relevant Svelte Component is cleared from the cache.

### Not all Svelte Components need to be implemented as a DecoratorNode

The nodes that do not have any mutable properties can be rendered fully inside createDOM method without replying on decorator mechanism.

But we have to only DecoratorNode base class available for extension. To sidestep the rendering for such nodes we can add the following to the node class (for instance, HorizontalRuleNode)

```javascript
static skipDecorateRender = true;
decorate() {
   return null;
}
```

Svelte context is not available to such components. It is only available to components rendered through DecoratorNode mechanism.

### Reactivity
Svelte-lexical has two mechanisms for reactivity: svelte reactivity and lexical reconciler. In the context of decorator nodes, Lexical Reconciler calls node.decorate and decorator listeners when a node property changes.

At times, a requirement can be achieved through any of the two mechanisms, but mostly they complement each other. An example of reactivity through lexical reconciler is ‘showCaption’ in image component.

It is a must to implement lexical reconciler reactivity, we should not try to have all the reactivity in svelte because we have to respond to changes in lexical object model (for instance, changes introduced by undo/redo).
