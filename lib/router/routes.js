import path from 'path';

// Function to dynamically load the route handlers based on the routes config
export async function routes(routes) {
  for (const route in routes) {
    const [method, routePath] = route.split(' ');
    const controllerPath = routes[route];

    // Dynamically import the controller file
    const controllerFilePath = path.join(process.cwd(), 'api', 'controllers', `${controllerPath}.js`);

    // Import the controller function dynamically
    const controller = await import(controllerFilePath);

    // Register the route in Elysia app
    cambusa.app[method.toLowerCase()](routePath, controller.default);

    cambusa.log.verbose(`[Route]: ${method} ${routePath} registered`);
  }
}

export default routes;
