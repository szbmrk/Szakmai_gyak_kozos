import React, { useEffect, useState } from 'react';
import '../../styles/list.css';

const OwnAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [editAssignmentName, setEditAssignmentName] = useState('');
    const [editAssignmentDescription, setEditAssignmentDescription] = useState('');
    const teacherId = localStorage.getItem('token');

    const handleDeleteAssignment = async (assignmentId) => {
        await fetch(`/assignments/${assignmentId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error('Error deleting assignment:', error));
    };

    const handleEditAssignment = (assignment) => {
        setEditAssignmentId(assignment.assignment_id);
        setEditAssignmentName(assignment.assignment_name);
        setEditAssignmentDescription(assignment.assignment_description);
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();

        const updatedAssignmentData = {
            assignment_name: editAssignmentName,
            assignment_description: editAssignmentDescription,
        };

        await fetch(`/assignments/${editAssignmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAssignmentData),
        })
            .then((response) => response.json())
            .then((data) => {
                setEditAssignmentId(null);
                setEditAssignmentName('');
                setEditAssignmentDescription('');
                window.location.reload();
            })
            .catch((error) => console.error('Error updating assignment:', error));
    };

    useEffect(() => {
        fetch(`/teachers/${teacherId}/assignments`)
            .then((response) => response.json())
            .then((data) => setAssignments(data))
            .catch((error) => console.error('Error retrieving assignments:', error));
    }, [teacherId]);

    return (
        <div data-theme="teacher" className="list-container">
            <h1>My Assignments</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Assignment ID</th>
                        <th>Assignment Name</th>
                        <th>Description</th>
                        <th>Course</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignment_id}>
                            <td>{assignment.assignment_id}</td>
                            <td>
                                {editAssignmentId === assignment.assignment_id ? (
                                    <input
                                        type="text"
                                        value={editAssignmentName}
                                        onChange={(e) => setEditAssignmentName(e.target.value)}
                                    />
                                ) : (
                                    assignment.title
                                )}
                            </td>
                            <td>
                                {editAssignmentId === assignment.assignment_id ? (
                                    <textarea
                                        value={editAssignmentDescription}
                                        onChange={(e) => setEditAssignmentDescription(e.target.value)}
                                    ></textarea>
                                ) : (
                                    assignment.description
                                )}
                            </td>
                            <td>{assignment.course_name}</td>
                            <td>
                                {editAssignmentId === assignment.assignment_id ? (
                                    <button onClick={handleUpdateAssignment}>Save</button>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                        <button onClick={() => handleEditAssignment(assignment)}>Edit</button>
                                        <button onClick={() => handleDeleteAssignment(assignment.assignment_id)}>Delete</button>
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

export default OwnAssignments;
