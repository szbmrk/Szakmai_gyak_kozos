import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css";
import LoginForm from "./components/Login";
import Content from "./components/Content";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Content />} />
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
