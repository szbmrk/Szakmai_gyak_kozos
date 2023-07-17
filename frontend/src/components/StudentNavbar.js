import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Navbar.css'

const StudentNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login/student');
    };

    return (
        <nav>
            <ul>
                <li className={isActive("/student/about")}>
                    <Link to="/student/about">About</Link>
                </li>
                <li className={isActive("/student/mycourses")}>
                    <Link to="/student/mycourses">My Courses</Link>
                </li>
                <li className={isActive("/student/enroll")}>
                    <Link to="/student/enroll">Enroll</Link>
                </li>
                <li>
                    <button onClick={handleLogout} >Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default StudentNavbar;