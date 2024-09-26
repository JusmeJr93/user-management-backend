import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { register, login } from './authController.js';
import { verifyAdmin, verifyToken } from './authMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://authmaster-user-management.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

app.options('*', cors());

app.post('/api/register', register);
app.post('/api/login', login);

//protected route to get all users
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, last_login, registration_time, role, status, profile_picture FROM users'
        );

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//protected route to get profile
app.get('/api/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await pool.query(
            'SELECT id, name, email, job_title, department, hire_date, phone_number, gender, profile_picture FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//protected route to block and unblock
app.patch('/api/users/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'blocked') {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    try {
        await pool.query(`
            UPDATE users
         SET status = ?
         WHERE id =? `, [status, id]
        );

        res.json({ message: `User status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//protected route to delete user
app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//protected route to edit user profile
app.put('/api/users/:id', verifyToken, async (req, res) => {

    const { id } = req.params;
    const { name, email, job_title, department, hire_date, phone_number, gender, profile_picture } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Please provide valid name and email.' });
    }

    try {
        const [existingUser] = await pool.query(`
            SELECT * FROM users
            WHERE email = ? AND id != ?`, [email, id]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already in use by another user.' });
        }

        let formattedHireDate = null;
        if (hire_date) {
            formattedHireDate = hire_date.split('T')[0]; // YYYY-MM-DD format
        }

        //updating user info
        await pool.query(`
            UPDATE users 
            SET name = ?, email = ?,  job_title = ?, department = ?, hire_date = ?, phone_number = ?, gender = ?, profile_picture = ?
            WHERE id = ?`, [name, email, job_title, department, formattedHireDate, phone_number, gender, profile_picture, id]
        );

        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});