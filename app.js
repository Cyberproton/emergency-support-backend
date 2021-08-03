var createError = require('http-errors');
var express = require('express');
const http = require('http')
const { Server } = require('socket.io')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv')
const cors = require('cors')
const connectToDatabase = require('./config/database')
const handleIO = require('./socket/socket')
const userRouter = require('./routes/user')
const auth = require('./middlewares/auth')
const authSocket = require('./middlewares/auth_socket')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const helpRouter = require('./routes/help')
const locationRouter = require('./routes/location')
const profileRouter = require('./routes/profile')
const contactRouter = require('./routes/contact')

const app = express();

dotenv.config({ path: './config/config.env' })

const port = process.env.PORT || 3000
const host = '0.0.0.0'

// connect to database
connectToDatabase()

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter)
app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)
app.use(auth.checkAuth)
app.use('/api/location', locationRouter)
app.use('/api/help', helpRouter)
app.use('/api/profile', profileRouter)
app.use('/api/contact', contactRouter)

const server = app.listen(port, host, () => {
  console.log(`Server running at port ${port}`)
})

const io = new Server(server)

handleIO.handleIO(io)

module.exports = app;

