## Functional Specification for Szakmai_gyak_kozos
# Overview
The Szakmai_gyak_kozos repository contains a web application is designed for educational purposes. The application appears to have two types of users: students and teachers. The application is divided into a frontend and a backend, with the frontend built using React and the backend built with Node.js.

# Frontend
The frontend of the application is built using React and contains various components to handle different functionalities. The main components include:

- Navbar: This component displays different options based on the type of user. For students, it shows 'About', 'My Courses', and 'Enroll'. For teachers, it shows 'My Courses', 'My assignments', 'Add Course' and 'Add Assignment'.

- Course Management: These components allow teachers to add, delete, and manage courses.

- Assignment Management: These components allow teachers to add assignments.

- Course Enrollment: These components allow students to enroll in courses.

- Course Viewing: These components allow students to view their enrolled courses.

# Backend
The backend of the application is built with Node.js. The main functionalities include:

- Database Management: The backend interacts with a database to store and retrieve data related to courses, assignments, and user information.

- API Endpoints: The backend provides various API endpoints to interact with the frontend, allowing data to be sent and received between the frontend and the backend.

# User Roles
- Student: Students can view information about the teachers, view their enrolled courses, and enroll in new courses.

- Teacher: Teachers can manage courses (add, delete, manage) and manage assignments (add, delete, manage).