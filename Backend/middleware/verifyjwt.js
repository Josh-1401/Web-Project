const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { log } = require('console');
require('dotenv').config();
//const token = localStorage.getItem('token');
const usersDB ={
    users: require('../Model/users.json'),
    setUsers: function(data) {this.users = data}
}
const usersDB1 ={
    users: require('../Model/currentusers.json'),
    setUsers: function(data) {this.users = data}
}
const verifyJWT =(req,res,next)=>{
    const foundUser = usersDB1.users.map(person => person.username);
    const tokenq = usersDB.users.filter(person => foundUser.includes(person.username));
    const firstUserWithToken = tokenq[0]; // Access the first user object
    const accessToken = firstUserWithToken ? firstUserWithToken.accessToken : null; // Extract the access token if available

    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            res.redirect('/login');
            return;
        }
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next();
    })
}
module.exports = verifyJWT