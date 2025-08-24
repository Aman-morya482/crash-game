import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [])

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
      setStats(calculateBetStats(data.data));
    } catch (error) {
      console.error("bet fetching error", error);
    }
  }

  useEffect(() => {
    fetchBets();
  }, [])

  function calculateBetStats(betHistory) {
    let totalBets = 0;
    let totalCashout = 0;
    let totalLoss = 0;
    let totalWins = 0;

    betHistory.forEach((bet) => {
      totalBets += bet.bet;
      totalCashout += bet.cashout;

      if (bet.cashout === 0) {
        totalLoss += bet.bet;
      } else {
        totalWins += bet.cashout;
      }
    });

    const totalProfit = totalCashout - totalBets;

    return {
      totalBets,
      totalCashout,
      totalProfit,
      totalLoss,
      totalWins,
      totalGames: betHistory.length,
      winningGames: betHistory.filter(bet => bet.cashout > 0).length,
      losingGames: betHistory.filter(bet => bet.cashout === 0).length,
      winRate: ((betHistory.filter(bet => bet.cashout > 0).length / betHistory.length) * 100)
    };
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className='w-full min-h-screen bg-neutral-900 flex justify-center items-center py-10'>
      <div className='w-[90%] max-w-[1000px] bg-neutral-700 md:flex rounded-2xl overflow-hidden mt-10'>
        <div className='w-full'>
          {stats &&
            <>
              <div className='px-6 py-4 bg-neutral-800 font-bold text-shadow-2xl text-2xl md:flex justify-between'>
                <div className='md:flex items-center gap-4'>
                  <div className='h-[35px] w-[35px] rounded-full bg-red-600 uppercase flex justify-center items-center text-base bg-gradient-to-br from-blue-300 to-blue-600'>{user.username[0]}</div>
                  <p className='capitalize'>{user.username}</p>
                  <p className='text-base inline-block bg-amber-300 px-4 rounded-full text-black'>XP {stats.totalBets}</p>
                </div>
                <div className='text-right'>{user.amount.toFixed(2)} <span className='text-sm'>INR</span></div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 place-items-center mt-20 gap-y-6'>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Total Bets</p>
                  <p className='font-bold'>{stats.totalGames}</p>
                </div>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Total Wins</p>
                  <p className='font-bold'>{stats.totalWins.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Total Lose</p>
                  <p className='font-bold'>{stats.totalLoss.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Bet Amount</p>
                  <p className='font-bold'>{stats.totalBets.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Total Profit</p>
                  <p className='font-bold'>{stats.totalProfit <= 0 ? 0.00 : stats.totalProfit.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center text-2xl'>
                  <p className='text-gray-300'>Win Rate</p>
                  <p className='font-bold'>{isNaN(stats.winRate) ? 0 : stats.winRate.toFixed(2)}%</p>
                </div>
              </div>
              <div className='flex justify-center mt-20 pb-6'>
                <button onClick={() => { handleLogout() }} className='px-12 py-2 rounded-full bg-red-500 text-2xl border-2 cursor-pointer'>LOGOUT</button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile
