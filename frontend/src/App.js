import { BrowserRouter, Route, Routes } from "react-router-dom"
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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Navbar />} />
            </Routes>
            <Routes>
                <Route path="/student/about" element={<TeachersList />} />
            </Routes>
            <Routes>
                <Route path="/student/mycourses" element={<CoursesList />} />
            </Routes>
            <Routes>
                <Route path="/student/assignments/:courseId" element={<AssignmentsList />} />
            </Routes>
            <Routes>
                <Route path="/student/enroll" element={<AvailableCourses />} />
            </Routes>
            <Routes>
                <Route path="/teacher/mycourses" element={<OwnCourses />} />
            </Routes>
            <Routes>
                <Route path="/teacher/courses/add" element={<AddCourse />} />
            </Routes>
            <Routes>
                <Route path="/teacher/assignments" element={<OwnAssignments />} />
            </Routes>
            <Routes>
                <Route path="/teacher/assignments/add" element={<AddAssignmentForm />} />
            </Routes>
            <Routes>
                <Route path="/login/student" element={<LoginForm role="student" />} />
            </Routes>
            <Routes>
                <Route path="/login/teacher" element={<LoginForm role="teacher" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
