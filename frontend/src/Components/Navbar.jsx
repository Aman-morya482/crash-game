import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? 'text-indigo-400 font-semibold'
            : 'hover:text-indigo-400 transition';

    return (
        <div className='grid grid-cols-1 place-items-center'>
            <nav className="bg-gray-900 text-white shadow-md w-full max-w-[1800px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[10vh]">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-indigo-500 text-2xl font-bold">🚀 CRASH GAME</span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <NavLink to="/" className={navLinkClass}>Home</NavLink>
                            <NavLink to="/game" className={navLinkClass}>Play</NavLink>
                            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
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
                    <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/game" className={navLinkClass}>Play</NavLink>
                        <NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink>
                        <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                    </div>
                )}
            </nav>
        </div>
    );
}