import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/list.css';

const OwnAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [editAssignmentName, setEditAssignmentName] = useState('');
    const [editAssignmentDescription, setEditAssignmentDescription] = useState('');
    const [editAssignmentDeadline, setEditAssignmentDeadline] = useState(new Date());
    const teacherId = localStorage.getItem('token');


    const tomorrow = new Date(); // Get today's date
    tomorrow.setDate(tomorrow.getDate() + 1); // Set the date to tomorrow

    const formattedTomorrow = tomorrow.toISOString().split('T')[0]; // Convert to "YYYY-MM-DD" format
    const formatDate = (dateStr) => {
        if (!dateStr) return ''; // Handle empty or null values
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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
        setEditAssignmentName(assignment.title);
        setEditAssignmentDescription(assignment.description);
        setEditAssignmentDeadline(new Date(assignment.deadline));
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();

        const updatedAssignmentData = {
            assignment_name: editAssignmentName,
            assignment_description: editAssignmentDescription,
            assignment_deadline: formatDate(editAssignmentDeadline)
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
                setEditAssignmentDeadline(new Date());
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
                        <th>Deadline</th>
                        <th>Course</th>
                        <th>Statuses</th>
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
                            <td>
                                {editAssignmentId === assignment.assignment_id ? (
                                    <input
                                        type="date"
                                        min={formattedTomorrow}
                                        placeholder="YY:HH:DD"
                                        value={formatDate(editAssignmentDeadline)}
                                        onChange={(e) => setEditAssignmentDeadline(e.target.value)}
                                    />
                                ) : (
                                    new Date(assignment.deadline).toLocaleDateString()
                                )}
                            </td>
                            <td>{assignment.course_name}</td>
                            <td>
                                <Link
                                    to={`/teacher/assignments/statuses/${assignment.assignment_id}`}
                                    className="view-contents-link"
                                >
                                    View Statuses
                                </Link>
                            </td>
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
