import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/list.css';

const CoursesList = () => {
    const studentId = localStorage.getItem('token');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch(`/courses/${studentId}`)
            .then((response) => response.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error('Error retrieving courses:', error));
    }, [studentId]);

    return (
        <div data-theme="student" className="list-container">
            <h1>Courses List</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        <th>Assignments</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length !== undefined ? <>{
                        courses.map((course) => (
                            <tr key={course.course_id}>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.course_description}</td>
                                <td>
                                    <Link
                                        to={`/student/assignments/${course.course_id}`}
                                        className="view-assignments-link"
                                    >
                                        View Assignments
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }</> : <></>}
                </tbody>
            </table>
        </div>
    );
};

export default CoursesList;
