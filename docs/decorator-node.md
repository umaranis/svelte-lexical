# DecoratorNode - Mechanism for plugging in UI framework in Lexical

DecoratorNode provides a way for UI framworks to plug into lexical. DecoratorNode is the only base class available for extension.

Here is the order of execution when a decorator node created or changed:

1. Reconciler starts
2. DecoratorNode.createDOM
    - Only called when a new node is created or a node is re-created.
    - Re-creation of a node is required in some cases like drag and drop.
    - Responsible for creating the target DOM node where the component will be rendered
    - If this method is called for an existing node, it means the whole component has to be re-rendered
3. DecoratorNode.decorate
    - Responsible for returning the relevant component and props which will be used later to render the component using decorator listener
    - Called every time there is change in node properties
4. Reconciler ends
5. Mutation Listeners are called
6. Decorator listener called
    - Registered through registerDecoratorListener
    - Supposed to be used by UI frameworks to render the Decorator Nodes

`DecoratorNode.decorate` is only called for the node that is changed. For instance, resizing an image will call the decorate method of the specific image being resized. But when decorator listeners (registered through registerDecoratorListener) are called, they will contain the full list of decorator nodes, not just the changed ones.

## Implementing custom nodes without using DecoratorNode mechanism (don't do this)

We can avoid decorator concept and implement the whole logic in createDOM or decorate method but it leads to a number of problems:

1- if the whole logic is in node.createDOM

- We are not going to get updates, when lexical node object model changes
- drag and dropping a image with caption generates a null pointer exception (from lexical reconciler)

2- if the whole logic is in node.decorate method

- drag and dropping a image with caption generates a null pointer exception (from lexical reconciler)

### Null pointer exception on dragging dropping an image with caption

We get a null pointer exception on dragging and dropping an image with caption. There is a reconciliation process, part of lexical, that is triggered when any change happens in the editor. This reconciliation process calls createDOM and decorate methods on the lexical nodes as required. This reconciliation process should complete before reconciliation can start on any of the nested editors. This is because reconcilation process uses a global variable for storing the active editor being reconciled.  What happens in our case, if we do the whole rendering inside of createDOM or decorate method is that the reconciler starts and it does the reconciliation and runs createDOM and decorate methods. And if any of those methods is fully rendering the decorator nodes, then an image having a caption will create a nested editor triggering a reconciliation process from within a reconciliation process and overwriting the global active editor variable. The reconciliation process for the caption editor works fine, but when it ends, it sets the root, the global active editor as null, and then when it returns back to reconcile root editor data. This is where the whole thing breaks down and we get a null pointer exception.
