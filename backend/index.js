const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send dummy data every second to the client
  const interval = setInterval(() => {
    const message = {
      timestamp: new Date().toISOString(),
      value: (Math.random() * 100).toFixed(2), // Random value between 0-100
    };

    ws.send(JSON.stringify(message));
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
