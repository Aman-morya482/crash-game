import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login() {
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

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Submitted:', formData);
        
        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(formData)
            });
            const data = await res.json();
            console.log(data);
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
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            pattern="[0-9]{10}"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg font-semibold"
                    >
                        Submit
                    </motion.button>

                    <div className="text-right mt-2 text-sm">
                        <a href="#" className="text-blue-400 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
