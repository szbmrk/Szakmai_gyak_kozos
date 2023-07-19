import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css'

const StudentNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname.startsWith(path) ? "active" : "";
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
                <li className={isActive("/student/mycourses") || isActive("/student/assignments")}>
                    <Link to="/student/mycourses">My Courses</Link>
                </li>
                <li className={isActive("/student/enroll")}>
                    <Link to="/student/enroll">Enroll</Link>
                </li>
                <li>
                    <button className='logout_button' onClick={handleLogout} >Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default StudentNavbar;