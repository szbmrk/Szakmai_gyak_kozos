import React, { useState } from "react";
import "./StudentLoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLoginForm = (props) => {
    const role = props.role;

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/${role}-login`, {
                email,
                password,
            });

            if (response.data.length === 0) {
                alert("Invalid email or password!");
                return;
            }
            // Store token in local storage
            if (role === 'student')
                localStorage.setItem("token", response.data[0].student_id);
            else
                localStorage.setItem("token", response.data[0].teacher_id);

            localStorage.setItem("role", role);
            if (role === 'student')
                navigate(`/student/about`);
            else
                navigate(`/teacher/mycourses`);
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle error state
        }
    };

    const changeLoginPage = () => {
        if (role === 'student') {
            navigate('/login/teacher');
        } else {
            navigate('/login/student');
        }
    }

    return (
        <div className="flex">
            <div className="container">
                <h1>Login as:</h1>
                <h2 style={{ marginTop: '-20px' }}>{role}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button className="student_button" type="submit">Login</button>
                </form>
            </div>
            {role === "student" ? <button className="student_button" onClick={changeLoginPage} type="button">Switch to teacher login page</button> :
                <button className="student_button" onClick={changeLoginPage} type="button">Switch to student login page</button>}
        </div>

    );
};

export default StudentLoginForm;
