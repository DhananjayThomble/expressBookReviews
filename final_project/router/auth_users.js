const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const isFound = users.find( (user) => user.username === username );
    return !isFound        
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find( user => user.username === username && user.password === password )
    if (!user) return res.status(401).json({ error: "Invalid Credentials" });

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    // check email and password is present
    if (!username || !password)
      return res.status(400).json({ error: "Username and password is required" });
    
    if( authenticatedUser(username, password) ){
        //
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
