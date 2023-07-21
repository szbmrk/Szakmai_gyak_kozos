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

router.get('/take/:quizId', (req, res) => {
    const quizId = req.params.quizId;

    db.query(
        'SELECT q.id AS quiz_id, q.title AS quiz_title, q.description AS quiz_description, ' +
        'que.id AS question_id, que.question_text, que.image AS question_image, ' +
        'ans.id AS answer_id, ans.answer_text, ans.is_correct ' +
        'FROM quizzes q ' +
        'LEFT JOIN questions que ON q.id = que.quiz_id ' +
        'LEFT JOIN answers ans ON que.id = ans.question_id ' +
        'WHERE q.id = ?',
        [quizId],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            } else {
                // Group the data by quiz and process the duration calculation
                const quizData = results.reduce((acc, row) => {
                    if (!acc.quiz) {
                        acc.quiz = {
                            id: row.quiz_id,
                            title: row.quiz_title,
                            description: row.quiz_description,
                        };
                    }

                    if (!acc.questions) {
                        acc.questions = [];
                    }

                    // Check if the question already exists in the acc.questions array
                    const existingQuestion = acc.questions.find(
                        (question) => question.id === row.question_id
                    );

                    if (!existingQuestion) {
                        // If the question doesn't exist, add it to the acc.questions array
                        acc.questions.push({
                            id: row.question_id,
                            question_text: row.question_text,
                            image: row.question_image,
                            answers: [], // Create an empty array to store the answers
                        });
                    }

                    // Find the question in the acc.questions array and add the answer to it
                    const currentQuestion = acc.questions.find(
                        (question) => question.id === row.question_id
                    );
                    if (row.answer_id) {
                        currentQuestion.answers.push({
                            id: row.answer_id,
                            answer_text: row.answer_text,
                            is_correct: row.is_correct,
                        });
                    }

                    return acc;
                }, {});

                // Randomize the order of questions
                quizData.questions = shuffleArray(quizData.questions);

                // Shuffle the answers for each question
                quizData.questions.forEach((question) => {
                    question.answers = shuffleArray(question.answers);
                });

                // Calculate maximum duration
                const maxDuration = quizData.questions.length * 30;

                res.json({
                    quiz: quizData.quiz,
                    questions: quizData.questions,
                    maxDuration,
                });
            }
        }
    );
});



function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}


// POST /submit/:quizId - Submit Quiz Answers
router.post('/submit/:quizId', (req, res) => {
    console.log("submitted");
    const quizId = req.params.quizId;
    const studentId = req.body.studentId; // Assuming the student ID is provided in the request body
    const answers = req.body.answers; // Assuming the answers are provided in the request body

    // Validate that studentId and answers are provided
    if (!studentId || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'Invalid data provided for quiz submission.' });
    }

    answers.forEach((answer) => {
        // insert into results
        const insertResultsQuery = 'INSERT INTO results (quiz_id, question_id, answer_id, survey_id ) VALUES (?, ?, ?, ?)';
        const values = [quizId, answer.questionId, answer.answerId, 1];
        db.query(insertResultsQuery, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while storing quiz results.' });
            }
            //insert into student_results
            const resultId = results.insertId; // Assuming the result ID is automatically generated by the database
            const insertStudentResultsQuery = 'INSERT INTO student_results (student_id, result_id) VALUES (?, ?)';
            db.query(insertStudentResultsQuery, [studentId, resultId], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'An error occurred while storing quiz results for the student.' });
                }
            });
        });
    });

    res.send("success");
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