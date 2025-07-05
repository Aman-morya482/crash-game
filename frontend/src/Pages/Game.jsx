import React, { useEffect, useRef, useState } from 'react'
import { setCrashPoint } from '../features/game/gameSlice';
import '../App.css'

const Game = () => {

  const bets = [
    { amount: 2000, crash: 3.76, cashout: 2803 },
    { amount: 200, crash: 1.32, cashout: 492 },
    { amount: 800, crash: 12.32, cashout: 10132 },
    { amount: 2000, crash: 2.32, cashout: 2132 },
    { amount: 2000, crash: 2.32, cashout: 2132 },
    { amount: 2500, crash: 1.53, cashout: 3780 },
    { amount: 2000, crash: 3.76, cashout: 2803 },
    { amount: 200, crash: 1.32, cashout: 492 },
    { amount: 800, crash: 12.32, cashout: 10132 },
    { amount: 2000, crash: 2.32, cashout: 2132 },
    { amount: 2000, crash: 2.32, cashout: 2132 },
    { amount: 2500, crash: 1.53, cashout: 3780 },
    { amount: 800, crash: 1.67, cashout: 1225 }
  ]
  const [amount, setAmount] = useState(100);
  const [bet, setBet] = useState(10);
  const [bet2, setBet2] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [multi, setMulti] = useState(1.00);
  const [timer, setTimer] = useState(10.00);
  const [showTimer, setShowTimer] = useState(true);
  const [crashpoint, setCrashPoint] = useState(null);
  const [crashed, setCrashed] = useState(false);
  const [crashArray, setCrashArray] = useState([]);
  const [playedBet, setPlayedBet] = useState(false);
  const [outCash, setOutCash] = useState(false);
  const intervalRef = useRef(null);
  const playedBetRef = useRef(false);

  useEffect(() => {
    playedBetRef.current = playedBet;
  }, [playedBet]);

  const startLoading = () => {
    console.log("start played ", playedBet, " outcash ", outCash)
    setShowTimer(true);
    setCrashed(false);
    setCrashPoint(null);
    setMultiplier(1.00);
    setTimeout(() => {
      setShowTimer(false);
      startGame();
    }, 8000)
  }

  const startGame = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json();
      setCrashPoint(data.crashPoint);
      setMultiplier(1.00);
      startFlite(data.crashPoint);
      console.log(data.crashPoint);
    } catch (error) {
      console.error("Failed to start", error);
    }
  }

  const startFlite = (val) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = parseFloat((prev + 0.01).toFixed(2));
        if (next >= val) {
          clearInterval(intervalRef.current);
          console.log("💥 Crashed at:", multiplier);
          console.log("Lost", bet, "in crash");
          console.log("played", playedBetRef.current, "outcash", outCash, "bet", bet , "crashed", crashed)
          setCrashed(true);
          setCrashArray(pre => {
            const updated = [...pre];
            if (updated.length >= 50) {
              updated.shift();
            }
            updated.push(val);
            return updated;
          })
          
          // Start next game after 3s
          setTimeout(() => {
            startLoading();
            setMultiplier(1.00)
          }, 3000);
          setPlayedBet(false);
          setOutCash(false);
        }
        return next;
      });
    }, 80);
  }

  useEffect(() => {
    startLoading();
  }, [])

  const cashout = () => {
    if (!outCash && playedBet) {
      const profit = bet * multiplier;
      console.log("cashout with", profit, "rupees")
      setAmount(pre => pre + profit)
      console.log()
      setPlayedBet(false);
      setOutCash(true);
    }
  }

  useEffect(()=>{
    console.log("played", playedBet, "bet", bet, "outcash", outCash)
  }, [playedBet,bet,outCash])

  return (
    <div className='grid grid-cols-1 place-items-center bg-black/60'>
      <div className='bg-black/80 w-full max-w-[1800px] h-full text-white'>
        <div className='flex justify-between items-center w-full bg-black/40 px-10 py-1 text-xl font-semibold'>
          <p>🚀 CRASH GAME</p>
          <div className='flex gap-4 items-center text-gray-400'>
            <p className='text-green-400 font-bold'>{amount.toFixed(2)} <span className='text-gray-400 text-xs'>INR</span></p>
            <p className='text-2xl'>⪡</p>
          </div>
        </div>

        <div className='flex gap-4 mt-2 px-2'>

          <div className='bg-black/40 w-[25vw] py-4 px-2 font-semibold rounded-2xl'>
            <p className='text-center text-xl p-2 bg-black/50 rounded-full text-yellow-300'>BET HISTORY</p>
            <div className='mt-6 text-xs px-1 max-h-[75vh] overflow-y-scroll'>
              <p className=''>TOTAL BETS</p>
              <p>06</p>
              <div className="flex justify-between items-center px-4 py-2 mt-1 text-gray-200"><p>Bet </p><p> X</p><p>Cash out</p></div>
              {
                bets.map((item, index) => {
                  return (
                    <div key={index} className="flex justify-between items-center px-4 py-2 mt-2 rounded-md bg-black/50"><p>{item.amount}.00</p><p className={`border-2 px-4 py-[1.5px] rounded-3xl ${item.crash < 2.00 ? "border-red-300 bg-rose-500/80" : item.crash < 10.00 ? "border-blue-300 bg-blue-500/50" : "border-green-300 bg-green-500/50"}`}>{item.crash}x</p><p>{item.cashout}.00</p></div>
                  )
                })
              }
            </div>
          </div>

          <div className='w-[75vw] bg-black/70 rounded-2xl p-2'>
            <div className='flex items-center gap-3 justify-end overflow-hidden'>
              {
                crashArray.map((item, index) => {
                  return (
                    <p key={index} className={`font-semibold bg-gray-950 text-sm px-3 py-1 rounded-full ${item < 2.00 ? "text-red-500" : item < 10 ? "text-blue-500" : "text-green-500"}`}>{item.toFixed(2)}x</p>
                  )
                })
              }
            </div>
            <div className='flex justify-center items-center my-3 h-[60vh] border border-gray-500 rounded-3xl'>
              {!showTimer ? <p className='text-5xl'>{multiplier.toFixed(2)}</p> : <div className='flex flex-col justify-center items-center gap-3'> <p className='text-2xl'>Start in</p> <div className='w-[200px] h-[5px] bg-red-500 rounded-2xl relative overflow-hidden'><div className='loading absolute w-[200px] h-[5px] bg-white'></div></div></div>}
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex flex-col gap-6 justify-center items-center bg-gray-600/40 rounded-2xl w-full px-4 py-2'>
                <div className='flex gap-4 px-4 py-1 rounded-xl bg-black/60'>
                  <p className=''>Bet |</p>
                  <p>Auto</p>
                </div>
                <div className='flex gap-4 justify-center items-center flex-wrap'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex bg-black/60 rounded-xl px-4 py-1'>
                      <button className='border px-[9px] text-xl bg-black rounded-full'>-</button>
                      <input type="text" className='w-[80px] outline-none text-center' onChange={(e) => setBet(parseFloat(e.target.value))} value={bet.toFixed(2)} />
                      <button className='border px-[9px] text-lg bg-black rounded-full'>+</button>
                    </div>
                    <div className='grid grid-cols-2 gap-x-1 gap-y-1'>
                      <p onClick={() => setBet(10)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>10</p>
                      <p onClick={() => setBet(100)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>100</p>
                      <p onClick={() => setBet(500)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>500</p>
                      <p onClick={() => setBet(1000)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>1000</p>
                    </div>
                  </div>
                  <button disabled={!showTimer && !playedBet} onClick={() => { if(!playedBet){setPlayedBet(true);setOutCash(false);setAmount(pre => pre - bet);}else{cashout()} }} className={`${playedBet ? "bg-yellow-400" : "bg-green-600"} border-2 border-green-300 rounded-3xl py-4 px-18 text-2xl font-semibold`}><h1>BET</h1><h2>{bet.toFixed(2)}</h2></button>
                </div>
              </div>
              <div className='flex flex-col gap-6 justify-center items-center bg-gray-600/40 rounded-2xl w-full px-4 py-2'>
                <div className='flex gap-4 px-4 py-1 rounded-xl bg-black/60'>
                  <p className=''>Bet |</p>
                  <p>Auto</p>
                </div>
                <div className='flex gap-4 justify-center items-center flex-wrap'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex bg-black/60 rounded-xl px-4 py-1'>
                      <button className='border px-[9px] text-xl bg-black rounded-full'>-</button>
                      <input type="text" className='w-[80px] outline-none text-center' onChange={(e) => setBet2(parseFloat(e.target.value))} value={bet2.toFixed(2)} />
                      <button className='border px-[9px] text-lg bg-black rounded-full'>+</button>
                    </div>
                    <div className='grid grid-cols-2 gap-x-1 gap-y-1'>
                      <p onClick={() => setBet2(10)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>10</p>
                      <p onClick={() => setBet2(100)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>100</p>
                      <p onClick={() => setBet2(500)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>500</p>
                      <p onClick={() => setBet2(1000)} className='active:scale-95 bg-black/40 text-center px-2 rounded-xl'>1000</p>
                    </div>
                  </div>
                  <button className='bg-green-600 border-2 border-green-300 rounded-3xl py-4 px-18 text-2xl font-semibold'><h1>BET</h1><h2>{bet2.toFixed(2)}</h2></button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
