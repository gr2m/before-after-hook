# before-after-hook

> wrap methods with before/after hooks

[![Build Status](https://travis-ci.org/gr2m/before-after-hook.svg?branch=master)](https://travis-ci.org/gr2m/before-after-hook)
[![Coverage Status](https://coveralls.io/repos/gr2m/before-after-hook/badge.svg?branch=master)](https://coveralls.io/r/gr2m/before-after-hook?branch=master)
[![Dependency Status](https://david-dm.org/gr2m/before-after-hook.svg)](https://david-dm.org/gr2m/before-after-hook)
[![devDependency Status](https://david-dm.org/gr2m/before-after-hook/dev-status.svg)](https://david-dm.org/gr2m/before-after-hook#info=devDependencies)

## Motivation

When events are not enough to integrate libraries into your application, the
authors expose methods like `onPreSave` or `onPostAuth`, so you can apply custom
logic for validation, authentication or logging. With `before-after-hook` I want
to create a generic API that can be used by module authors to expose
asynchronous before & after hooks for internal functionality.

The original motivation is coming from [Hoodie’s architecture](https://github.com/hoodiehq/hoodie/tree/master/server#architecture).
For example, the logic for authentication is separated from local data
persistence and we need to send local changes before allowing the user to sign
out to prevent data loss. Or on the server, creating a session should fail based
on custom logic provided by the app, like a failed payment.

## Scope

`before-after-hook` aims to implement the minimal amount of functionality
required for asynchronous method hooks. It is using promises exclusively and
does not alter arguments.

## Example

```js
// instantiate hook API
var hook = new Hook()

// Create a hook
hook('get', getData)
  .then(handleData)
  .catch(handleGetError)

// register before/after hooks. The methods can be async by returning a Promise
hook.before('get', beforeGetData)
hook.after('get', afterGetData)
```

The methods are executed in the following order, each waiting for the promise
of the previous method to resolve (in case a promise was returned):
`beforeGetData`, `getData`, `afterGetData`, `handleData`. If any of the methods
throws an error or returns a rejected promise, `handleGetError` gets called.

## API

- [Constructor](#constructor)
- [hook.api](#hookapi)
- [hook()](#hook)
- [hook.before()](#hookbefore)
- [hook.after()](#hookafter)
- [hook.remove.before()](#hookbefore)
- [hook.remove.after()](#hookafter)

### Constructor

The `Hook` constructor has no options and returns a `hook` instance with the
methods below

```js
var hook = new Hook()
```

### hook.api

Use the `api` property to return the public API:

- [hook.before()](#hookbefore)
- [hook.after()](#hookafter)
- [hook.remove.before()](#hookbefore)
- [hook.remove.after()](#hookafter)

That way you don’t need to expose the [hook()](#hook) method to consumers of your library

### hook()

Invoke before and after hooks. Returns a promise.

```js
hook(nameOrNames, [options,] method)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>name</code></th>
    <td>String or Array of Strings</td>
    <td>Hook name, for example <code>'save'</code>. Or an array of names, see example below.</td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>options</code></th>
    <td>Object</td>
    <td>Will be passed to all before hooks as reference, so they can mutate it</td>
    <td>No, defaults to empty object (<code>{}</code>)</td>
  </tr>
  <tr>
    <th align="left"><code>method</code></th>
    <td>Function</td>
    <td>Callback to be executed after all before hooks finished execution successfully. <code>options</code> is passed as first argument</td>
    <td>Yes</td>
  </tr>
</table>

Resolves with whatever `method` returns or resolves with.
Rejects with error that is thrown or rejected with by

1. Any of the before hooks, whichever rejects / throws first
2. `method`
3. Any of the after hooks, whichever rejects / throws first

Simple Example

```js
hook('save', record, function (record) {
  return store.save(record)
})
// shorter:  hook('save', record, store.save)

hook.before('save', function addTimestamps (record) {
  var now = new Date().toISOString()
  if (record.createdAt) {
    record.updatedAt = now
  } else {
    record.createdAt = now
  }
})
```

Example defining multiple hooks at once.

```js
hook(['add', 'save'], record, function (record) {
  return store.save(record)
})

hook.before('add', function addTimestamps (record) {
  if (!record.type) {
    throw new Error('type property is required')
  }
})

hook.before('save', function addTimestamps (record) {
  if (!record.type) {
    throw new Error('type property is required')
  }
})
```

Defining multiple hooks is helpful if you have similar methods for which you want to define separate hooks, but also an additional hook that gets called for all at once. The example above is equal to this:

```js
hook('add', record, function (record) {
  return hook('save', record, function (record) {
    return store.save(record)
  })
})
```

### hook.before()

Add before hook for given name. Returns `hook` instance for chaining.

```js
hook.before(name, method)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>name</code></th>
    <td>String</td>
    <td>Hook name, for example <code>'save'</code></td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>method</code></th>
    <td>Function</td>
    <td>
      Callback to be executed before <code>method</code>. Called with the hook’s
      <code>options</code> argument. Before hooks can mutate the passed options,
      they will also be passed to the wrapped method as first argument
    </td>
    <td>Yes</td>
  </tr>
</table>

Example

```js
hook.before('save', function validate (record) {
  if (!record.name) {
    throw new Error('name property is required')
  }
})
```

### hook.after()

Add after hook for given name. Returns `hook` instance for chaining.

```js
hook.after(name, method)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>name</code></th>
    <td>String</td>
    <td>Hook name, for example <code>'save'</code></td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>method</code></th>
    <td>Function</td>
    <td>
      Callback to be executed after <code>method</code>. Called with whatever
      the hook’s <code>method</code> resolves with and the hook’s
      <code>options</code> argument.
    </td>
    <td>Yes</td>
  </tr>
</table>

Example

```js
hook.after('save', function (result, options) {
  if (result.updatedAt) {
    app.emit('update', result)
  } else {
    app.emit('create', result)
  }
})
```

### hook.remove.before()

Removes before hook for given name. Returns `hook` instance for chaining.

```js
hook.remove.before(name, beforeHookMethod)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>name</code></th>
    <td>String</td>
    <td>Hook name, for example <code>'save'</code></td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>beforeHookMethod</code></th>
    <td>Function</td>
    <td>
      Same function that was previously passed to <code>hook.before()</code>
    </td>
    <td>Yes</td>
  </tr>
</table>

Example

```js
hook.remove.before('save', validateRecord)
```

### hook.remove.after()

Removes after hook for given name. Returns `hook` instance for chaining.

```js
hook.remove.after(name, afterHookMethod)
```

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tr>
    <th align="left"><code>name</code></th>
    <td>String</td>
    <td>Hook name, for example <code>'save'</code></td>
    <td>Yes</td>
  </tr>
  <tr>
    <th align="left"><code>afterHookMethod</code></th>
    <td>Function</td>
    <td>
      Same function that was previously passed to <code>hook.after()</code>
    </td>
    <td>Yes</td>
  </tr>
</table>

Example

```js
hook.remove.after('save', triggerEvents)
```

## See also

If `before-after-hook` is not for you, have a look at one of these alternatives:

- https://github.com/keystonejs/grappling-hook
- https://github.com/sebelga/promised-hooks
- https://github.com/bnoguchi/hooks-js
- https://github.com/cb1kenobi/hook-emitter

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
