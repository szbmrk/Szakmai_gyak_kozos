import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/list.css';

const AssignmentStates = () => {
    const [students, setStudents] = useState([]);
    const { assignmentId } = useParams();

    useEffect(() => {
        fetch(`/assignments/assignment_state/${assignmentId}`)
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error('Error retrieving assignment state:', error));
    }, [assignmentId]);

    return (
        <div data-theme="teacher" className='list-container'>
            <h1>Assignment State</h1>
            <table className='list-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>State ID</th>
                        <th>State Name</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.state_id}</td>
                            <td>{student.state_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentStates;
