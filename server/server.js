import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ConnectDB from './config/ConnectDB.js'
import userRouter from './routes/user.route.js'
import loanRouter from './routes/loan.route.js'
import mpesaRoute from './routes/mpesa.route.js'
import agentRouter from './routes/agent.route.js'
import repaymentRouter from './routes/repayment.route.js'


dotenv.config()

const app=express()
app.use(express.json())
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

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
app.use('/api/loan',loanRouter);
app.use('/api/agent',agentRouter);
app.use('/api/repay',repaymentRouter)
app.use('/api/mpesa',mpesaRoute);
const PORT=process.env.PORT
ConnectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Best Loan App is running on port ${PORT}`)
})

})
