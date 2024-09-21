/**
 * WebSocket handler configuration
 */
export const websocketHandler = (ws) => ({
  /**
   * Handles new WebSocket connections
   */
  open() {
    cambusa.log.debug('WebSocket connected');
    cambusa.wsClients.add(ws);
    ws.subscriptions = new Set();
  },

  /**
   * Handles incoming WebSocket messages
   */
  message(message) {
    handleWebSocketMessage(ws, message);
  },

  /**
   * Handles WebSocket disconnections
   */
  close() {
    cambusa.log.debug('WebSocket disconnected');
    cambusa.wsClients.delete(ws);
  },
});

async function handleWebSocketMessage(ws, message) {
  try {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'subscribe') {
      handleSubscription(ws, parsedMessage);
    } else {
      // Handle other message types if needed
      cambusa.log.debug('Received message:', parsedMessage);
    }
  } catch (error) {
    cambusa.log.error('Error handling WebSocket message:', error);
  }
}

function handleSubscription(ws, message) {
  const { entityName } = message;
  ws.subscriptions.add(entityName);
  ws.send(JSON.stringify({ type: 'subscribed', entityName }));
  cambusa.log.debug(`Client subscribed to ${entityName}`);
}
