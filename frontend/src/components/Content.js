import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import TeacherNavbar from './TeacherNavbar';

export default function Content() {
    const [token, setToken] = useState(undefined);
    const [role, setRole] = useState(undefined);
    const navigate = useNavigate();
    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setRole(localStorage.getItem('role'));
        console.log(localStorage.getItem('role'))
        let token_temp = localStorage.getItem('token');
        if (token_temp === undefined) {
            navigate('/login/student');
        }
    }, [navigate])

    return (
        <>
            {token !== undefined && token !== null ? <>
                {role === 'student' ? < StudentNavbar /> : <TeacherNavbar />}
            </> :
                <></>}
        </>
    )
}
