import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css";
import StudentLoginForm from "./components/StudentLoginForm";
import TeacherLoginForm from "./components/TeacherLoginForm";
import Content from "./components/Content";
import TeachersList from "./components/TeachersList";
import CoursesList from "./components/CoursesList";
import AssignmentsList from "./components/AssignmentsList";
import AvailableCourses from "./components/AvailableCourses";
import OwnCourses from "./components/OwnCourses";
import AddCourse from "./components/AddCourse";
import AddAssignmentForm from "./components/AddAssignmentForm";
import OwnAssignments from "./components/OwnAssignments";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Content />} />
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
                <Route path="/login/student" element={<StudentLoginForm role="student" />} />
            </Routes>
            <Routes>
                <Route path="/login/teacher" element={<TeacherLoginForm role="teacher" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
