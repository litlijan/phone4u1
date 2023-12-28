const express = require("express");

require('dotenv').config()
const app = express();
connectDB = require('./config/dbconfig')
const path = require("path");
const nocache = require("nocache");
const session = require('express-session')
const morgan = require("morgan");
const cookieParser = require('cookie-parser')
const router = require("./router/userrouter");
const adminrouter = require('./router/adminrouter')
const flash = require("express-flash")
const { v4: uuidv4 } = require('uuid');
app.set('view engine', 'ejs');

app.use(nocache());
app.use(morgan('tiny'));

const sessionSecret = uuidv4();
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use('/', router);
app.use('/admin', adminrouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`hosted in http://localhost:${PORT}`);
});
