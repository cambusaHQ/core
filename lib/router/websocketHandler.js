import { t } from 'elysia';

export const websocketHandler = {
  body: t.Object({
    type: t.String(),
    method: t.Optional(t.String()),
    route: t.Optional(t.String()),
    data: t.Optional(t.Any()),
    params: t.Optional(t.Any()),
    query: t.Optional(t.Any()),
  }),

  // Handle connection opened
  open(ws) {
    cambusa.log.debug('WebSocket connected');
  },

  // Handle incoming messages
  message(ws, message) {
    handleWebSocketMessage(ws, message);
  },

  // Handle connection closed
  close(ws) {
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

// async function handleWebSocketMessage(ws, message) {
//   console.log(JSON.parse(message));
//   try {
//     if (message.type === 'subscribe') {
//       handleSubscription(ws, message);
//     } else if (message.type === 'unsubscribe') {
//       handleUnsubscription(ws, message);
//     } else {
//       cambusa.log.debug('Received message:', message);
//     }
//   } catch (error) {
//     cambusa.log.error('Error handling WebSocket message:', error);
//   }
// }

// function handleSubscription(ws, message) {
//   const { model } = message;
//   cambusa.sockets.join(ws, model);
//   ws.send(JSON.stringify({ type: 'subscribed', model }));
//   cambusa.log.debug(`Client subscribed to ${model}`);
// }

// function handleUnsubscription(ws, message) {
//   const { model } = message;
//   cambusa.sockets.leave(ws, model);
//   ws.send(JSON.stringify({ type: 'unsubscribed', model }));
//   cambusa.log.debug(`Client unsubscribed from ${model}`);
// }
