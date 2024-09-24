import { t } from 'elysia';

// Store subscriptions
const subscriptions = new Map();

export const websocketHandler = {
  body: t.Object({
    type: t.String(),
    method: t.Optional(t.String()),
    route: t.Optional(t.String()),
    data: t.Optional(t.Any()),
    query: t.Optional(t.Any()),
    model: t.Optional(t.String()),
  }),

  // Handle connection opened
  open(ws) {
    cambusa.log.debug('WebSocket connected');
    ws.subscribe('all'); // Subscribe to a general channel
  },

  // Handle incoming messages
  message(ws, message) {
    switch (message.type) {
      case 'subscribe':
        handleSubscription(ws, message);
        break;
      case 'unsubscribe':
        handleUnsubscription(ws, message);
        break;
      default:
        handleWebSocketMessage(ws, message);
    }
  },

  // Handle connection closed
  close(ws) {
    cambusa.log.debug('WebSocket disconnected');
    removeAllSubscriptions(ws);
  },
};

function handleSubscription(ws, message) {
  const { model } = message;
  if (!model || !cambusa.models[model]) {
    ws.send({ error: 'Invalid model for subscription' });
    return;
  }

  if (!subscriptions.has(model)) {
    subscriptions.set(model, new Set());
  }
  subscriptions.get(model).add(ws);
  ws.send({ message: `Subscribed to ${model} changes` });
}

function handleUnsubscription(ws, message) {
  const { model } = message;
  if (!model || !subscriptions.has(model)) {
    ws.send({ error: 'Invalid model for unsubscription' });
    return;
  }

  subscriptions.get(model).delete(ws);
  if (subscriptions.get(model).size === 0) {
    subscriptions.delete(model);
  }
  ws.send({ message: `Unsubscribed from ${model} changes` });
}

function removeAllSubscriptions(ws) {
  for (let [model, subscribers] of subscriptions.entries()) {
    subscribers.delete(ws);
    if (subscribers.size === 0) {
      subscriptions.delete(model);
    }
  }
}

async function handleWebSocketMessage(ws, message) {
  try {
    const { type, method, route, data, query } = message;
    // Validate the message format
    if (!type || !method || !route) {
      throw new Error('Invalid message format');
    }
    // Mock headers object
    const headers = {};
    // Convert WebSocket message to an HTTP-like request
    const req = {
      method,
      url: route,
      params: {}, // This will be populated during route matching
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
    const routeHandler = cambusa.app.routes.find((r) => {
      if (r.method !== method.toUpperCase()) return false;

      // Split the route path into segments
      const routeSegments = r.path.split('/');
      const messageSegments = route.split('/');

      if (routeSegments.length !== messageSegments.length) return false;

      // Check if each segment matches or is a parameter
      return routeSegments.every((segment, index) => {
        if (segment.startsWith(':')) {
          req.params[segment.slice(1)] = messageSegments[index];
          return true;
        }
        return segment === messageSegments[index];
      });
    });

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

// Function to broadcast changes to subscribers
export function broadcastChanges(model, action, entity) {
  const subscribers = subscriptions.get(model);
  if (subscribers) {
    const update = { type: 'update', model, action, data: entity };
    subscribers.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update));
      }
    });
  }
}
