import React, { useEffect, useState } from 'react';
import '../../styles/add_form.css';
const AddQuizForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
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

        const quizData = {
            quiz_title: quizTitle,
            quiz_description: quizDescription,
        };

        fetch(`/quizzes/${selectedCourse}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Quiz added successfully:', data);
                setSuccessMessage('Quiz added successfully!');
                setSelectedCourse('');
                setQuizTitle('');
                setQuizDescription('');
            })
            .catch((error) => console.error('Error adding quiz:', error));
    };

    return (
        <div data-theme="teacher" className="form-container">
            <h1>Add Quiz</h1>
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

                <label htmlFor="quizTitle">Quiz Title:</label>
                <input
                    type="text"
                    id="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                />

                <label htmlFor="quizDescription">Quiz Description:</label>
                <textarea
                    id="quizDescription"
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    required
                ></textarea>

                <button type="submit" className="submit-btn">
                    Add Quiz
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddQuizForm;
