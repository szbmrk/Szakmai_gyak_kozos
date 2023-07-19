import React, { useEffect, useState } from 'react';
import '../../styles/teacher_list.css';

const OwnCourses = () => {
    const [courses, setCourses] = useState([]);
    const [editCourseId, setEditCourseId] = useState(null);
    const [editCourseName, setEditCourseName] = useState('');
    const [editCourseDescription, setEditCourseDescription] = useState('');
    const teacherId = localStorage.getItem('token');

    const handleDeleteCourse = async (courseId) => {
        await fetch(`/courses/${courseId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error('Error deleting course:', error));
    };

    const handleEditCourse = (course) => {
        setEditCourseId(course.course_id);
        setEditCourseName(course.course_name);
        setEditCourseDescription(course.course_description);
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();

        const updatedCourseData = {
            course_name: editCourseName,
            course_description: editCourseDescription,
        };

        await fetch(`/courses/${editCourseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCourseData),
        })
            .then((response) => response.json())
            .then((data) => {
                setEditCourseId(null);
                setEditCourseName('');
                setEditCourseDescription('');
                window.location.reload();
            })
            .catch((error) => console.error('Error updating course:', error));
    };

    useEffect(() => {
        fetch(`/teachers/${teacherId}/courses`)
            .then((response) => response.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error('Error retrieving courses:', error));
    }, [teacherId]);

    return (
        <div data-theme="teacher" className="list-container">
            <h1>My Courses</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>{editCourseId === course.course_id ? (
                                <input
                                    type="text"
                                    value={editCourseName}
                                    onChange={(e) => setEditCourseName(e.target.value)}
                                />
                            ) : (
                                course.course_name
                            )}</td>
                            <td>{editCourseId === course.course_id ? (
                                <textarea
                                    value={editCourseDescription}
                                    onChange={(e) => setEditCourseDescription(e.target.value)}
                                ></textarea>
                            ) : (
                                course.course_description
                            )}</td>
                            <td>
                                {editCourseId === course.course_id ? (
                                    <button onClick={handleUpdateCourse}>Save</button>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                        <button onClick={() => handleEditCourse(course)}>Edit</button>
                                        <button onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
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

export default OwnCourses;
