import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/student', async (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM Student WHERE student_email = '${email}' AND student_password = '${password}'`, (err, results) => {
        if (err) {
            console.error('Error retrieving student:', err);
            res.status(500).json({ error: 'Failed to retrieve student' });
            return;
        }
        res.json(results);
    });
});

router.post('/teacher', async (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM Teacher WHERE teacher_email = '${email}' AND teacher_password = '${password}'`, (err, results) => {
        if (err) {
            console.error('Error retrieving student:', err);
            res.status(500).json({ error: 'Failed to retrieve student' });
            return;
        }
        res.json(results);
    });
});


export default router;