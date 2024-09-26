import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import { check, validationResult } from 'express-validator';

//register a new user
export const register = [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Please provide a valid email address.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        try {
            const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'User already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                'INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'active']
            );
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

//user login
export const login = [
    check('email').isEmail().withMessage('Please provide a valid email address.'),
    check('password').notEmpty().withMessage('Password is required.'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = rows[0];
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            if (user.status === 'blocked') {
                return res.status(403).json({ error: 'Your account is blocked.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials.' });
            }

            await pool.query(
                'UPDATE users SET last_login = NOW() WHERE id = ?',
                [user.id]
            );

            const token = jwt.sign({ userId: user.id, userRole: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];