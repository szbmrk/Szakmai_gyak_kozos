import express from 'express';
import db from '../db.js';

const router = express.Router();

//get teachers
router.get('/', async (req, res) => {
    db.query('SELECT teacher.*, GROUP_CONCAT(Course.course_name) AS courses FROM teacher LEFT JOIN course ON teacher.teacher_id = course.teacher_id GROUP BY teacher.teacher_id;', (err, results) => {
        if (err) {
            console.error('Error retrieving teachers:', err);
            res.status(500).json({ error: 'Failed to retrieve teachers' });
            return;
        }
        res.json(results);
    });
});

//get own assignments
router.get('/:teacher_id/assignments', async (req, res) => {
    const teacher_id = req.params.teacher_id;
    db.query(`SELECT assignments.*, course.course_name FROM assignments JOIN course ON assignments.course_id = course.course_id JOIN teacher ON course.teacher_id = teacher.teacher_id WHERE teacher.teacher_id = ${teacher_id};`, (err, results) => {
        if (err) {
            console.error('Error retrieving assignments:', err);
            res.status(500).json({ error: 'Failed to retrieve assignments' });
            return;
        }
        res.json(results);
    });
});

//get own courses
router.get('/:teacher_id/courses', async (req, res) => {
    const teacher_id = req.params.teacher_id;

    db.query(`SELECT * FROM Course WHERE teacher_id = ${teacher_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving courses:', err);
            res.status(500).json({ error: 'Failed to retrieve courses' });
            return;
        }
        res.json(results);
    });
});

export default router;