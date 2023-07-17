import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Navbar.css'

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
                <li className={isActive("/teacher/courses/add")}>
                    <Link to="/teacher/courses/add">Add Course</Link>
                </li>
                <li className={isActive("/teacher/courses/delete")}>
                    <Link to="/teacher/courses/delete">Delete Course</Link>
                </li>
                <li className={isActive("/teacher/courses/modify")}>
                    <Link to="/teacher/courses/modify">Modify Course</Link>
                </li>
                <li className={isActive("/teacher/assignment")}>
                    <Link to="/teacher/assignment">Add Assignment</Link>
                </li>
                <li>
                    <button onClick={handleLogout} >Logout</button>
                </li>
            </ul>
        </nav>
    );
}
