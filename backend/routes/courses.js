import express from 'express';
import db from '../db.js';

const router = express.Router();

//get courses for a student
router.get('/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    db.query(`SELECT * FROM Course LEFT JOIN Enrollment ON Enrollment.course_id = Course.course_id 
    WHERE Enrollment.student_id = ${student_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving courses:', err);
            res.status(500).json({ error: 'Failed to retrieve courses' });
            return;
        }
        res.json(results);
    });
});

//get available courses for a student
router.get('/available/:student_id', async (req, res) => {
    const student_id = req.params.student_id;
    db.query(`SELECT * FROM Course WHERE course_id NOT IN (SELECT course_id FROM Enrollment WHERE student_id = ${student_id})`, (err, results) => {
        if (err) {
            console.error('Error retrieving available courses:', err);
            res.status(500).json({ error: 'Failed to retrieve available courses' });
            return;
        }
        res.json(results);
    });
});

//enroll a student in a course
router.post('/enroll', async (req, res) => {
    const { student_id, course_id } = req.body;
    db.query(`INSERT INTO Enrollment (student_id, course_id) VALUES (${student_id}, ${course_id})`, (err, results) => {
        if (err) {
            console.error('Error enrolling student:', err);
            res.status(500).json({ error: 'Failed to enroll student' });
            return;
        }
        res.json(results);
    })
});

//create a course
router.post('/', async (req, res) => {
    const { teacher_id, course_name, course_description } = req.body;
    db.query(`INSERT INTO Course (teacher_id, course_name, course_description) VALUES (${teacher_id}, '${course_name}', '${course_description}')`, (err, results) => {
        if (err) {
            console.error('Error adding course:', err);
            res.status(500).json({ error: 'Failed to add course' });
            return;
        }
        res.json(results);
    });
});

//update a course
router.put('/:course_id', async (req, res) => {
    const course_id = req.params.course_id;
    const { course_name, course_description } = req.body;
    db.query(`UPDATE Course SET course_name = '${course_name}', course_description = '${course_description}' WHERE course_id = ${course_id}`, (err, results) => {
        if (err) {
            console.error('Error updating course:', err);
            res.status(500).json({ error: 'Failed to update course' });
            return;
        }
        res.json(results);
    });
});

//delete a course
router.delete('/:course_id', async (req, res) => {
    const course_id = req.params.course_id;
    db.query(`DELETE FROM Course WHERE course_id = ${course_id}`, (err, results) => {
        if (err) {
            console.error('Error deleting course:', err);
            res.status(500).json({ error: 'Failed to delete course' });
            return;
        }
        res.json(results);
    });
});

router.post('/:course_id/content', async (req, res) => {
    const course_id = req.params.course_id;
    const { title, lecture_text } = req.body;
    const query = 'INSERT INTO course_contents (course_id, title, lecture_text) VALUES (?, ?, ?)';
    const values = [course_id, title, lecture_text];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error adding content:', err);
            res.status(500).json({ error: 'Failed to add content' });
            return;
        }
        res.json(results);
    });
});

router.get('/:course_id/contents', async (req, res) => {
    const course_id = req.params.course_id;
    db.query(`SELECT * FROM course_contents WHERE course_id = ${course_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving content:', err);
            res.status(500).json({ error: 'Failed to retrieve content' });
            return;
        }
        res.json(results);
    });
});

export default router;