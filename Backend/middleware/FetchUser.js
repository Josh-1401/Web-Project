// Middleware function to fetch user information
const usersDB ={
    users: require('../Model/users.json'),
    setUsers: function(data) {this.users = data}
}
const usersDB1 ={
    users: require('../Model/currentusers.json'),
    setUsers: function(data) {this.users = data}
}
const fetchUserInfo = (req, res, next) => {
     setTimeout(() => {
                // Redirect to a different page after the delay
                 // Replace with your URL
            }, 3000);
    const foundUser = usersDB1.users.map(person => person.username);
    const tokenq = usersDB.users.filter(person => foundUser.includes(person.username));
    const firstUserWithToken = tokenq[0]; 
    if (firstUserWithToken && firstUserWithToken.username) {
        console.log('hii');
        res.locals.username = foundUser;
        console.log(firstUserWithToken.username);
        res.locals.roles = firstUserWithToken.roles;
        const roles = firstUserWithToken.roles;
        res.locals.isAdmin = roles && roles.Admin > 0;
    } else {
        res.locals.username = '';
    }

    next();
};

// Use the middleware for all routes that need user information
module.exports = fetchUserInfo;