## System Plan for Szakmai_gyak_kozos
# Overview
The Szakmai_gyak_kozos repository contains a web application that is designed for educational purposes. The application is divided into a frontend and a backend, with the frontend built using React and the backend built with Node.js. The application supports two types of users: students and teachers.

# Frontend
The frontend of the application is built using React. It provides the user interface through which users interact with the application. The frontend communicates with the backend via API calls to send and receive data.

# Components
The frontend is composed of various React components, each serving a specific purpose:

- Navbar: This component displays different options based on the type of user. For students, it shows 'About', 'My Courses', and 'Enroll'. For teachers, it shows 'My Courses', 'My assignments', 'Add Course' and 'Add Assignment'.

- Course Management Components: These components allow teachers to add, delete, and manage courses.

- Assignment Management Components: hese components allow teachers to add, delete, and manage assignments.

- Course Enrollment Components: These components allow students to enroll in courses.

- Course Viewing Components: These components allow students to view their enrolled courses.

# Backend
The backend of the application is built with Node.js. It handles data management and provides API endpoints for the frontend to interact with.
![Systemplan - Database Structure](/database_structure.png)

# Database
The backend interacts with a database to store and retrieve data related to courses, assignments, and user information. The DATABASAE.png provides more information about the structure of the Database.

# API Endpoints
The backend provides various API endpoints to interact with the frontend. These endpoints allow data to be sent and received between the frontend and the backend.

# User Roles
- Student: Students can view information about the application, view their enrolled courses, and enroll in new courses.

- Teacher: Teachers can manage courses (add, delete, manage) and manage assignments (add, delete, manage).

# System Flow
Users (either students or teachers) access the application via the frontend user interface.

Based on the user's actions, the frontend makes API calls to the backend.

The backend processes these API calls, interacts with the database as needed, and returns the appropriate response to the frontend.

The frontend updates the user interface based on the response from the backend.
