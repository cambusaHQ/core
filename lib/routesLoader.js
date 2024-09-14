export default async function loadRoutes(app) {
  const routesConfig = cambusa.config.routes;

  for (const [route, handlerPath] of Object.entries(routesConfig)) {
    const [method, path] = route.split(' ');
    const [controllerName, actionName] = handlerPath.split('.');

    // Import the controller using the alias
    const controllerModule = await import(`@controllers/${controllerName}.js`);
    const controller = controllerModule.default || controllerModule;

    // Get the action function
    const action = controller[actionName];

    if (typeof action !== 'function') {
      throw new Error(`Action ${actionName} not found in ${controllerName}`);
    }

    // Set up the route in Elysia app
    app[method.toLowerCase()](path, action);
  }
}
