const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Register new user
  users.push({username: username, password: password});
  return res.status(201).json({message: "User successfully registered"});
});

// ========== ORIGINAL SYNCHRONOUS ROUTES ==========

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if book with the given ISBN exists
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  // Iterate through all books
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        isbn: isbn,
        ...books[isbn]
      });
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json({books: booksByAuthor});
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  // Iterate through all books
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({
        isbn: isbn,
        ...books[isbn]
      });
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json({books: booksByTitle});
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if book with the given ISBN exists
  if (books[isbn]) {
    return res.status(200).json({reviews: books[isbn].reviews});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// ========== ASYNC/AWAIT VERSIONS FOR TASKS 10-13 ==========

// Helper function to simulate async operation
const simulateAsyncOperation = (data, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Task 10: Get all books using async/await
public_users.get('/async/books', async function (req, res) {
  try {
    const booksData = await simulateAsyncOperation(books);
    return res.status(200).json({books: booksData});
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book by ISBN using async/await
public_users.get('/async/books/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await simulateAsyncOperation(books[isbn]);
    
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching book", error: error.message});
  }
});

// Task 12: Get books by author using async/await
public_users.get('/async/books/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksData = await simulateAsyncOperation(books);
    const booksByAuthor = [];
    
    for (let isbn in booksData) {
      if (booksData[isbn].author === author) {
        booksByAuthor.push({
          isbn: isbn,
          ...booksData[isbn]
        });
      }
    }
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json({books: booksByAuthor});
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author", error: error.message});
  }
});

// Task 13: Get books by title using async/await
public_users.get('/async/books/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksData = await simulateAsyncOperation(books);
    const booksByTitle = [];
    
    for (let isbn in booksData) {
      if (booksData[isbn].title === title) {
        booksByTitle.push({
          isbn: isbn,
          ...booksData[isbn]
        });
      }
    }
    
    if (booksByTitle.length > 0) {
      return res.status(200).json({books: booksByTitle});
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title", error: error.message});
  }
});

// ========== PROMISE-BASED VERSIONS (Alternative Implementation) ==========

// Task 10: Get all books using Promises
public_users.get('/promise/books', function (req, res) {
  simulateAsyncOperation(books)
    .then(booksData => {
      return res.status(200).json({books: booksData});
    })
    .catch(error => {
      return res.status(500).json({message: "Error fetching books", error: error.message});
    });
});

// Task 11: Get book by ISBN using Promises
public_users.get('/promise/books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  simulateAsyncOperation(books[isbn])
    .then(book => {
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch(error => {
      return res.status(500).json({message: "Error fetching book", error: error.message});
    });
});

// Task 12: Get books by author using Promises
public_users.get('/promise/books/author/:author', function (req, res) {
  const author = req.params.author;
  
  simulateAsyncOperation(books)
    .then(booksData => {
      const booksByAuthor = [];
      
      for (let isbn in booksData) {
        if (booksData[isbn].author === author) {
          booksByAuthor.push({
            isbn: isbn,
            ...booksData[isbn]
          });
        }
      }
      
      if (booksByAuthor.length > 0) {
        return res.status(200).json({books: booksByAuthor});
      } else {
        return res.status(404).json({message: "No books found by this author"});
      }
    })
    .catch(error => {
      return res.status(500).json({message: "Error fetching books by author", error: error.message});
    });
});

// Task 13: Get books by title using Promises
public_users.get('/promise/books/title/:title', function (req, res) {
  const title = req.params.title;
  
  simulateAsyncOperation(books)
    .then(booksData => {
      const booksByTitle = [];
      
      for (let isbn in booksData) {
        if (booksData[isbn].title === title) {
          booksByTitle.push({
            isbn: isbn,
            ...booksData[isbn]
          });
        }
      }
      
      if (booksByTitle.length > 0) {
        return res.status(200).json({books: booksByTitle});
      } else {
        return res.status(404).json({message: "No books found with this title"});
      }
    })
    .catch(error => {
      return res.status(500).json({message: "Error fetching books by title", error: error.message});
    });
});

module.exports.general = public_users;