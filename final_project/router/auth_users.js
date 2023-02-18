const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = "fingerprint_customer";

const isValid = (username) => { //returns boolean
    const isFound = users.find((user) => user.username === username);
    return !isFound
}

const authenticatedUser = (username, password) => { //returns boolean
    const user = users.find(user => user.username === username && user.password === password)
    if (!user) return false;
    return true;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // check email and password is present
    if (!username || !password)
        return res.status(400).json({ error: "Username and password is required" });

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ error: "Invalid Credentials" })
    }
    // password matched, create a token
    const token = jwt.sign({ username: username }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return res.status(200).json({ token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // const {username} = req.customer;
    // const ISBN = req.params.isbn;
    // const bookArr = Object.values(books);
    // const book = bookArr[ISBN];
    // console.log(ISBN, book);
    // if (!book) {
    //     return res.status(404).json({ error: "Book not found" });
    // } 

    // if( book.reviews?.username ){
    //     book.reviews?.content.push("hi");
    // }


    res.status(200).send();
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
