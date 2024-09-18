import path from 'path';

// Function to dynamically load the route handlers based on the routes config
export async function loadRoutes(routes) {
  for (const route in routes) {
    const [method, routePath] = route.split(' ');
    const controllerPath = routes[route];

    // Dynamically import the controller file
    const controllerFilePath = path.join(process.cwd(), 'api', 'controllers', `${controllerPath}.js`);

    // Import the controller function dynamically
    const controller = await import(controllerFilePath);

    // Register the route in Elysia app
    cambusa.app[method.toLowerCase()](routePath, controller.default);
  }
}

export default loadRoutes;
