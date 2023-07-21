import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const sql = `SELECT * FROM quizzes WHERE course_id = ${courseId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/results/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const sql = `SELECT * FROM results
    INNER JOIN student_results ON results.id = student_results.result_id
    INNER JOIN student ON student_results.student_id = student.student_id WHERE results.quiz_id = ${quizId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let final_result = [];
        let promises = result.map((element) => {
            return new Promise((resolve, reject) => {
                let student_name = element.student_name;
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
                                student_name: student_name,
                                question: question_text,
                                is_correct: own_answer_text === correct_answer_text
                            });
                            resolve();
                        });
                    });
                });
            });
        });
        Promise.all(promises)
            .then(() => {
                let temp_result = final_result.reduce((acc, curr) => {
                    if (acc[curr.student_name]) {
                        acc[curr.student_name].push(curr);
                    } else {
                        acc[curr.student_name] = [curr];
                    }
                    return acc;
                }, {});

                final_result = Object.keys(temp_result).map((key) => {
                    return {
                        student_name: key,
                        questions: temp_result[key]
                    };
                });

                res.json(final_result)
            })
            .catch((error) => console.error('Error retrieving results:', error));
    });
});

router.get('/:studentId/:quizId', (req, res) => {
    const studentId = req.params.studentId;
    const quizId = req.params.quizId;
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
            .then(() => res.json(final_result))
            .catch((error) => console.error('Error retrieving results:', error));
    });
});

router.get('/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const sql = `SELECT * FROM quizzes WHERE course_id = ${courseId}`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving quizzes:', err);
            res.status(500).json({ error: 'Failed to retrieve quizzes' });
            return;
        }
        res.json(results);
    });
});


router.post('/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const quizTitle = req.body.quiz_title;
    const quizDescription = req.body.quiz_description;
    db.query(`INSERT INTO quizzes (course_id, title, description) VALUES (${courseId}, '${quizTitle}', '${quizDescription}')`, (err, results) => {
        if (err) {
            console.error('Error retrieving quizzes:', err);
            res.status(500).json({ error: 'Failed to retrieve quizzes' });
            return;
        }
        res.json(results);
    });
});

router.put('/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const quizTitle = req.body.quiz_title;
    const quizDescription = req.body.quiz_description;
    db.query(`UPDATE quizzes SET title = '${quizTitle}', description = '${quizDescription}' WHERE id = ${quizId}`, (err, results) => {
        if (err) {
            console.error('Error retrieving quizzes:', err);
            res.status(500).json({ error: 'Failed to retrieve quizzes' });
            return;
        }
        res.json(results);
    });
});

router.delete('/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    db.query(`DELETE FROM quizzes WHERE id = ${quizId}`, (err, results) => {
        if (err) {
            console.error('Error retrieving quizzes:', err);
            res.status(500).json({ error: 'Failed to retrieve quizzes' });
            return;
        }
        res.json(results);
    });
});

router.get('/questions/get/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const sql = `SELECT * FROM questions WHERE quiz_id = ${quizId}`;
    db.query(sql, (err, question_results) => {
        if (err) {
            console.error('Error retrieving questions:', err);
            res.status(500).json({ error: 'Failed to retrieve questions' });
            return;
        }
        let final_result = [];
        let promises = question_results.map((element) => {
            return new Promise((resolve, reject) => {
                let question_id = element.id;
                db.query(`SELECT * FROM answers WHERE question_id = ${question_id}`, (err, answer_results) => {
                    if (err) reject(err);
                    final_result.push({
                        question: element,
                        answers: answer_results
                    });
                    resolve();
                });
            });
        }
        );
        Promise.all(promises)
            .then(() => res.json(final_result))
            .catch((error) => console.error('Error retrieving results:', error));
    });
});

router.put('/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    const questionText = req.body.question_text;
    const questionAnswers = req.body.question_answers;
    db.query(`UPDATE questions SET question_text = '${questionText}' WHERE id = ${questionId}`, (err, results) => {
        if (err) {
            console.error('Error retrieving questions:', err);
            res.status(500).json({ error: 'Failed to retrieve questions' });
            return;
        }
        let promises = questionAnswers.map((element) => {
            return new Promise((resolve, reject) => {
                let answer_id = element.id;
                let answer_text = element.answer_text;
                let is_correct = element.is_correct;
                db.query(`UPDATE answers SET answer_text = '${answer_text}', is_correct = ${is_correct} WHERE id = ${answer_id}`, (err, results) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
        Promise.all(promises)
            .then(() => res.json(results))
            .catch((error) => console.error('Error retrieving results:', error));
    });
});

router.delete('/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    db.query(`DELETE FROM questions WHERE id = ${questionId}`, (err, results) => {
        if (err) {
            console.error('Error retrieving questions:', err);
            res.status(500).json({ error: 'Failed to retrieve questions' });
            return;
        }
        res.json(results);
    });
});

router.post('/questions/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const questionText = req.body.question_text;
    const questionAnswers = req.body.question_answers;
    db.query(`INSERT INTO questions (quiz_id, question_text) VALUES (${quizId}, '${questionText}')`, (err, results) => {
        if (err) {
            console.error('Error retrieving questions:', err);
            res.status(500).json({ error: 'Failed to retrieve questions' });
            return;
        }
        let question_id = results.insertId;
        let promises = questionAnswers.map((element) => {
            return new Promise((resolve, reject) => {
                let answer_text = element.answer_text;
                let is_correct = element.is_correct;
                db.query(`INSERT INTO answers (question_id, answer_text, is_correct) VALUES (${question_id}, '${answer_text}', ${is_correct})`, (err, results) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
        Promise.all(promises)
            .then(() => res.json(results))
            .catch((error) => console.error('Error retrieving results:', error));
    });
});



export default router;