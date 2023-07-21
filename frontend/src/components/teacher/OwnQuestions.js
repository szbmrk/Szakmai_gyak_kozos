import React, { useEffect, useState } from 'react';
import '../../styles/list.css';
import { Link, useParams } from 'react-router-dom';

const OwnQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [editQuestionId, setEditQuestionId] = useState(null);
    const [editQuestion, setEditQuestion] = useState('');
    const [editQuestionAnswers, setEditQuestionAnswers] = useState([]);
    const [reRender, setReRender] = useState(false);

    const teacherId = localStorage.getItem('token');
    const { quizId } = useParams();

    const handleDeleteQuestion = async (questionId) => {
        await fetch(`/quizzes/questions/${questionId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error('Error deleting question:', error));
    };

    const handleEditQuestion = (question) => {
        setEditQuestionId(question.question.id);
        setEditQuestion(question.question.question_text);
        setEditQuestionAnswers(question.answers);
    };

    const handleEditAnswer = (answer) => {
        let answers = editQuestionAnswers;
        answers.filter((ans) => ans.id === answer.answer_id)[0].answer_text = answer.answer_text;
        setEditQuestionAnswers(answers);
        setReRender(!reRender);
    };

    const handleEditCorrectAnswer = (answer) => {
        let answers = editQuestionAnswers;
        answers.filter((ans) => ans.id === answer.answer_id)[0].is_correct = answer.is_correct ? 1 : 0;
        answers.filter((ans) => ans.id !== answer.answer_id).map((ans) => ans.is_correct = 0);
        setEditQuestionAnswers(answers);
        setReRender(!reRender);
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();

        const updatedQuestionData = {
            question_text: editQuestion,
            question_answers: editQuestionAnswers,
        };

        await fetch(`/quizzes/questions/${editQuestionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuestionData),
        })
            .then((response) => response.json())
            .then((data) => {
                setEditQuestionId(null);
                setEditQuestion('');
                setEditQuestionAnswers('');
                window.location.reload();
            })
            .catch((error) => console.error('Error updating question:', error));
    };

    useEffect(() => {
        fetch(`/quizzes/questions/get/${quizId}`)
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error('Error retrieving questions:', error));
    }, [teacherId]);

    return (
        <div data-theme="teacher" className="list-container">
            <h1>My Questions</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Question ID</th>
                        <th>Question</th>
                        <th>Answers</th>
                        <th>Correct Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length !== 0 ?
                        questions.map((question) => (
                            <tr key={question.question.id} >
                                <td>{question.question.id}</td>
                                <td>{editQuestionId === question.question.id ? (
                                    <input
                                        type="text"
                                        value={editQuestion}
                                        onChange={(e) => setEditQuestion(e.target.value)}
                                    />
                                ) : (
                                    question.question.question_text
                                )}</td>
                                <td>{question.answers.map((answer) => (
                                    <div key={answer.id}>
                                        {editQuestionId === question.question.id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editQuestionAnswers.filter((ans) => ans.id === answer.id)[0].answer_text}
                                                    onChange={(e) => handleEditAnswer({ answer_id: answer.id, answer_text: e.target.value })}
                                                />
                                                <input
                                                    type='radio'
                                                    name='is_correct'
                                                    checked={editQuestionAnswers.filter((ans) => ans.id === answer.id)[0].is_correct === 1 ? true : false}
                                                    onChange={(e) => handleEditCorrectAnswer({ answer_id: answer.id, is_correct: e.target.checked })}
                                                />
                                            </div>
                                        ) : (
                                            answer.answer_text
                                        )}
                                    </div>
                                ))}</td>
                                <td>
                                    {question.answers.filter((answer) => answer.is_correct === 1)[0].answer_text}
                                </td>
                                <td>
                                    {editQuestionId === question.question.id ? (
                                        <button onClick={handleUpdateQuestion}>Save</button>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                            <button onClick={() => handleEditQuestion(question)}>Edit</button>
                                            <button onClick={() => handleDeleteQuestion(question.question.id)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : <></>}
                    <tr>
                        <td colSpan="5">
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <Link to={`/teacher/quizzes/questions/add/${quizId}`}>
                                    <button>Add Question</button>
                                </Link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
};

export default OwnQuestions;
