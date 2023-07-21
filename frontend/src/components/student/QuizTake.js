import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizTake = () => {
  const [quiz, setQuiz] = useState(null); // Store the quiz data fetched from the backend
  const [answers, setAnswers] = useState({}); // Store user's selected answers
  const [timer, setTimer] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { quizId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/quizzes/take/${quizId}`)
      .then(response => {
        const { quiz, questions } = response.data;
        setQuiz({ ...quiz, questions });
        setTimer(response.data.maxDuration);
        startTimer(response.data.maxDuration);
        console.log(quiz);
        console.log(questions);
      })
      .catch(error => console.error('Error fetching quiz data:', error));
  }, [quizId]);

  const startTimer = (duration) => {
    let intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    // Clear the interval when time expires
    setTimeout(() => {
      clearInterval(intervalId);
      setIsFormSubmitted(true);
    }, duration * 1000);
  };

  const handleAnswerSelection = (questionId, answerId) => {
    // Function to update the user's selected answer for a specific question
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = () => {
    // Function to submit the quiz with the selected answers
    // Implement the submission logic to send the answers to the backend API
    // Handle success and error responses from the backend
    console.log('Selected answers:', answers);
    // You can send the answers to the backend here using a fetch or axios request
    // Remember to include the quizId and studentId (if applicable) in the request body
  };

  if (!quiz) {
    // Show a loading state or message while the quiz data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center h5">Take the quiz</h2>
            </div>
            <div className="card-body">
              <div className="card">
                <div className="card-header">
                  <h1 className="text-center">{quiz.title}</h1>
                </div>
                <div className="card-body">
                  {/* Show the timer */}
                  <div
                    id="timer"
                    className={`text-center mb-4 ${isBlinking && 'blink'}`}
                    style={{ fontSize: '24px', fontWeight: 'bold' }}
                  >
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                  </div>

                  <form onSubmit={handleSubmitQuiz}>
                    {/* Loop through all questions */}
                    {quiz.questions.map((question) => (
                      <div key={question.id} className="card mb-3">
                        <div className="card-body">
                          {/* Show the question only once */}
                          <h3>{question.question_text}</h3>
                          <ul>
                            {/* Show all answers related to the question */}
                             {question.answers.map((answer) => (
                              <li key={answer.id}>
                                <label>
                                  <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={answer.id}
                                    onChange={() => handleAnswerSelection(question.id, answer.id)}
                                    disabled={isFormSubmitted}
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
                        className="btn btn-primary"
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
      </div>
    </div>
  );
};

export default QuizTake;
