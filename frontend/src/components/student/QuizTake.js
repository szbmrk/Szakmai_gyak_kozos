import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/take.css'; // Import the custom CSS file

const QuizTake = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { quizId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/quizzes/take/${quizId}`)
      .then((response) => {
        const { quiz, questions } = response.data;
        setQuiz({ ...quiz, questions });
        setTimer(response.data.maxDuration);
        startTimer(response.data.maxDuration);
        console.log(quiz);
        console.log(questions);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, [quizId]);

  const startTimer = (duration) => {
    const startTime = Date.now();
    setTimer(duration);

    let intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const remainingTime = duration - elapsedTime;

      setTimer(remainingTime > 0 ? remainingTime : 0);
    }, 1000);

    // Clear the interval when time expires
    setTimeout(() => {
      clearInterval(intervalId);
      setIsFormSubmitted(true);
      setIsBlinking(false);
      setTimer(0); // Reset the timer to 0
    }, duration * 1000);
  };

  useEffect(() => {
    if (timer === 0) {
      setIsBlinking(true);
    } else {
      setIsBlinking(false);
    }
  }, [timer]);

  const handleAnswerSelection = (questionId, answerId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = () => {
    console.log('Selected answers:', answers);
    // Implement the logic to submit the quiz with the selected answers
    // You can send the answers to the backend here using a fetch or axios request
    // Remember to include the quizId and studentId (if applicable) in the request body
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">Take the quiz</h2>
        </div>
        <div className="quiz-body">
          <div className="quiz-card">
            <div className="quiz-header">
              <h1 className="quiz-title">{quiz.title}</h1>
            </div>
            <div className="quiz-body">
              <div id="timer" className={`text-center mb-4 ${isBlinking ? 'blink' : ''}`}>
                {timer > 0 ? (
                  <>
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:
                    {(timer % 60).toString().padStart(2, '0')}
                  </>
                ) : (
                  'Time has expired'
                )}
              </div>

              <form onSubmit={handleSubmitQuiz}>
                {quiz.questions.map((question) => (
                  <div key={question.id} className="quiz-card mb-3">
                    <div className="quiz-body">
                      <h3 className="quiz-question">{question.question_text}</h3>
                      <ul>
                        {question.answers.map((answer) => (
                          <li key={answer.id}>
                            <label>
                              <input
                                type="radio"
                                name={`question_${question.id}`}
                                value={answer.id}
                                onChange={() => handleAnswerSelection(question.id, answer.id)}
                                disabled={isFormSubmitted || timer === 0}
                              />
                              {answer.answer_text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <button
                    type="submit"
                    className={`quiz-button ${isFormSubmitted ? 'disabled' : ''}`}
                    disabled={isFormSubmitted}
                  >
                    Submit Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTake;
