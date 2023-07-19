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
    const { assignment_name, assignment_description, assignment_deadline } = req.body;
    const course_id = req.params.course_id;
    db.query(`INSERT INTO Assignments (course_id, title, description, deadline) VALUES (${course_id}, '${assignment_name}', '${assignment_description}', '${assignment_deadline}')`, (err, results) => {
        if (err) {
            console.error('Error adding assignment:', err);
            res.status(500).json({ error: 'Failed to add assignment' });
        }
        let inserted_assignment_id = results.insertId;
        let student_ids = []
        db.query(`SELECT student_id FROM Enrollment WHERE course_id = ${course_id}`, (err, results) => {
            if (err) {
                console.error('Error retrieving student ids:', err);
                res.status(500).json({ error: 'Failed to retrieve student ids' });
            }
            student_ids = results.map((result) => result.student_id);
            student_ids.forEach((student_id) => {
                db.query(`INSERT INTO assignment_state (student_id, assignment_id) VALUES (${student_id}, ${inserted_assignment_id})`, (err, results) => {
                    if (err) {
                        console.error('Error adding assignment state:', err);
                        res.status(500).json({ error: 'Failed to add assignment state' });
                    }
                    res.status(200);
                });
            });
        });
    });
});

//update an assignment
router.put('/:assignment_id', async (req, res) => {
    const assignment_id = req.params.assignment_id;
    const { assignment_name, assignment_description, assignment_deadline } = req.body;
    db.query(`UPDATE Assignments SET title = '${assignment_name}', description = '${assignment_description}', deadline = '${assignment_deadline}' WHERE assignment_id = ${assignment_id}`, (err, results) => {
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


const getStudent = (student_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM Student WHERE student_id = ${student_id}`, (err, results) => {
            if (err) {
                console.error('Error retrieving student:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getState = (student_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM assignment_state WHERE student_id = ${student_id}`, (err, results) => {
            if (err) {
                console.error('Error retrieving assignment state:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getStateFromId = (state_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM states WHERE state_id = ${state_id}`, (err, results) => {
            if (err) {
                console.error('Error retrieving state:', err);
                reject(err);
            } else {
                resolve(results);
            }
        }
        );
    });
};

router.get('/assignment_state/:assignment_id', async (req, res) => {
    const assignment_id = req.params.assignment_id;
    let student_ids = [];
    db.query(`SELECT student_id FROM assignment_state WHERE assignment_id = ${assignment_id}`, async (err, results) => {
        if (err) {
            console.error('Error retrieving student ids:', err);
            res.status(500).json({ error: 'Failed to retrieve student ids' });
        }
        student_ids = results.map((result) => result.student_id);
        let students = [];
        try {
            const student_promises = student_ids.map((student_id) => getStudent(student_id));
            const studentResults = await Promise.all(student_promises);

            studentResults.forEach((results) => {
                results.map((result) =>
                    students.push({ id: result.student_id, name: result.student_name, email: result.student_email })
                );
            });

            const state_promises = student_ids.map((student_id) => getState(student_id));
            const stateResults = await Promise.all(state_promises);
            stateResults.forEach((results) => {
                results.map((result) => {
                    students.forEach((student) => {
                        if (student.id === result.student_id) {
                            student.state_id = result.state_id;
                        }
                    });
                });
            });

            const state_ids = students.map((student) => student.state_id);
            const state_id_promises = state_ids.map((state_id) => getStateFromId(state_id));
            const stateIdResults = await Promise.all(state_id_promises);
            stateIdResults.forEach((results) => {
                results.map((result) => {
                    students.forEach((student) => {
                        if (student.state_id === result.state_id) {
                            student.state_name = result.state_name;
                        }
                    });
                });
            });

            res.json(students);

        } catch (error) {
            console.error('Error retrieving students:', error);
            res.status(500).json({ error: 'Failed to retrieve students' });
        }
    });
});

export default router;