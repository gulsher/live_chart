// const WebSocket = require('ws');

// const PORT = 8080;
// const wss = new WebSocket.Server({ port: PORT });

// console.log(`WebSocket server running on ws://localhost:${PORT}`);

// wss.on('connection', (ws) => {
//   console.log('New client connected');

//   // Send dummy data every second to the client
//   const interval = setInterval(() => {
//     const message = {
//       timestamp: new Date().toISOString(),
//       value: (Math.random() * 100).toFixed(2), // Random value between 0-100
//     };

//     ws.send(JSON.stringify(message));
//   }, 1000);

//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clearInterval(interval);
//   });

//   ws.on('error', (error) => {
//     console.error('WebSocket error:', error);
//   });
// });


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    const dummyData = {
      time: new Date().toLocaleTimeString(),
      lineSpeed: (600 + Math.random() * 50).toFixed(3),
      capacitance: (Math.random() * 2).toFixed(3),
      coldODAverage: (0.07 + Math.random() * 0.01).toFixed(3),
      hotODAverage: (0.07 + Math.random() * 0.01).toFixed(3),
      masterRatio: (1 + Math.random() * 2).toFixed(3),
      screwRPM: (12 + Math.random() * 5).toFixed(3),
      coldDiameterX: (0.07 + Math.random() * 0.01).toFixed(3),
      coldDiameterY: (0.07 + Math.random() * 0.01).toFixed(3),
    };

    ws.send(JSON.stringify(dummyData));
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
