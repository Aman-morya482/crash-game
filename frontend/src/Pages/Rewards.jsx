import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { incrementAmount } from '../features/game/userSlice';
import { updateAmountInDB } from '../utils/AmountInDB';

const Rewards = () => {

    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const amount = useSelector((state) => state.game.user.amount);
    const [stats, setStats] = useState(null);

    const fetchBets = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch('http://localhost:8080/api/myBets', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setStats(data.data);
        } catch (error) {
            console.error("bet fetching error", error);
        }
    }
    useEffect(() => {
        fetchBets();
    }, []);


    const [rewards, setRewards] = useState(() => {
        const stored = localStorage.getItem("reward");
        return stored
            ? JSON.parse(stored)
            : {
                login: { loginAt: new Date().toDateString(), claimed: false },
                bet_100: { achieved: false, claimed: false },
                bet_200: { achieved: false, claimed: false },
                bet_500: { achieved: false, claimed: false },
                bet_1000: { achieved: false, claimed: false },
                cashout_5x: { achieved: false, claimed: false },
                cashout_10x: { achieved: false, claimed: false },
                cashout_20x: { achieved: false, claimed: false },
                played_1: { achieved: false, claimed: false },
                played_10: { achieved: false, claimed: false },
                played_20: { achieved: false, claimed: false },
                win_500: { achieved: false, claimed: false },
                win_1000: { achieved: false, claimed: false },
            };
    });


    useEffect(() => {
        localStorage.setItem("reward", JSON.stringify(rewards));
    }, [rewards]);

    useEffect(() => {
        const today = new Date().toDateString();
        if (rewards.login.loginAt !== today) {
            setRewards(prev => ({
                ...prev,
                login: { loginAt: today, claimed: false }
            }));
        }
    }, []);


    useEffect(() => {
        if (!stats) return;

        const updated = { ...rewards };

        let totalBetAmount = 0;
        let totalPlayed = stats.length;
        let totalProfit = 0;

        stats.forEach(bet => {
            const { bet: betAmount, profit, multiplier } = bet;

            totalBetAmount += betAmount;
            totalProfit += profit;

            // Multiplier-based rewards
            if (multiplier >= 5) updated.cashout_5x.achieved = true;
            if (multiplier >= 10) updated.cashout_10x.achieved = true;
            if (multiplier >= 20) updated.cashout_20x.achieved = true;

            // Win rewards
            if (profit >= 500) updated.win_500.achieved = true;
            if (profit >= 1000) updated.win_1000.achieved = true;
        });

        // 🔥 Total Bet Rewards (cumulative)
        if (totalBetAmount >= 100) updated.bet_100.achieved = true;
        if (totalBetAmount >= 200) updated.bet_200.achieved = true;
        if (totalBetAmount >= 500) updated.bet_500.achieved = true;
        if (totalBetAmount >= 1000) updated.bet_1000.achieved = true;

        // Played Count Rewards
        if (totalPlayed >= 1) updated.played_1.achieved = true;
        if (totalPlayed >= 10) updated.played_10.achieved = true;
        if (totalPlayed >= 20) updated.played_20.achieved = true;

        setRewards(prev => ({ ...prev, ...updated }));
    }, [stats]);


    const getReward = (newAmount) => {
        user.amount += newAmount;
        localStorage.setItem("user", user);
        updateAmountInDB(amount + newAmount);
        dispatch(incrementAmount(newAmount));
        toast.success(`${newAmount} amount received`);
    }

    const claimLogin = (newAmount = 20) => {
        user.amount += newAmount;
        localStorage.setItem("user", user);
        updateAmountInDB(amount + newAmount);
        dispatch(incrementAmount(newAmount));
        toast.success(`${newAmount} amount received`);
        setRewards(prev => ({
            ...prev,
            login: { ...prev.login, claimed: true }
        }))
    }

    const claimReward = (rewardKey, newAmount) => {
        if (!rewards[rewardKey]?.achieved || rewards[rewardKey]?.claimed) return;

        user.amount += newAmount;
        localStorage.setItem("user", user);
        updateAmountInDB(amount + newAmount);
        dispatch(incrementAmount(newAmount));
        toast.success(`${newAmount} amount received`);

        const updated = {
            ...rewards,
            [rewardKey]: {
                ...rewards[rewardKey],
                claimed: true,
            },
        };

        setRewards(updated);
        localStorage.setItem("reward", JSON.stringify(updated));
    };


    return (
        <div className='w-full bg-neutral-800 flex flex-col gap-10 justify-center items-center py-20'>
            <div className='w-[90vw] max-w-[900px] bg-neutral-700 text-lg rounded-xl overflow-hidden mt-10'>
                <div className='text-3xl font-extrabold bg-neutral-900 py-4 px-4'>Login Rewards</div>
                <div className='flex flex-col gap-6 px-4 py-4 mt-2'>
                    <div className='flex justify-between items-center w-full'>
                        <p>Daily Login</p>
                        <button disabled={rewards.login.claimed} onClick={() => claimLogin()} className={`px-6 py-1 cursor-pointer font-bold rounded-full ${rewards.login.claimed ? "bg-gray-400" : "bg-yellow-400"}`}>₹ 20</button>
                    </div>
                </div>
            </div>
            <div className='w-[90vw] max-w-[900px] bg-neutral-700 text-lg rounded-xl overflow-hidden'>
                <div className='text-3xl font-extrabold bg-neutral-900 py-4 px-4'>Bet Rewards</div>
                <div className='flex flex-col gap-6 px-4 py-4 mt-2'>
                    <div className='flex justify-between items-center w-full'>
                        <p>Bet ₹100</p>
                        <button disabled={rewards.bet_100.claimed} onClick={() => { claimReward("bet_100", 20) }} className={`px-6 cursor-pointer py-1 font-bold rounded-full ${rewards.bet_100.achieved && !rewards.bet_100.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 20</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Bet ₹200</p>
                        <button disabled={rewards.bet_200.claimed} onClick={() => { claimReward("bet_200", 30) }} className={`px-6 py-1 font-bold cursor-pointer rounded-full ${rewards.bet_200.achieved && !rewards.bet_200.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 30</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Bet ₹500</p>
                        <button disabled={rewards.bet_500.claimed} onClick={() => { claimReward("bet_500", 100) }} className={`px-6 py-1 cursor-pointer font-bold rounded-full ${rewards.bet_500.achieved && !rewards.bet_500.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 100</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Bet ₹1000</p>
                        <button disabled={rewards.bet_1000.claimed} onClick={() => { claimReward("bet_1000", 200) }} className={`px-6 py-1 font-bold cursor-pointer rounded-full ${rewards.bet_1000.achieved && !rewards.bet_1000.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 200</button>
                    </div>
                </div>
            </div>

            <div className='w-[90vw] max-w-[900px] bg-neutral-700 text-lg rounded-xl overflow-hidden'>
                <div className='text-3xl font-extrabold bg-neutral-900 py-4 px-4'>Multiplier Rewards</div>
                <div className='flex flex-col gap-6 px-4 py-4 mt-2'>
                    <div className='flex justify-between items-center w-full'>
                        <p>Cashout at 5x</p>
                        <button disabled={rewards.cashout_5x.claimed} onClick={() => { claimReward("cashout_5x", 20) }} className={`px-6 py-1 font-bold cursor-pointer rounded-full ${rewards.cashout_5x.achieved && !rewards.cashout_5x.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 20</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Cashout at 10x</p>
                        <button disabled={rewards.cashout_10x.claimed} onClick={() => { claimReward("cashout_10x", 50) }} className={`px-6 py-1 font-bold rounded-full cursor-pointer ${rewards.cashout_10x.achieved && !rewards.cashout_10x.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 50</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Cashout at 20x</p>
                        <button disabled={rewards.cashout_20x.claimed} onClick={() => { claimReward("cashout_20x", 100) }} className={`px-6 py-1 font-bold rounded-full cursor-pointer ${rewards.cashout_20x.achieved && !rewards.cashout_20x.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 100</button>
                    </div>
                </div>
            </div>
            <div className='w-[90vw] max-w-[900px] bg-neutral-700 text-lg rounded-xl overflow-hidden'>
                <div className='text-3xl font-extrabold bg-neutral-900 py-4 px-4'>Achievement Rewards</div>
                <div className='flex flex-col gap-6 px-4 py-4 mt-2'>
                    <div className='flex justify-between items-center w-full'>
                        <p>Played bet 1 time</p>
                        <button disabled={rewards.played_1.claimed} onClick={() => { claimReward("played_1", 20) }} className={`px-6 py-1 font-bold rounded-full cursor-pointer ${rewards.played_1.achieved && !rewards.played_1.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 20</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Played bets 10 times</p>
                        <button disabled={rewards.played_10.claimed} onClick={() => { claimReward("played_10", 30) }} className={`px-6 py-1 font-bold rounded-full cursor-pointer ${rewards.played_10.achieved && !rewards.played_10.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 30</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Played bets 20 times</p>
                        <button disabled={rewards.played_20.claimed} onClick={() => { claimReward("played_20", 50) }} className={`px-6 py-1 font-bold rounded-full cursor-pointer  ${rewards.played_20.achieved && !rewards.played_20.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 50</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Total Winnings ₹500</p>
                        <button disabled={rewards.win_500.claimed} onClick={() => { claimReward("win_500", 20) }} className={`px-6 py-1 font-bold rounded-full  cursor-pointer ${rewards.win_500.achieved && !rewards.win_500.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 20</button>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p>Total Winnings ₹1000</p>
                        <button disabled={rewards.win_1000.claimed} onClick={() => { claimReward("win_1000", 50) }} className={`px-6 py-1 font-bold rounded-full  cursor-pointer ${rewards.win_1000.achieved && !rewards.win_1000.claimed ? "bg-yellow-400" : "bg-gray-400"}`}>₹ 50</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rewards
