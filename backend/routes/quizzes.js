import express from 'express';
import db from '../db.js';

const router = express.Router();

//get quizzes for a course
router.get('/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const sql = `SELECT * FROM quizzes WHERE course_id = ${courseId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/:studentid/:quizid', (req, res) => {
    const studentId = req.params.studentid;
    const quizId = req.params.quizid;
    db.query(`SELECT EXISTS (
        SELECT * 
        FROM results 
        WHERE quiz_id = ${quizId} AND id IN (
            SELECT result_id 
            FROM student_results 
            WHERE student_id = ${studentId}
        )
    ) as has_user_submitted`, (err, result) => {
        if (result === undefined) {
            res.send({ msg: "No results found" });
        }
        else {
            res.send(result);
        }

    });
});

router.get('/results/:studentId/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const studentId = req.params.studentId;
    const sql = `SELECT * FROM results
    INNER JOIN student_results ON results.id = student_results.result_id AND student_results.student_id = ${studentId} 
    WHERE results.quiz_id = ${quizId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let final_result = [];
        let promises = result.map((element) => {
            return new Promise((resolve, reject) => {
                let question_id = element.question_id;
                let own_answer_id = element.answer_id;
                db.query(`SELECT * FROM questions WHERE id = ${question_id}`, (err, result) => {
                    if (err) reject(err);
                    let question_text = result[0].question_text;
                    db.query(`SELECT * FROM answers WHERE id = ${own_answer_id}`, (err, result) => {
                        if (err) reject(err);
                        let own_answer_text = result[0].answer_text;
                        db.query(`SELECT * FROM answers WHERE question_id = ${question_id} AND is_correct = TRUE`, (err, result) => {
                            if (err) reject(err);
                            let correct_answer_text = result[0].answer_text;
                            final_result.push({
                                question: question_text,
                                answer: own_answer_text,
                                correct_answer: correct_answer_text,
                                is_correct: own_answer_text === correct_answer_text
                            });
                            resolve();
                        });
                    });
                });
            });
        });
        Promise.all(promises)
            .then(() => res.send(final_result))
            .catch((error) => console.error('Error retrieving results:', error));
    });
});



export default router;