const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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

app.listen(8080, ()=>{
    console.log("server running")
});