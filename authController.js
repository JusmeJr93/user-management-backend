import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';

//register a new user
export const register = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please fill all the fields.' });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await pool.query(`
            INSERT INTO users (name, email, password, status)
            VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, 'active']
        );

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill all the fields.' });
    }

    try {
        //check if user exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        //check user status
        if (user.status === 'blocked') {
            return res.status(403).json({ error: 'Your account is blocked.' });
        }

        //validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        //update last login time
        await pool.query(`
            UPDATE users
            SET last_login = NOW()
            WHERE id=?`, [user.id]
        );

        //generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login successful', token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};