import {WebSocketServer} from 'ws'; // ייבוא מודול ws
import axios from "axios";

const wss = new WebSocketServer({ port: 4000 });

const clients=new Map();

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async(jsonData) => {
      const data=JSON.parse(jsonData);
       if(data.action==="saveID"){
        clients.set(data.userID,ws);
        console.log("saved new user: "+data.userID);
       }
       if(data.action==="saveMessage"){
        console.log(data.message.receiverID);
        try{
            const receiverID=data.message.receiverID;
            await saveMessage(data.conversationID,data.message,data.token);
            if (clients.has(receiverID)) {
              console.log("sent the message to the client");
              clients.get(receiverID).send(JSON.stringify(data));
            } else {
                console.log(`Receiver with ID ${receiverID} is not connected.`);
            }

        }

        catch(error){
            console.error("error:",error.message);
            
        }
       }

    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

console.log('WebSocket server running on port 4000');


async function saveMessage(conversationID,message,token) {
      const updatedConversation=await axios.post("http://localhost:3000/user/addMessage/"+message.senderID,{
        conversationID:conversationID,
        message:{
          senderID:message.senderID,
          receiverID:message.receiverID,
          messageContent:message.messageContent,
          language:message.language
        }
      },{
        headers:{
          Authorization:"Bearer "+token
        }
      });

      return updatedConversation;
    
    



  }

