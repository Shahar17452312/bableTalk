import {WebSocketServer} from 'ws'; // ייבוא מודול ws

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send("got your message");
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

console.log('WebSocket server running on port 4000');

