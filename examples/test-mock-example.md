# Test mock example

This example shows how a REST API client can implement mocking for simple testing.

Let’s say the client has methods to get/list/create/update/delete todos.

```js
client.getTodo(id);
client.listTodos();
client.createTodo(options);
client.updateTodo(options);
client.deleteTodo(id);
```

The exposed hook is called `request`.

All methods would use an internal `request` method to which they pass options
such as the http verb, the URL, query parameters and request body.

The implementation of the hook could look like this:

```js
function request (options) {
  return hook('request', options, (options) => (
    const {url, ...fetchOptions} = options
    return fetch(url, fetchOptions)
  ))
}
```

Now when writing a test for "getTodo", the wrap hook allows us to prevent from
an HTTP request to be even sent, instead we test if the options passed `fetch`
are what we expect.

```js
test("client.getTodo(123)", () => {
  const client = getClient();
  client.hook.wrap("request", (fetch, options) => {
    assert.equal(options.method, "GET");
    assert.equal(options.url, "https://api.acme-inc.com/todos/123");
  });

  client.getTodo(123);
});
```
