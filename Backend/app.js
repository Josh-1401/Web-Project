const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', __dirname + '/views');
const methodOverride = require('method-override');

const verifyJWT = require('./middleware/verifyjwt');
const fetchrole = require('./middleware/FetchUser');

const cookieParser = require('cookie-parser');
const categoriesRouter = require('./routes/categories.routes');
const RegisterRouter = require('./routes/register.routes');
const authRouter = require('./routes/auth.routes');
const refreshRouter = require('./routes/refresh.routes');
const logoutRouter = require('./routes/logout.routes');

app.use(cookieParser());


var mysql = require('mysql');
const cons=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_project'
})
app.get('/login',(req,res)=>{
    res.render('Home/login');
})


app.get('/register',(req,res)=>{
    res.render('Home/register');
})
app.get('/',(req,res)=>{
    //res.send('WEB SHOP')
    res.render('Home/index',{title:'Home Guest'});
})
app.use('/register',RegisterRouter);
app.use('/auth',authRouter);
app.use('/refresh',refreshRouter);
app.use('/logout',logoutRouter);
app.use(methodOverride('_method'));
app.use(fetchrole);
app.use(verifyJWT);

app.get('/home',(req,res)=>{
    res.render('Home/home',{title:'Home' ,
    isAdmin: res.locals.isAdmin,user:res.locals.username});
})

app.use('/',categoriesRouter);



app.listen(8080, ()=>{
    console.log("server running in localhost 8080");
})