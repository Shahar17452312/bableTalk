import {WebSocketServer} from 'ws'; // ייבוא מודול ws

const wss = new WebSocketServer({ port: 4000 });
const usersMap=new Map();

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.send(JSON.stringify({type:"connection",message:"hello from ws server"}));
    
    ws.on('message', (data) => {
        const message=JSON.parse(data);
        console.log(message);
        if(message.type==="register"){
            usersMap.set(message.userId,ws);
            console.log("register to the map");
        }
        else if(message.type==="sendMessage"){
            const foundUserWs=usersMap.get(message.message.receiverID._id);
            if(foundUserWs){
                foundUserWs.send(JSON.stringify(message));
                console.log("send message to the client");
            }
        }
        else{
            console.log("no")
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

console.log('WebSocket server running on port 4000');

