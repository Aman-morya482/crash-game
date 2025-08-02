import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'

const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: '',
        confirm: '',
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex = /^[6-9]\d{9}$/;
        const check = regex.test(formData.phone);
        if (!check) return toast.error("Please enter valid number")

        const { username, phone, password, confirm } = formData;
        if (!username || !phone || !password || !confirm) return toast.info("All fields required");
        if (formData.password !== formData.confirm) return toast.info("Both password should match");
        try {
            const res = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Signup successful!');
                navigate('/login');
            }
            else toast.error(data.message);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
        className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            < motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md animate-fadeIn"
            >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Signup</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Name"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />

                <input
                    type="password"
                    name="confirm"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    className="w-full p-3 mb-6 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 text-white cursor-pointer font-semibold py-3 rounded-lg transition duration-300"
                >
                    Create Account
                </button>

                <div className="text-right mt-2 text-sm text-white">
                    Not have account ?
                    <a onClick={() => { navigate("/Login") }} className="text-blue-400 underline px-1 cursor-pointer">
                        Login
                    </a>
                </div>
            </motion.form>
        </div>
    );
};

export default Signup;
