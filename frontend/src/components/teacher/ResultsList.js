import React, { useEffect, useState } from 'react';
import '../../styles/list.css';
import { useParams } from 'react-router-dom';

const ResultsList = () => {
    const [results, setResults] = useState([]);
    const teacherId = localStorage.getItem('token');
    const { quizId } = useParams();

    useEffect(() => {
        fetch(`/quizzes/results/${quizId}`)
            .then((response) => response.json())
            .then((data) => setResults(data))
            .catch((error) => console.error('Error retrieving results:', error));
    }, [teacherId]);

    const calculatePoints = (questions) => {
        let points = 0;
        questions.forEach((question) => {
            if (question.is_correct === true) {
                points += 1;
            }
        });
        return points;
    };

    const calculatePercentage = (questions) => {
        let points = calculatePoints(questions)
        return ((points / questions.length) * 100).toFixed(2);
    };

    const calculateGrade = (Percentage) => {
        if (Percentage >= 90) {
            return 'A';
        } else if (Percentage >= 80) {
            return 'B';
        } else if (Percentage >= 70) {
            return 'C';
        } else if (Percentage >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    };

    return (
        <div data-theme="teacher" className="list-container">
            <h1>Results</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Points</th>
                        <th>Percentage %</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.student_name}>
                            <td>{result.student_name}</td>
                            <td>{calculatePoints(result.questions)} / {result.questions.length}</td>
                            <td>{calculatePercentage(result.questions)}</td>
                            <td>{calculateGrade(calculatePercentage(result.questions))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsList;
