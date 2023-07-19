import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import TeachersList from "./components/student/TeachersList";
import CoursesList from "./components/student/CoursesList";
import AssignmentsList from "./components/student/AssignmentsList";
import AvailableCourses from "./components/student/AvailableCourses";
import OwnCourses from "./components/teacher/OwnCourses";
import AddCourse from "./components/teacher/AddCourse";
import AddAssignmentForm from "./components/teacher/AddAssignmentForm";
import OwnAssignments from "./components/teacher/OwnAssignments";
import NoPermission from "./components/NoPermission";
import AddContentForm from "./components/teacher/AddContentForm";
import ContentList from "./components/student/ContentList";
import AssignmentStates from "./components/teacher/AssignmentStates";

function App() {
    const [currentRole, setCurrentRole] = useState(localStorage.getItem("role"));
    useEffect(() => {
        setCurrentRole(localStorage.getItem("role"));
    }, []);

    const checkPermission = (role, component) => {
        if (currentRole === role) {
            return component;
        }
        return <NoPermission />;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Navbar />} />
            </Routes>
            <Routes>
                <Route
                    path="/student/about"
                    element={checkPermission("student", <TeachersList />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/student/mycourses"
                    element={checkPermission("student", <CoursesList />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/student/assignments/:courseId"
                    element={checkPermission("student", <AssignmentsList />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/student/contents/:courseId"
                    element={checkPermission("student", <ContentList />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/student/enroll"
                    element={checkPermission("student", <AvailableCourses />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/mycourses"
                    element={checkPermission("teacher", <OwnCourses />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/courses/add"
                    element={checkPermission("teacher", <AddCourse />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/assignments"
                    element={checkPermission("teacher", <OwnAssignments />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/add-assignments"
                    element={checkPermission("teacher", <AddAssignmentForm />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/assignments/statuses/:assignmentId"
                    element={checkPermission("teacher", <AssignmentStates />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/teacher/content/add"
                    element={checkPermission("teacher", <AddContentForm />)}
                />
            </Routes>
            <Routes>
                <Route
                    path="/login/student"
                    element={<LoginForm role="student" />}
                />
            </Routes>
            <Routes>
                <Route
                    path="/login/teacher"
                    element={<LoginForm role="teacher" />}
                />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
