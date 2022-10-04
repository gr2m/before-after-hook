# Store hook examples

This example shows how an imaginary `store` API with methods to add, update
and remove methods can expose a hook API to intercept all of them.

We will use the hooks to

- add validation
- add timestamps and user references
- emit events

The store APIs to change data look as follows, we ignore methods to find / query
data for the sake of simplicity

```js
store.add(document);
store.update(id, changedProperties);
store.remove(id);
```

The exposed hooks could be

- `add`  
  invoked when a document gets added
- `update`  
  invoked when a document gets updated
- `remove`  
  invoked when a document is removed
- `save`  
  invoked each time a document gets saved within the hooks listed above.

The implementation of the hooks could look like this:

```js
const hook = new Hook.Collection();

function storeAdd(newDoc) {
  return hook(["add", "save"], newDoc, (newDoc) => {
    return database.create(newDoc);
  });
}
```

This will invoke the following

1. `add` before hook
1. `save` before hook
1. run `database.create(newDoc)`
1. `save` after hook
1. `add` after hook

## Validation

We want to build a todo application which has documents with `type` set to
`item` and `list`. We don’t want to allow any other values for `type` or
documents with a `type` property altogether. We also want to make sure that
each `item` has a `listId` property

```js
hook.before("save", (doc) => {
  if (!doc.type) {
    throw new Error("type property is required");
  }
  if (doc.type !== "item" && doc.type !== "list") {
    throw new Error(
      "Invalid type value: " + doc.type + " (Allowed: item, list)"
    );
  }

  if (doc.type === "item" && !doc.listId) {
    throw new Error("items need to set listId property");
  }

  return doc;
});
```

This will prevent the app from saving invalid documents

```js
store.add({ foo: "bar" });
// rejects with Error: type property is required
```

```js
store.add({ type: "item", listId: "id34567", note: "Remember the milk!" });
// resolves with value of database.create(newDoc)
```

## timestamps and user reference

```js
hook.before("add", (doc) => {
  doc.createdAt = new Date().toISOString();
  doc.createdBy = app.currentUser.id;
  return doc;
});
hook.before("update", (doc) => {
  doc.updatedAt = new Date().toISOString();
  doc.updatedBy = app.currentUser.id;
  return doc;
});
```

## events

```js
hook.after("add", (doc) => {
  app.emit("data:" + doc.type + ":add", doc);
});
hook.after("update", (doc) => {
  app.emit("data:" + doc.type + ":update", doc);
});
hook.after("remove", (doc) => {
  app.emit("data:" + doc.type + ":remove", doc);
});
```
