import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AssignmentsList.css';

const AssignmentsList = () => {
    const [assignments, setAssignments] = useState([]);
    const { courseId } = useParams();

    useEffect(() => {
        fetch(`/assignments/${courseId}`)
            .then((response) => response.json())
            .then((data) => setAssignments(data))
            .catch((error) => console.error('Error retrieving assignments:', error));
    }, [courseId]);

    return (
        <div className="assignments-list-container">
            <h1>Assignments List</h1>
            <table className="assignments-table">
                <thead>
                    <tr>
                        <th>Assignment ID</th>
                        <th>Assignment Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignment_id}>
                            <td>{assignment.assignment_id}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsList;
