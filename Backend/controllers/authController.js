const usersDB ={
    users: require('../Model/users.json'),
    setUsers: function(data) {this.users = data}
}
const userDB1 ={
    users: require('../Model/currentusers.json'),
    setUsers: function(data) {this.users = data}
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path=require('path');

const handleLogin = async (req,res)=>{
    const user =req.body.username;
    const pwd =req.body.password;
    if(!user||!pwd) return res.status(400).json({'message':'Username and password are required'});
    const foundUser = usersDB.users.find(person => person.username === user);

    if(!foundUser) return res.sendStatus(401)//Unauthorized
    
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles )
        //create JWT
        const accessToken = jwt.sign(
            {"UserInfo":{ 
                "username": foundUser.username,
                "roles": roles}
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1d'} 
        );
        const refreshToken = jwt.sign(
            
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        const newUser = {
            "username":user};
        userDB1.setUsers([...userDB1.users,newUser]);
        await fsPromises.writeFile(path.join(__dirname,'..','Model','currentusers.json'),JSON.stringify(userDB1.users));

        
        //saving refresh tooken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser,accessToken, refreshToken};
        usersDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','Model','users.json'),JSON.stringify(usersDB.users));
            res.cookie('jwt',refreshToken,{httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            //res.render('Home/home', {title: 'Home'});
            setTimeout(() => {
                // Redirect to a different page after the delay
                 // Replace with your URL
            }, 3000);
            res.redirect('/');
        }else{
        res.sendStatus(401)
    }
}
module.exports= {handleLogin}