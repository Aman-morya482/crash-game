import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
const router = express.Router();


router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect Password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '2h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                phone: user.phone,
                amount: user.amount,
                expPoint: user.expPoint,
            }
        });
    } catch (error) {
        console.error("login err", error);
        res.status(500).json({ message: "Server error" })
    }
});

router.post('/signup', async (req, res) => {
    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const user = User.findOne({ phone });
        if (user) return res.status(409).json({ message: "User already exists" });

        // const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            phone,
            password: hashedPassword,
            amount: 0,
            expPoint: 0,
        })

        await newUser.save();
        res.status(201).json({ message: "Signup successful" })
        console.log("done")
    } catch (error) {
        console.error("signup error", error)
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;