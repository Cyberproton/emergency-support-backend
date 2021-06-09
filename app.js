var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv')
const cors = require('cors')
const connectToDatabase = require('./config/database')
const port = process.env.PORT | 3000

const userRouter = require('./routes/user')
const auth = require('./middlewares/auth')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const helpRouter = require('./routes/help')
const locationRouter = require('./routes/location')
const notificationRouter = require('./routes/notification')
const profileRouter = require('./routes/profile')
const contactRouter = require('./routes/contact')

var app = express();

dotenv.config({ path: './config/config.env' })

// connect to database
connectToDatabase()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter)
app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)
app.use('/api/notification', notificationRouter)
app.use(auth.checkAuth)
app.use('/api/location', locationRouter)
app.use('/api/help', helpRouter)
app.use('/api/profile', profileRouter)
app.use('/api/contact', contactRouter)


app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

module.exports = app;

