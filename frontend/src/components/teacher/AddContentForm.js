import React, { useEffect, useState } from 'react';
import '../../styles/add_form.css';
const AddContentForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [title, setTitle] = useState('');
    const [lecture_text, setLecture_text] = useState(null);
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

        const contentData = {
            title: title,
            lecture_text: lecture_text.replace('\n', '')
        };

        fetch(`/courses/${selectedCourse}/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contentData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Content added successfully:', data);
                setSuccessMessage('Content added successfully!');
                setSelectedCourse('');
                setTitle('');
                setLecture_text('');
            })
            .catch((error) => console.error('Error adding content:', error));
    };

    return (
        <div data-theme="teacher" className="form-container">
            <h1>Add Assignment</h1>
            <form onSubmit={handleSubmit} className="form" style={{ width: "750px" }}>
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

                <label htmlFor="contentTitle">Title:</label>
                <input style={{ width: "300px" }}
                    type="text"
                    id="contentTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label htmlFor="lecture_text">Lecture text:</label>
                <textarea style={{ height: "300px" }}
                    id="lecture_text"
                    value={lecture_text}
                    onChange={(e) => setLecture_text(e.target.value)}
                    required
                ></textarea>

                <button type="submit" className="submit-btn">
                    Add Content
                </button>
            </form>

            {successMessage && <p className="success-msg">{successMessage}</p>}
        </div>
    );
};

export default AddContentForm;
