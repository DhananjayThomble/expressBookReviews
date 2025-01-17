const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || username.length < 3)
    return res
      .status(400)
      .json({ error: "Name is required and should be min 3 characters long" });
  if (!password || password.length < 6)
    return res.status(400).json({
      error: "Password is required and should be min 6 characters long",
    });

  // check if username is already exist or not
  if (!isValid(username))
    return res.status(400).json({ error: "user is already exist!" });

  // save
  users.push({
    username: username,
    password: password,
  });
  console.log(users);

  res.status(200).json({ message: "user registered successfully.", users });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const booksJson = await books;
  return res.status(200).json(booksJson);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const ISBN = req.params.isbn;
  const book = await books[ISBN];
  res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const bookArr = await Object.values(books);

  const book = bookArr.filter((book) => book.author === author);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const bookArr = Object.values(books);

  const book = bookArr.filter((book) => book.title === title);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];

  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
