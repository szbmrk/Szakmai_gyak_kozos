import express from 'express';
import db from '../db.js';

const router = express.Router();

//get assignments for a course
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

//create an assignment
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

//update an assignment
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

//delete an assignment
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

router.get("/states", (req, res) => {
    const query = `SELECT * FROM states`;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error retrieving states");
            return;
        }
        res.json(results);
    });
});

router.get("/assignment_state", (req, res) => {
    const { studentId, assignmentId } = req.body;

    // SQL query to fetch assignment_state based on student_id and assignment_id
    const query = `
      SELECT * FROM assignment_state
      WHERE student_id = ${studentId} AND assignment_id = ${assignmentId}
    `;

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error retrieving assignment_state");
            return;
        }

        // Send the retrieved assignment_state as the response
        res.json(results);
    });
});

router.get("/:courseId/:studentId", (req, res) => {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;

    // SQL query to retrieve assignment data with assignment_state
    const query = `
      SELECT Assignments.assignment_id, Assignments.title, Assignments.description, GROUP_CONCAT(assignment_state.state_id) AS assignment_state
      FROM Assignments
      INNER JOIN assignment_state ON Assignments.assignment_id = assignment_state.assignment_id
      WHERE Assignments.course_id = ${courseId} AND assignment_state.student_id = ${studentId}
      GROUP BY Assignments.assignment_id
    `;

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Error retrieving assignment data");
            return;
        }

        console.log(results);

        // Process the assignment_state as an array
        const assignmentData = results.map((assignment) => ({
            assignment_id: assignment.assignment_id,
            title: assignment.title,
            description: assignment.description,
            assignment_state: assignment.assignment_state.split(",").map(Number),
        }));

        console.log(assignmentData);
        res.json(assignmentData);
    });
});

export default router;