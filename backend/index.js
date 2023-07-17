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

/*
app.get('/teachers1', (req, res) => {
    db.query('SELECT teacher.*, GROUP_CONCAT(Course.course_id) AS course_teacher_ids FROM teacher LEFT JOIN course ON teacher.teacher_id = course.teacher_id GROUP BY teacher.teacher_id;', (err, results) => {
        if (err) {
            console.error('Error retrieving teachers:', err);
            res.status(500).json({ error: 'Failed to retrieve teachers' });
            return;
        }
        res.json(results);
    });
});
*/

/*
app.get('/teachers', async (req, res) => {
    let teacher = null
    db.query('SELECT * FROM Teacher', (err, results) => {
        if (err) {
            console.error('Error retrieving teachers:', err);
            res.status(500).json({ error: 'Failed to retrieve teachers' });
            return;
        }
        teacher = results;
        teacher.forEach((teacher) => {
            let courses = []
            db.query(`SELECT * FROM Course WHERE Course.teacher_id = ${teacher.teacher_id}`, async (err, results) => {
                if (err) {
                    console.error('Error retrieving courses:', err);
                    res.status(500).json({ error: 'Failed to retrieve courses' });
                    return;
                }
                courses.push(results);
            });

            teacher.courses = courses
        });
        res.json(teacher);
    });
});
*/

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

app.get('/students', (req, res) => {
    db.query('SELECT * FROM Student', (err, results) => {
        if (err) {
            console.error('Error retrieving students:', err);
            res.status(500).json({ error: 'Failed to retrieve students' });
            return;
        }
        res.json(results);
    });
});

app.post('/login', (req, res) => {
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

app.listen(5000, () => console.log(`Server started on port: 5000`))