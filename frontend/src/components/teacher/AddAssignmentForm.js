import React, { useEffect, useState } from 'react';
import '../../styles/add_form.css';
const AddAssignmentForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const teacherId = localStorage.getItem('token');

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

                <button type="submit" className="submit-btn">
                    Add Assignment
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddAssignmentForm;
