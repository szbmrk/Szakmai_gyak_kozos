import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NoPermission from "./components/NoPermission";

const currentRole = localStorage.getItem("role");

const checkPermission = (role, element) => {
  if (role == currentRole) {
    return element;
  } else {
    return <NoPermission />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Content />} />
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
          path="/teacher/assignments/add"
          element={checkPermission("teacher", <AddAssignmentForm />)}
        />
      </Routes>
      <Routes>
        <Route
          path="/login/student"
          element={<StudentLoginForm role="student" />}
        />
      </Routes>
      <Routes>
        <Route
          path="/login/teacher"
          element={<TeacherLoginForm role="teacher" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
