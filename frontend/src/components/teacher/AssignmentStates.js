import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/list.css';
import axios from 'axios';

const AssignmentStates = () => {
    const [students, setStudents] = useState([]);
    const { assignmentId } = useParams();
    const [states, setStates] = useState([]);

    useEffect(() => {
        fetch(`/assignments/assignment_state/${assignmentId}`)
            .then((response) => response.json())
            .then((data) => {
                setStudents(data)
            })
            .catch((error) => console.error('Error retrieving assignment state:', error));
    }, [assignmentId]);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get("/assignments/states/get");
                setStates(response.data);
            } catch (error) {
                console.error("Error retrieving states:", error);
            }
        };

        fetchStates();
    }, []);

    const handleOptionChange = (event) => {
        const student_id = event.target.options[event.target.selectedIndex].getAttribute('student_id');
        axios.put(`/assignments/assignment_state/${student_id}/${assignmentId}`, { state_id: event.target.value })
            .then((response) => {
                console.log(response);
            }
            )
            .then(() => {
                fetch(`/assignments/assignment_state/${assignmentId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setStudents(data)
                    })
                    .catch((error) => console.error('Error retrieving assignment state:', error));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div data-theme="teacher" className='list-container'>
            <h1>Assignment State</h1>
            <table className='list-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>State Name</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            {states ? (
                                <td>
                                    <select value={student.state_id} onChange={handleOptionChange}>
                                        {states.map((state) => (
                                            <option value={state.state_id} student_id={student.id}>{state.state_name}</option>
                                        ))}
                                    </select>
                                </td>
                            ) : (
                                <td></td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentStates;
