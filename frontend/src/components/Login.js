import React, { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = (props) => {
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
            const response = await axios.post(`http://localhost:5000/${role}-login`, {
                email,
                password,
            });

            if (response.data.length === 0) {
                alert("Invalid email or password!");
                return;
            }
            // Store token in local storage
            localStorage.setItem("token", response.data[0].student_id);
            localStorage.setItem("role", role);
            navigate(`/${role}/about`);
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle error state
        }
    };

    return (
        <div className="container">
            <h1>{role}</h1>
            <h1>Login</h1>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
