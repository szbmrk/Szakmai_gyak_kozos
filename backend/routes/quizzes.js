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
  
            const existingQuestion = acc.questions.find(
              (question) => question.id === row.question_id
            );
  
            if (!existingQuestion) {
              acc.questions.push({
                id: row.question_id,
                question_text: row.question_text,
                image: row.question_image,
                answers: [], // Create an empty array to store the answers
              });
            }
  
            const currentQuestion = acc.questions.find(
              (question) => question.id === row.question_id
            );
  
            if (row.answer_id) {
              // Push all answers for the current question to the answers array
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

