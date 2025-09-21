import express from 'express'
import cors from 'cors'
import "dotenv/config";
import { connectDb } from './libs/db.js'
import userRouter from './routes/userRoute.js';


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', userRouter)

const PORT = process.env.PORT || 5000

await connectDb()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})