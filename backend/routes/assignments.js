import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:course_id', async (req, res) => {
    const course_id = req.params.course_id;
    db.query(`SELECT * FROM Assignments WHERE course_id = ${course_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving assignments:', err);
            res.status(500).json({ error: 'Failed to retrieve assignments' });
            return;
        }
        res.json(results);
    });
});

router.post('/:course_id', async (req, res) => {
    const { assignment_name, assignment_description } = req.body;
    const course_id = req.params.course_id;
    db.query(`INSERT INTO Assignments (course_id, title, description) VALUES (${course_id}, '${assignment_name}', '${assignment_description}')`, (err, results) => {
        if (err) {
            console.error('Error adding assignment:', err);
            res.status(500).json({ error: 'Failed to add assignment' });
            return;
        }
        res.json(results);
    });
});

router.put('/:assignment_id', async (req, res) => {
    const assignment_id = req.params.assignment_id;
    const { assignment_name, assignment_description } = req.body;
    db.query(`UPDATE Assignments SET title = '${assignment_name}', description = '${assignment_description}' WHERE assignment_id = ${assignment_id}`, (err, results) => {
        if (err) {
            console.error('Error updating assignment:', err);
            res.status(500).json({ error: 'Failed to update assignment' });
            return;
        }
        res.json(results);
    });
});

router.delete('/:assignment_id', async (req, res) => {
    const assignment_id = req.params.assignment_id;
    db.query(`DELETE FROM Assignments WHERE assignment_id = ${assignment_id}`, (err, results) => {
        if (err) {
            console.error('Error deleting assignment:', err);
            res.status(500).json({ error: 'Failed to delete assignment' });
            return;
        }
        res.json(results);
    });
});

export default router;