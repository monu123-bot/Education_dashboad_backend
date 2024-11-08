const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const authRouter = require('./user/routes/auth')
const indexRouter = require('./user/routes/index')
// const profileRouter = require('./Routes/profile')
// const postRouter = require('./Routes/post')
// const uploadRouter = require('./Routes/upload')
// const commentRouter = require('./Routes/comment')
require('dotenv').config()

app.use(cors({
    // origin:'http://45.13.132.197:8081',
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

const mongoose = require('mongoose')

// require('./models/Post')
require('./models/User')
const db = require('./config/db')
console.log(db)
db()
// console.log(path.join(__dirname, 'views'))
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(session({
    secret:'myseceretkey',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection: mongoose.connection}),
}))
app.use(passport.initialize())
app.use(passport.session())
// console.log(Date.now())



const users = mongoose.model('users')



// app.use('/post',postRouter)
// app.use('/auth',authRouter)
console.log('aa gya 1')
app.use('/',indexRouter)
// app.use('/profile',profileRouter)
// app.use('/get',uploadRouter)
// app.use('/',commentRouter)



app.use('/*',(req,res)=>{
   return res.status(400).json({msg:"page not found"})
})



app.listen(4000,()=>{
    console.log('app is running at port 4000')
})
