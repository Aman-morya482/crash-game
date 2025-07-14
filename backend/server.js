const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const http = require('http')
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/game', require('./routes/gameRoutes'));

app.get('/',(req,res)=>{
    res.send("hello world");
})

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
console.log("socket server attached");

const clients = new Set();

wss.on("connection",(ws)=>{
    console.log("client connected");
    clients.add(ws);

    ws.on("closed",()=>{
        console.log("Client disconnected");
        clients.delete(ws)
    })
})

function generateCrashPoint(){
    const r = Math.random();

    if(r < 0.60){
        return +(Math.random()*1 + 1).toFixed(2);
    }else if(r < 0.80){
        return +(Math.random()*3 +2).toFixed(2);
    }else if(r < 0.95){
        return +(Math.random()*5 + 5).toFixed(2);
    }else{
        return +(Math.random()*40 + 10).toFixed(2)
    }
}

function broadCastToClient(data){
    const json = JSON.stringify(data);
    for(let client of clients){
        if(client.readyState === WebSocket.OPEN){
            client.send(json);
        }
    }
}

function gameLoop(){
    const crashAt = generateCrashPoint();
    let multiplier = 1.00.toFixed(2);

    console.log("new round");
    broadCastToClient({type:"START",message:"Round Started!"})

    const interval = setInterval(()=>{
        multiplier = multiplier+0.01.toFixed(2);

        broadCastToClient({
            type:"IN_PROGRESS",
            multiplier: multiplier,
        });

        if(multiplier >= crashAt){
            clearInterval(interval);
            console.log("crashed", multiplier);

            broadCastToClient({
                type:"CRASH",
                multiplier:crashAt,
            });

            const timer1 =  setTimeout(()=>{
                broadCastToClient({
                    type:"WAITING",
                    message:"Next round in 10 seconds"
                })
            },3000)

            const timer2 = setTimeout(()=>{
                gameLoop()
            },10000)

        }
    },50)
}

gameLoop();




server.listen(8080, ()=>{
    console.log("server running")
});