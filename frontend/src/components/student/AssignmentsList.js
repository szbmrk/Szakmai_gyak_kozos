import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/list.css";

const AssignmentsList = () => {
    const [assignments, setAssignments] = useState([]);
    const { courseId } = useParams();
    const student_id = localStorage.getItem("token");


    useEffect(() => {
        fetch(`/assignments/student/${courseId}/${student_id}`)
            .then((response) => response.json())
            .then((data) => {
                setAssignments(data);
            })
            .catch((error) => console.error("Error retrieving assignments:", error));
    }, [courseId, student_id]);

    return (
        <div className="list-container">
            <h1>Assignments List</h1>
            <table className="list-table">
                <thead>
                    <tr>
                        <th>Assignment ID</th>
                        <th>Assignment Name</th>
                        <th>Description</th>
                        <th>Deadline</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.assignment_id}>
                            <td>{assignment.assignment_id}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.description}</td>
                            <td>{new Date(assignment.deadline).toLocaleDateString()}</td>
                            <td>{assignment.state_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsList;
