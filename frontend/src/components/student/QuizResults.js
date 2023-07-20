import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/list.css';

const QuizResults = () => {
    const studentId = localStorage.getItem('token');
    const { quizId } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch(`/quizzes/results/${studentId}/${quizId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setResults(data)
            })
            .catch((error) => console.error('Error retrieving results:', error));
    }, [studentId]);

    return (
        <div data-theme="student" className="list-container">
            <h1>Results List</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Own Answer</th>
                        <th>Correct Answer</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length !== undefined ? <>{
                        results.map((result) => (
                            <tr key={result.question}>
                                <td>{result.question}</td>
                                <td>{result.answer}</td>
                                <td>{result.correct_answer}</td>
                                <td>{result.is_correct ? "Correct" : "Incorrect"}</td>
                            </tr>
                        ))
                    }</> : <></>}
                </tbody>
            </table>
            <h3>Points: {results.filter((result) => result.is_correct).length} / {results.length}</h3>
        </div>
    );
};

export default QuizResults;
