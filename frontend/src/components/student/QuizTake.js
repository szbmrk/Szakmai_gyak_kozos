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
    }, duration * 1000);
  };

  const handleAnswerSelection = (questionId, answerId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };


  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    console.log('Selected answers:', answers);
    
    // Create a data object to send to the backend
    const data = {
      studentId: 123, // Replace with the actual student ID (if applicable)
      answers: Object.entries(answers).map(([questionId, answerId]) => ({
        questionId: parseInt(questionId),
        answerId: parseInt(answerId),
      })),
    };
  
    // Make the HTTP POST request to submit the quiz
    axios
      .post(`http://localhost:5000/quizzes/submit/${quizId}`, data)
      .then((response) => {
        console.log('Quiz submitted successfully:', response.data);
        // Implement any further logic or user feedback if needed
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
        // Implement error handling or user feedback if needed
      });
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setIsFormSubmitted(false);
    startTimer(quiz.maxDuration);
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
                  <>
                    Time has expired
                    <button className="reset-button" onClick={handleResetQuiz}>
                      Reset Quiz
                    </button>
                  </>
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
