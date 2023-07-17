import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => console.log("Server started on port: 5000"))