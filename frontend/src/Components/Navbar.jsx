import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? 'text-indigo-400 font-semibold px-2 py-1'
            : 'hover:text-indigo-400 transition px-2 py-1';

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/login');
    }
    return (
        <div className='grid grid-cols-1 place-items-center'>
            <nav className="z-100 absolute top-0 bg-neutral-950 text-white shadow-md w-full max-w-[1800px]">
                <div className="w-full px-4 sm:px-6 lg:px-10 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-indigo-500 text-2xl font-bold">🚀 CRASH GAME</span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <NavLink to="/" className={navLinkClass}>Home</NavLink>
                            <NavLink to="/rewards" className={navLinkClass}>Rewards</NavLink>
                            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                            <button onClick={() => { handleLogout() }} className='bg-red-500 cursor-pointer px-2 py-1 rounded-lg'>Logout</button>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 text-xl flex justify-center items-center gap-4">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/rewards" className={navLinkClass}>Rewards</NavLink>
                        <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                        <button onClick={() => { handleLogout() }} className='text-red-600 cursor-pointerrounded-lg'>Logout</button>
                    </div>
                )}
            </nav>
        </div>
    );
}