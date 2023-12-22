const userDB ={
    users: require('../Model/users.json'),
    setUsers: function(data) {this.users = data}
}
const fsPromises =require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    const user = req.body.username;
    const pwd = req.body.password;
    //const{user,pwd} =req.body;
    if(!user||!pwd) return res.status(400).json({'message':'Username and password are required'});
    const duplicate = userDB.users.find(person => person.username === user);
    if(duplicate) return res.sendStatus(409);//Conflict
    try{
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {
            "username":user,
            "roles":{"User":2001},
            "password":hashedPwd};
        userDB.setUsers([...userDB.users,newUser]);
        await fsPromises.writeFile(path.join(__dirname,'..','Model','users.json'),JSON.stringify(userDB.users));	
    console.log(userDB.users);
    res.render('Home/login');
    // res.status(201).json({'success':'User created ${user} successfully'});
    }catch(err){
        res.status(500).json({'message':err.message});
    }
}
module.exports = {handleNewUser}