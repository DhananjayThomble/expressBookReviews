const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = "fingerprint_customer";

const isValid = (username) => {
  //returns boolean
  const isFound = users.find((user) => user.username === username);
  return !isFound;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) return false;
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // check email and password is present
  if (!username || !password)
    return res.status(400).json({ error: "Username and password is required" });

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  // password matched, create a token
  const token = jwt.sign({ username: username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.customer;
  const ISBN = req.params.isbn;
  const book = books[ISBN];

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // get review from request query
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ error: "Review is required" });
  }

  const reviewArr = Object.values(book.reviews);
  console.log(reviewArr);
  if (!reviewArr) {
    book.reviews = [];
    return res.send("test");
  }

  const reviewObj = {
    username: username,
    review: review,
  };

  // check if user has already reviewed the book, if yes, update the review
  const reviewIndex = reviewArr.findIndex(
    (review) => review.username === username
  );
  if (reviewIndex !== -1) {
    reviewArr[reviewIndex] = reviewObj;
  } else {
    reviewArr.push(reviewObj);
  }

  // update the book review array
  book.reviews = reviewArr;
  books[ISBN] = book;
  console.log(books[ISBN]);

  return res.status(200).json(books);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.customer;
  const ISBN = req.params.isbn;
  const book = books[ISBN];

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const reviewArr = Object.values(book.reviews);
  if (!reviewArr) {
    return res.status(400).json({ error: "no reviews found" });
  }

  const updatedReviewArr = reviewArr.filter(
    (review) => review.username !== username
  );

  // update the book review array
  book.reviews = updatedReviewArr;
  books[ISBN] = book;
  // console.log(books[ISBN]);

  return res.status(200).json(books);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
