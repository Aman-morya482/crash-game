import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/game/userSlice.js';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                dispatch(setCredentials({user:data.user, token: data.token}));
                setTimeout(()=>{
                    navigate('/');
                },2000);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        name="phone"
                        placeholder='Phone number'
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder='password'
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all rounded-lg font-semibold"
                    >
                        Submit
                    </motion.button>

                    <div className="text-right mt-2 text-sm">
                            Not have account ?  
                        <a onClick={()=>{navigate("/signup")}} className="text-blue-400 underline px-1 cursor-pointer">
                            Signup 
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
