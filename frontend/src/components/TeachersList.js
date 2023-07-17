import React, { useEffect, useState } from 'react';
import './TeachersList.css';

const TeachersList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetch('/teachers')
            .then((response) => response.json())
            .then((data) => setTeachers(data))
            .catch((error) => console.error('Error retrieving teachers:', error));
    }, []);

    return (
        <div className="teachers-list-container">
            <h1>Teachers List</h1>
            <table className="teachers-table">
                <thead>
                    <tr>
                        <th>Teacher Name</th>
                        <th>Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher) => (
                        <tr key={teacher.teacher_id}>
                            <td>{teacher.teacher_name}</td>
                            <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {teacher.courses.split(',').map((course, index) => (
                                    <tr key={index}>
                                        <td>{course.trim()}</td>
                                    </tr>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeachersList;