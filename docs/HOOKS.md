# Hooks

The hook system in **Cambusa** provides a way to execute custom code at specific points during the application's lifecycle. Hooks are automatically loaded from the `api/hooks` directory and can be used to:

- Modify configurations
- Register additional middlewares or routes
- Perform actions before or after certain events
- Handle errors globally
- Extend the application with custom functionality

## Available Hooks

Here is a list of all possible hooks in Cambusa, along with descriptions of when they are executed:

1. **`beforeInitialization`**
   - **When executed**: Before the application starts the initialization process.
   - **Purpose**: Perform actions or set up configurations before any initialization occurs.

2. **`afterHooksLoaded`**
   - **When executed**: Immediately after all hooks from the `api/hooks` directory have been loaded.
   - **Purpose**: Perform actions after all other hooks have been registered.

3. **`beforeMiddlewaresLoaded`**
   - **When executed**: Before the application loads middlewares.
   - **Purpose**: Modify middleware configurations or register additional middlewares before the main ones are loaded.

4. **`afterMiddlewaresLoaded`**
   - **When executed**: After all middlewares have been loaded.
   - **Purpose**: Perform actions or register additional middlewares after the main ones are in place.

5. **`beforeRoutesLoaded`**
   - **When executed**: Before the application loads routes.
   - **Purpose**: Modify route configurations or register additional routes before the main ones are loaded.

6. **`afterRoutesLoaded`**
   - **When executed**: After all routes have been loaded.
   - **Purpose**: Perform actions or register additional routes after the main ones are in place.

7. **`beforeHelpersLoaded`**
   - **When executed**: Before the application loads helpers.
   - **Purpose**: Modify helper configurations or register additional helpers before the main ones are loaded.

8. **`afterHelpersLoaded`**
   - **When executed**: After all helpers have been loaded.
   - **Purpose**: Perform actions or register additional helpers after the main ones are in place.

9. **`beforeDatabaseInitialized`**
   - **When executed**: Before the database initialization process starts.
   - **Purpose**: Modify database configurations or perform actions before the database connection is established.

10. **`afterDatabaseInitialized`**
    - **When executed**: After the database has been initialized.
    - **Purpose**: Perform actions that depend on the database being ready, such as seeding data or logging.

11. **`onInitialized`**
    - **When executed**: After the entire initialization process is complete.
    - **Purpose**: Perform actions once the application is fully initialized but before the server starts.

12. **`beforeServerStart`**
    - **When executed**: Just before the server starts listening for requests.
    - **Purpose**: Perform last-minute configurations or checks before the server is live.

13. **`onServerStarted`**
    - **When executed**: After the server has started and is listening for requests.
    - **Purpose**: Perform actions like logging, notifying services, or starting scheduled tasks.

14. **`onRequest`**
    - **When executed**: At the beginning of each incoming request.
    - **Purpose**: Perform actions like authentication, logging, or modifying the request.

15. **`onResponse`**
    - **When executed**: After a response is sent to the client.
    - **Purpose**: Perform actions like logging or cleanup tasks.

16. **`onError`**
    - **When executed**: Whenever an error occurs in the application.
    - **Purpose**: Handle errors, log them, or modify error responses.

17. **`beforeShutdown`**
    - **When executed**: Before the application starts the shutdown process.
    - **Purpose**: Perform cleanup tasks, such as closing connections or saving state.

18. **`afterShutdown`**
    - **When executed**: After the application has completed the shutdown process.
    - **Purpose**: Perform final actions, such as logging or notifying external systems.

## Using Hooks

To use hooks in Cambusa, create JavaScript files in the `api/hooks` directory. Each hook file should export a default function that receives the `cambusa` instance and registers one or more hook functions.

### Example: Registering a Hook for `afterDatabaseInitialized`

```javascript
// api/hooks/logDatabaseInit.js
export default function logDatabaseInit(cambusa) {
  cambusa.registerHook('afterDatabaseInitialized', async () => {
    cambusa.log.info('The database has been successfully initialized.');
    // Additional logic can go here
  });
}
```

### Example: Handling Errors Globally

```js
// api/hooks/globalErrorHandler.js
export default function globalErrorHandler(cambusa) {
  cambusa.registerHook('onError', (error, ctx) => {
    // Log the error
    cambusa.log.error(`Error occurred: ${error.message}`);
    // Optionally modify the response
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal Server Error' };
  });
}
```

## Hook Methods

- `registerHook(hookName, fn)`: Registers a function `fn` to be executed when the hook named `hookName` is triggered.
- `executeHook(hookName, ...args)`: Executes all functions registered under the hook named `hookName`, passing any additional arguments `...args` to the hook functions.

## Best Practices for Hook Development

- **Clear Naming:** Use descriptive names for your hooks to make their purpose clear.
- **Asynchronous Support:** Hooks can be asynchronous. Use async/await as needed in your hook functions.
- **Error Handling:** Handle errors within your hooks to prevent them from affecting the main application flow.
- **Performance Considerations:** Be mindful of the performance impact of your hooks, especially those that execute frequently like onRequest.
