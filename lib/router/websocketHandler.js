/**
 * WebSocket handler configuration
 */
export const websocketHandler = {
  /**
   * Handles new WebSocket connections
   * @param {WebSocket} ws - The WebSocket instance
   */
  open() {
    cambusa.log.debug('WebSocket connected');
  },

  /**
   * Handles incoming WebSocket messages
   * @param {WebSocket} ws - The WebSocket instance
   * @param {string} message - The received message
   */
  message(ws, message) {
    handleWebSocketMessage(ws, message);
  },

  /**
   * Handles WebSocket disconnections
   * @param {WebSocket} ws - The WebSocket instance
   */
  close() {
    cambusa.log.debug('WebSocket disconnected');
  },
};

async function handleWebSocketMessage(ws, message) {
  try {
    const { method, route, data, params, query } = message;

    // Validate the message format
    if (!method || !route) {
      throw new Error('Invalid message format');
    }

    // Mock headers object
    const headers = {};

    // Convert WebSocket message to an HTTP-like request
    const req = {
      method,
      url: route,
      params: params || {},
      query: query || {},
      body: data,
      error: (status, message) => {
        throw new Error(`${status}: ${message}`);
      },
      set: {
        headers: headers,
      },
    };

    // Find the corresponding route
    const routeHandler = cambusa.app.routes.find(
      (r) => r.method === method.toUpperCase() && r.path === route
    );

    if (!routeHandler) {
      throw new Error('Route not found');
    }

    // Execute the route handler
    const result = await routeHandler.handler(req);

    // Send the result back through the WebSocket, including any set headers
    ws.send({
      data: result,
      headers: headers,
    });
  } catch (error) {
    ws.send({
      error: error.message,
    });
  }
}
