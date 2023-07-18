import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AssignmentsList.css";
import axios from "axios";

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);
  const { courseId } = useParams();
  const [states, setStates] = useState([]);
  const student_id = localStorage.getItem("token");

  const [selectedOption, setSelectedOption] = useState(""); // State to track the selected option

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value); // Update the selected option when it changes
  };

  /*   const get_assignment_state = (assignment_id) => {
    console.log("assignment_id");
    console.log(assignment_id);
    console.log("student_id");
    console.log(student_id);
    console.log(localStorage.getItem("token"));
    fetch(`/getAssignmentData`, { assignment_id, student_id })
      .then((response) => response.json())
      .then((data) => {
        console.log("get_assignment_state");
        console.log(data);
      })
      .catch((error) =>
        console.error("Error retrieving assignment_state:", error)
      );
  }; */

  useEffect(() => {
    fetch(`/assignments/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("assignments");
        console.log(data);
        setAssignments(data);
      })
      .catch((error) => console.error("Error retrieving assignments:", error));
  }, [courseId, student_id]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("/states");
        setStates(response.data);
      } catch (error) {
        console.error("Error retrieving states:", error);
      }
    };

    fetchStates();
  }, []);

  return (
    <div className="assignments-list-container">
      <h1>Assignments List</h1>
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Assignment ID</th>
            <th>Assignment Name</th>
            <th>Description</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.assignment_id}>
              <td>{assignment.assignment_id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              {states ? (
                <td>
                  <select value={selectedOption} onChange={handleOptionChange}>
                    {states.map((state) => (
                      <option value={state.state_id}>{state.state_name}</option>
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

export default AssignmentsList;
