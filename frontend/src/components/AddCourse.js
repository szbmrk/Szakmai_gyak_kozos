import React, { useState } from 'react';
import './AddCourse.css';

const AddCourseForm = () => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const teacherId = localStorage.getItem('token');

    const handleSubmit = (e) => {
        e.preventDefault();

        const courseData = {
            teacher_id: teacherId,
            course_name: courseName,
            course_description: courseDescription,
        };

        fetch('/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Course added successfully:', data);
                setSuccessMessage('Course added successfully!');
                setCourseName('');
                setCourseDescription('');
            })
            .catch((error) => console.error('Error adding course:', error));
    };

    return (
        <div className="add-course-form-container">
            <h1>Add Course</h1>
            <form onSubmit={handleSubmit} className="add-course-form">
                <label htmlFor="courseName">Course Name:</label>
                <input
                    type="text"
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />

                <label htmlFor="courseDescription">Course Description:</label>
                <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                ></textarea>

                <button type="submit" className="submit-btn">
                    Add Course
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddCourseForm;
