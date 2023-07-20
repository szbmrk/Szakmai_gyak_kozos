import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import teachers from "./routes/teachers.js"
import courses from "./routes/courses.js"
import assignments from "./routes/assignments.js"
import quizzes from "./routes/quizzes.js"
import login from "./routes/login.js"

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/teachers', teachers)
app.use('/courses', courses)
app.use('/assignments', assignments)
app.use('/quizzes', quizzes)
app.use('/login', login)

app.listen(5000, () => console.log(`Server started on port: 5000`))