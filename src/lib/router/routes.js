import path from 'path';

/**
 * Dynamically loads and registers route handlers based on the provided routes configuration.
 * This function iterates through the routes object, imports the corresponding controller files,
 * and registers each route with the Elysia application.
 *
 * @param {Object} routes - An object containing route configurations.
 *                          Keys are in the format "METHOD /path", values are controller file paths.
 */
export async function routes(routes) {
  for (const route in routes) {
    // Split the route key into HTTP method and path
    const [method, routePath] = route.split(' ');
    const controllerPath = routes[route];

    // Construct the full path to the controller file
    const controllerFilePath = path.join(
      process.cwd(),
      'api',
      'controllers',
      `${controllerPath}.js`
    );

    // Dynamically import the controller function
    const controller = await import(controllerFilePath);

    // Register the route with the Elysia application
    // The HTTP method is converted to lowercase to match Elysia's method names
    cambusa.app[method.toLowerCase()](routePath, controller.default);

    // Log the successful registration of the route
    cambusa.log.verbose(`[Route]: ${method} ${routePath} registered`);
  }
}

export default routes;
