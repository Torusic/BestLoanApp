import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ConnectDB from './config/ConnectDB.js'
import userRouter from './routes/user.route.js'
import loanRouter from './routes/loan.route.js'


dotenv.config()

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan('dev'))
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use('/api/user',userRouter);
app.use('/api/loan',loanRouter)
const PORT=process.env.PORT
ConnectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Best Loan App is running on port ${PORT}`)
})

})
