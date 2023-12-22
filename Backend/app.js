const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const verifyJWT = require('./middleware/verifyjwt');
const cookieParser = require('cookie-parser');
const productsRouter = require('./routes/product.routes');
const categoriesRouter = require('./routes/categories.routes');
const DetailsRouter = require('./routes/proddet.routes');
const RegisterRouter = require('./routes/register.routes');
const authRouter = require('./routes/auth.routes');
const refreshRouter = require('./routes/refresh.routes');
const logoutRouter = require('./routes/logout.routes');

app.use(cookieParser());


const products = require('./productsData');
var mysql = require('mysql');
const cons=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_project'
})
app.get('/',function(req,res){
cons.getConnection(function(err,connection){
    if(err) throw err;
    connection.query('select * from categories',(err,result)=>{
        if(err) throw err;
        res.send(result);
        connection.release();   
})
    })})
app.use('/register',RegisterRouter);
app.use('/auth',authRouter);
app.use('/refresh',refreshRouter);
app.use('/logout',logoutRouter);
app.use(verifyJWT);
app.use('/',categoriesRouter);

//app.use('/',categoriesRouter);
//app.use('/',productsRouter);
//app.use('/',DetailsRouter);


app.get('/',(req,res)=>{
    res.send('WEB SHOP')
})
app.listen(8080, ()=>{
    console.log("server running in localhost 8080");
})