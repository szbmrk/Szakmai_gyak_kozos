import React, { useEffect, useState } from 'react';
import '../../styles/add_form.css';
const AddAssignmentForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const teacherId = localStorage.getItem('token');

    const tomorrow = new Date(); // Get today's date
    tomorrow.setDate(tomorrow.getDate() + 1); // Set the date to tomorrow

    const formattedTomorrow = tomorrow.toISOString().split('T')[0];

    const formatDate = (dateStr) => {
        if (!dateStr) return ''; // Handle empty or null values
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetch(`/teachers/${teacherId}/courses`)
            .then((response) => response.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error('Error retrieving available courses:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const assignmentData = {
            assignment_name: assignmentName,
            assignment_description: assignmentDescription,
            assignment_deadline: assignmentDeadline,
        };

        fetch(`/assignments/${selectedCourse}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignmentData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Assignment added successfully:', data);
                setSuccessMessage('Assignment added successfully!');
                setSelectedCourse('');
                setAssignmentName('');
                setAssignmentDescription('');
                setAssignmentDeadline(null);
            })
            .catch((error) => console.error('Error adding assignment:', error));
    };

    return (
        <div data-theme="teacher" className="form-container">
            <h1>Add Assignment</h1>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="course">Course:</label>
                <select
                    id="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>

                <label htmlFor="assignmentName">Assignment Name:</label>
                <input
                    type="text"
                    id="assignmentName"
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                    required
                />

                <label htmlFor="assignmentDescription">Assignment Description:</label>
                <textarea
                    id="assignmentDescription"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="assignmentDeadline">Assignment Deadline:</label>
                <input
                    type="date"
                    min={formattedTomorrow}
                    id="assignmentDeadline"
                    value={formatDate(assignmentDeadline)}
                    onChange={(e) => setAssignmentDeadline(e.target.value)}
                    required
                />

                <button type="submit" className="submit-btn">
                    Add Assignment
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddAssignmentForm;
