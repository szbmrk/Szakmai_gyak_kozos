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

app.get('/api', (req, res) => {
    res.json({ msg: 'Hello from the backend!' })
})

app.get('/teachers', (req, res) => {
    db.query('SELECT * FROM Teacher', (err, results) => {
        if (err) {
            console.error('Error retrieving teachers:', err);
            res.status(500).json({ error: 'Failed to retrieve teachers' });
            return;
        }
        res.json(results);
    });
});

app.listen(5000, () => console.log(`Server started on port: 5000`))