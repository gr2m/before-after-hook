# Authentication hook examples

This example shows how an imaginary `authentication` API with methods to manage user accounts and sessions can expose hook APIs to implement

- username validation
- an email verification flow

The authentication APIs to create a user account and a session look as follows

```js
authentication.accounts.add(properties);
authentication.sessions.add(credentials);
```

The exposed hooks could be

- `registration`  
  invoked when a user account gets created
- `login`  
  invoked when a user tries to sign in

The implementation of the hooks could look like this:

```js
const hook = new Hook.Collection();

function createUserAccount (properties) {
  return hook('registration', properties, (properties) => (
    return accountDatabase.create(properties)
  ))
}
function createSession (account, credentials) {
  const options = {account: account, credentials: credentials}
  return hook('login', options, (options) => {
    if (!validateCredentials(options.account, options.credentials) {
      throw new Error('Unauthorized: username or password is incorrect')
    })

    return {
      id: generateSessionId(options.account, options.credentials, secret),
      account: options.account
    }
  })
}
```

## Validate username

Say we want to enforce that username must be valid email addresses.

```js
hook.before("registration", (properties) => {
  if (!isValidEmail(properties.username)) {
    throw new Error(properties.username + "is not a valid email address");
  }

  properties.username = properties.username.toLowerCase();
});
```

## Implement email verification flow

Say we do not want to allow users to sign in to their account until their email was verified. Once verified, we set a `verifiedAt` timestamp.

```js
hook.before("login", (options) => {
  if (!options.account.verifiedAt) {
    throw new Error("You must verify your email address before signing in");
  }
});
```
