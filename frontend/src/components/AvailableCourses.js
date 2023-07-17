import React, { useEffect, useState } from 'react';
import './AvailableCourses.css';

const AvailableCourses = () => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const studentId = localStorage.getItem('token');

    useEffect(() => {
        fetch(`/available-courses/${studentId}`)
            .then((response) => response.json())
            .then((data) => setAvailableCourses(data))
            .catch((error) => console.error('Error retrieving available courses:', error));
    }, [studentId]);

    const handleEnroll = (courseId) => {
        const enrollData = { student_id: studentId, course_id: courseId };

        fetch('/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enrollData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Enrollment successful:', data);
                // Update the availableCourses state by filtering out the enrolled course
                setAvailableCourses((prevCourses) =>
                    prevCourses.filter((course) => course.course_id !== courseId)
                );
            })
            .catch((error) => console.error('Error enrolling student:', error));
    };

    return (
        <div className="available-courses-container">
            <h1>Available Courses</h1>
            <table className="available-courses-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Enroll</th>
                    </tr>
                </thead>
                <tbody>
                    {availableCourses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>{course.course_name}</td>
                            <td>
                                <button
                                    onClick={() => handleEnroll(course.course_id)}
                                    className="enroll-btn"
                                >
                                    Enroll
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailableCourses;
