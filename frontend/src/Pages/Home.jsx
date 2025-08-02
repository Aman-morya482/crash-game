import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [])

  return (
    <div className='w-full h-screen flex flex-col gap-6 justify-center items-center mt-2'>
      <img src="/Screenshot 2025-07-31 201417.jpg" className='opacity-20 blur-[4px] saturate-150 h-full w-full object-cover' alt="" />
      <div className='absolute flex flex-col justify-center items-center'>
      <button onClick={()=>{navigate("/game")}} className='px-8 md:px-16 py-5 flex justify-center items-center cursor-pointer rounded-full animate-bounce bg-blue-500 border-2 text-3xl ring-blue-400 hover:ring-3'>PLAY NOW 🚀</button>
      <p className='text-xl md:text-4xl mt-3 font-bold tracking-wide dot-animation'>The multiplier is rising</p> 
      <p className='text-xl md:text-4xl mt-2 font-bold tracking-widest'>Will you ride it or crash?</p>
      </div>
    </div>
  )
}

export default Home
