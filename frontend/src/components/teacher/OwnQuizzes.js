import React, { useEffect, useState } from 'react';
import '../../styles/list.css';
import { useParams, Link } from 'react-router-dom';

const OwnQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [editQuizId, setEditQuizId] = useState(null);
    const [editQuizTitle, setEditQuizTitle] = useState('');
    const [editQuizDescription, setEditQuizDescription] = useState('');
    const teacherId = localStorage.getItem('token');
    const { courseId } = useParams()

    const handleDeleteQuiz = async (quizId) => {
        await fetch(`/quizzes/${quizId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error('Error deleting quiz:', error));
    };

    const handleEditQuiz = (quiz) => {
        setEditQuizId(quiz.id);
        setEditQuizTitle(quiz.title);
        setEditQuizDescription(quiz.description);
    };

    const handleUpdateQuiz = async (e) => {
        e.preventDefault();

        const updatedQuizData = {
            quiz_title: editQuizTitle,
            quiz_description: editQuizDescription,
        };

        await fetch(`/quizzes/${editQuizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuizData),
        })
            .then((response) => response.json())
            .then((data) => {
                setEditQuizId(null);
                setEditQuizTitle('');
                setEditQuizDescription('');
                window.location.reload();
            })
            .catch((error) => console.error('Error updating quiz:', error));
    };

    useEffect(() => {
        fetch(`/quizzes/${courseId}`)
            .then((response) => response.json())
            .then((data) => setQuizzes(data))
            .catch((error) => console.error('Error retrieving quizzes:', error));
    }, [teacherId]);

    return (
        <div data-theme="teacher" className="list-container">
            <h1>My Quizzes</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Quiz ID</th>
                        <th>Quiz Title</th>
                        <th>Description</th>
                        <th>Results</th>
                        <th>Manage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz) => (
                        <tr key={quiz.id}>
                            <td>{quiz.id}</td>
                            <td>{editQuizId === quiz.id ? (
                                <input
                                    type="text"
                                    value={editQuizTitle}
                                    onChange={(e) => setEditQuizTitle(e.target.value)}
                                />
                            ) : (
                                quiz.title
                            )}</td>
                            <td>{editQuizId === quiz.id ? (
                                <textarea
                                    value={editQuizDescription}
                                    onChange={(e) => setEditQuizDescription(e.target.value)}
                                ></textarea>
                            ) : (
                                quiz.description
                            )}</td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
                                    <Link
                                        to={`/teacher/quizzes/results/${quiz.id}`}
                                        className="view-contents-link"
                                    >
                                        View Results
                                    </Link>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
                                    <Link
                                        to={`/teacher/quizzes/questions/${quiz.id}`}
                                        className="view-contents-link"
                                    >
                                        View Questions
                                    </Link>
                                </div>
                            </td>
                            <td>
                                {editQuizId === quiz.id ? (
                                    <button onClick={handleUpdateQuiz}>Save</button>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                        <button onClick={() => handleEditQuiz(quiz)}>Edit</button>
                                        <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OwnQuizzes;
