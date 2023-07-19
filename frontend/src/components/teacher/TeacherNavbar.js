import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css'

export default function TeacherNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login/teacher');
    };


    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <nav>
            <ul>
                <li className={isActive("/teacher/mycourses") || isActive("/teacher/courses/delete") || isActive("/teacher/courses/modify")}>
                    <Link to="/teacher/mycourses">My Courses</Link>
                </li>
                <li className={isActive("/teacher/assignments")}>
                    <Link to="/teacher/assignments">My Assignments</Link>
                </li>
                <li className={isActive("/teacher/courses/add")}>
                    <Link to="/teacher/courses/add">Add Course</Link>
                </li>
                <li className={isActive("/teacher/assignments/add")}>
                    <Link to="/teacher/assignments/add">Add Assignment</Link>
                </li>
                <li>
                    <button className='logout_button' onClick={handleLogout} >Logout</button>
                </li>
            </ul>
        </nav>
    );
}
