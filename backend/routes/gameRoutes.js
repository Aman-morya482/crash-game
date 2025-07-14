const express = require('express');
const router = express.Router();
const Game = require("../models/crashPoints");
const crashPoints = require('../models/crashPoints');

function generateCrashPoint(){
    const r = Math.random();

    if(r < 0.70){
        return +(Math.random()*1 + 1).toFixed(2);
    }else if(r < 0.90){
        return +(Math.random()*3 +2).toFixed(2);
    }else if(r < 0.97){
        return +(Math.random()*5 + 5).toFixed(2);
    }else{
        return +(Math.random()*40 + 10).toFixed(2)
    }
}

router.post('/start', async(req,res)=>{
    try{
        const crashPoint = generateCrashPoint()
        
        const newGame = new Game({crashPoint})
        await newGame.save();
        
        res.status(201).json({crashPoint});
    }catch(error){
        console.error(error.message);
        res.status(500).json({error:"failed to start game"})
    }
})

router.get('/latest', async(req,res)=>{
    try{
        const latestGame = await Game.findOne().sort({createdAt:-1});
        if(!latestGame) return res.status(404).json({error:"No game found"})
        
        res.json({crashPoint: latestGame.crashPoint})
    }catch(error){
        console.error("latest fetch error",error);
        res.status(500).json({error:"failed to fetch latest game"})
    }
})

router.post('/add-crash-points', async(req,res)=>{
    try{

    }
    catch(error){
        console.error("add crashPoint error",error);
        res.status(500).json({error: "failed to add crash point"})
    }
})

router.get('/get-crash-points', async(req,res)=>{
    try{
        const crashes = await Game.find();
        if(!crashes) return;

        res.json({crashPoints:crashes.crashPoint});
    }catch(error){
        console.error("fetch crash points error", error);
        res.status(500).json({error: "failed to fetch crash points"})
    }
})

module.exports = router;