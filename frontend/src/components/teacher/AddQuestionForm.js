import React, { useEffect, useState } from 'react';
import '../../styles/add_form.css';
import { useNavigate, useParams } from 'react-router-dom';

const AddQuestionForm = () => {
    const [question_text, setQuestion_text] = useState('');
    const [answers, setAnswers] = useState([
        { id: 1, answer_text: '', is_correct: 0 },
        { id: 2, answer_text: '', is_correct: 0 },
        { id: 3, answer_text: '', is_correct: 0 },
        { id: 4, answer_text: '', is_correct: 0 },
    ]);

    const checkIfAnswersAreDefaultState = () => {
        return answers.filter((ans) => ans.answer_text === '').length === 4;
    };

    const [successMessage, setSuccessMessage] = useState('');
    const { quizId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const questionData = {
            question_text: question_text,
            question_answers: answers,
        };

        fetch(`/quizzes/questions/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Quiz added successfully:', data);
                setSuccessMessage('Quiz added successfully!');
                navigate(`/teacher/quizzes/questions/${quizId}`);
            })
            .catch((error) => console.error('Error adding quiz:', error));
    };

    const editAnswers = (answer) => {
        const { answer_text, answer_id } = answer;
        const updatedAnswers = answers.map((ans) =>
            ans.id === answer_id ? { ...ans, answer_text: answer_text } : ans
        );
        setAnswers(updatedAnswers);
    };

    const handleEditCorrectAnswer = (answer_id) => {
        const updatedAnswers = answers.map((ans) =>
            ans.id === answer_id ? { ...ans, is_correct: 1 } : { ...ans, is_correct: 0 }
        );

        setAnswers(updatedAnswers);
    };

    return (
        <div data-theme="teacher" className="form-container">
            <h1>Add Question</h1>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="question_text">Question:</label>
                <input
                    type="text"
                    id="question_text"
                    value={question_text}
                    onChange={(e) => setQuestion_text(e.target.value)}
                    required
                />
                <label htmlFor="answer1">Answers:</label>
                <input
                    type="text"
                    id="answer1"
                    value={answers.filter((ans) => ans.id === 1)[0].answer_text}
                    onChange={(e) => editAnswers({ answer_text: e.target.value, answer_id: 1 })}
                    required
                />
                <input
                    type="text"
                    id="answer2"
                    value={answers.filter((ans) => ans.id === 2)[0].answer_text}
                    onChange={(e) => editAnswers({ answer_text: e.target.value, answer_id: 2 })}
                    required
                />
                <input
                    type="text"
                    id="answer3"
                    value={answers.filter((ans) => ans.id === 3)[0].answer_text}
                    onChange={(e) => editAnswers({ answer_text: e.target.value, answer_id: 3 })}
                    required
                />
                <input
                    type="text"
                    id="answer4"
                    value={answers.filter((ans) => ans.id === 4)[0].answer_text}
                    onChange={(e) => editAnswers({ answer_text: e.target.value, answer_id: 4 })}
                    required
                />

                {checkIfAnswersAreDefaultState(answers) ? <></> : (
                    <>
                        <label htmlFor="correct_answer">Correct Answer:</label>
                        <select
                            id="correct_answer"
                            value={answers.filter((ans) => ans.is_correct === 1).id}
                            onChange={(e) => handleEditCorrectAnswer(parseInt(e.target.value))}
                            required
                        >
                            {answers.map((answer) => (
                                answer.answer_text === '' ? <></> : <option key={answer.id} value={answer.id}>
                                    {answer.answer_text}
                                </option>

                            ))}
                        </select>
                    </>
                )}

                <button style={{ marginTop: "40px" }} type="submit" className="submit-btn">
                    Add Question
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddQuestionForm;
