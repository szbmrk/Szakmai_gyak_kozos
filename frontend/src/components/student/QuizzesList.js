import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/list.css';

const QuizzesList = () => {
    const studentId = localStorage.getItem('token');
    const { courseId } = useParams();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        fetch(`/quizzes/${courseId}`)
            .then((response) => response.json())
            .then(async (data) => {
                let promises = data.map((quiz) =>
                    checkResults(quiz.id, studentId).then((submitted) =>
                        ({ details: quiz, submitted: submitted })
                    )
                );
                let temp_quizzes = await Promise.all(promises);
                setQuizzes(temp_quizzes);
            })
            .catch((error) => console.error('Error retrieving quizzes:', error));
    }, [studentId]);

    const checkResults = async (quizId, studentId) => {
        let result = null
        await fetch(`/quizzes/${studentId}/${quizId}`)
            .then((response) => response.json())
            .then((data) => {
                result = data[0].has_user_submitted;
            })
            .catch((error) => console.error('Error retrieving quizzes:', error));
        return result;
    };

    return (
        <div data-theme="student" className="list-container">
            <h1>Quizzes List</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Quizz ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Action / Results</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes !== undefined ?
                        quizzes.map((quiz) => (
                            <tr key={quiz.details.id}>
                                <td>{quiz.details.id}</td>
                                <td>{quiz.details.title}</td>
                                <td>{quiz.details.description}</td>
                                <td>
                                    {quiz.submitted === 1 ? <Link to={`/student/quizzes/results/${quiz.details.id}`}>View Results</Link> : <Link to={`/student/quizzes/take/${quiz.details.id}`}>Take Quiz</Link>}
                                </td>
                            </tr>
                        )) : <></>}
                </tbody>
            </table>
        </div>
    );
};

export default QuizzesList;
