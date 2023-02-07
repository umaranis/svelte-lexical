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
