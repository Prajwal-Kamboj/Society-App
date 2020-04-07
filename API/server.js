const express = require('express');
const dotenv = require ('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
var cookieParser = require('cookie-parser');


// load env 
dotenv.config({path : './config/config.env'});


//connect to db
connectDB();



const app = express();
//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/auth');

// Body parser
app.use(express.json());

app.use(cookieParser());





// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', users);
app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)
   
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
  });

app.use(errorHandler);

const PORT= process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// handle unhandled rejections
process.on('unhandledRejection',(err, promise) =>{
    console.log(`Error : ${err.message}`);
    //close server and exit process
    server.close(()=> process.exit(1));
})