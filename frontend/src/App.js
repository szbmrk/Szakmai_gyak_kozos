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
import QuizzesList from "./components/student/QuizzesList";
import QuizResults from "./components/student/QuizResults";
import QuizTake from "./components/student/QuizTake";

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
                <Route path="/student/about" element={checkPermission("student", <TeachersList />)} />
                <Route path="/student/mycourses" element={checkPermission("student", <CoursesList />)} />
                <Route path="/student/assignments/:courseId" element={checkPermission("student", <AssignmentsList />)} />
                <Route path="/student/contents/:courseId" element={checkPermission("student", <ContentList />)} />
                <Route path="/student/quizzes/:courseId" element={checkPermission("student", <QuizzesList />)} />
                <Route path="/student/quizzes/take/:quizId" element={checkPermission("student", <QuizTake />)} />
                <Route path="/student/quizzes/results/:quizId" element={checkPermission("student", <QuizResults />)} />
                <Route path="/student/enroll" element={checkPermission("student", <AvailableCourses />)} />
                <Route path="/teacher/mycourses" element={checkPermission("teacher", <OwnCourses />)} />
                <Route path="/teacher/courses/add" element={checkPermission("teacher", <AddCourse />)} />
                <Route path="/teacher/assignments" element={checkPermission("teacher", <OwnAssignments />)} />
                <Route path="/teacher/add-assignments" element={checkPermission("teacher", <AddAssignmentForm />)} />
                <Route path="/teacher/assignments/statuses/:assignmentId" element={checkPermission("teacher", <AssignmentStates />)} />
                <Route path="/teacher/content/add" element={checkPermission("teacher", <AddContentForm />)} />

                <Route path="/login/student" element={<LoginForm role="student" />} />
                <Route path="/login/teacher" element={<LoginForm role="teacher" />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
