import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mysql from "mysql"

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elearning_portal',
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/teachers', (req, res) => {
    db.query('SELECT teacher.*, GROUP_CONCAT(Course.course_name) AS courses FROM teacher LEFT JOIN course ON teacher.teacher_id = course.teacher_id GROUP BY teacher.teacher_id;', (err, results) => {
        if (err) {
            console.error('Error retrieving teachers:', err);
            res.status(500).json({ error: 'Failed to retrieve teachers' });
            return;
        }
        res.json(results);
    });
});

app.get('/courses/:student_id', (req, res) => {
    const student_id = req.params.student_id;
    db.query(`SELECT * FROM Course LEFT JOIN Enrollment ON Enrollment.course_id = Course.course_id 
    WHERE Enrollment.student_id = ${student_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving courses:', err);
            res.status(500).json({ error: 'Failed to retrieve courses' });
            return;
        }
        res.json(results);
    });
});

app.get('/assignments/:course_id', (req, res) => {
    const course_id = req.params.course_id;
    db.query(`SELECT * FROM Assignments WHERE course_id = ${course_id}`, (err, results) => {
        if (err) {
            console.error('Error retrieving assignments:', err);
            res.status(500).json({ error: 'Failed to retrieve assignments' });
            return;
        }
        res.json(results);
    });
});

app.get('/available-courses/:student_id', (req, res) => {
    const student_id = req.params.student_id;
    db.query(`SELECT * FROM Course WHERE course_id NOT IN (SELECT course_id FROM Enrollment WHERE student_id = ${student_id})`, (err, results) => {
        if (err) {
            console.error('Error retrieving available courses:', err);
            res.status(500).json({ error: 'Failed to retrieve available courses' });
            return;
        }
        res.json(results);
    });
});

app.post('/enroll', (req, res) => {
    const { student_id, course_id } = req.body;
    db.query(`INSERT INTO Enrollment (student_id, course_id) VALUES (${student_id}, ${course_id})`, (err, results) => {
        if (err) {
            console.error('Error enrolling student:', err);
            res.status(500).json({ error: 'Failed to enroll student' });
            return;
        }
        res.json(results);
    })
});

app.post('/student-login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM Student WHERE student_email = '${email}' AND student_password = '${password}'`, (err, results) => {
        if (err) {
            console.error('Error retrieving student:', err);
            res.status(500).json({ error: 'Failed to retrieve student' });
            return;
        }
        res.json(results);
    });
})

app.post('/teacher-login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM Teacher WHERE teacher_email = '${email}' AND teacher_password = '${password}'`, (err, results) => {
        if (err) {
            console.error('Error retrieving student:', err);
            res.status(500).json({ error: 'Failed to retrieve student' });
            return;
        }
        res.json(results);
    });
})

app.listen(5000, () => console.log(`Server started on port: 5000`))