const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const port = 3000;
const bookdb = new Database("books.db");
const studentdb = new Database("students.db");

bookdb
  .prepare(
    "CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, year TEXT)"
  )
  .run();

studentdb
  .prepare(
    "CREATE TABLE IF NOT EXISTS students (id TEXT, name TEXT, dept TEXT, score DOUBLE)"
  )
  .run();

app.set("view engine", "ejs");
app.set("views", "./pages");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile("pages/home.html", { root: __dirname });
});

app.get("/add-book", (req, res) => {
  res.sendFile("pages/add-book.html", { root: __dirname });
});

app.get("/add-student", (req, res) => {
  res.sendFile("pages/add-student.html", { root: __dirname });
});

// .run() when query does not return any data
// .all() when query returns data

app.post("/add-book", (req, res) => {
  let title = req.body.title;
  let author = req.body.author;
  let year = req.body.year;
  console.log(`Adding book: ${title}, Author: ${author}, Year: ${year}`);

  bookdb
    .prepare("INSERT INTO books (id, title, author, year) VALUES (?, ?, ?)")
    .run(title, author, year);
  res.redirect("/add-book");
});

app.post("/add-student", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let dept = req.body.dept;
  let score = req.body.score;
  console.log(
    `Adding student: ${name}, id: ${id}, Dept: ${dept}, Score: ${score}`
  );

  studentdb
    .prepare("INSERT INTO students (id, name, dept, score) VALUES (?, ?, ?, ?)")
    .run(id, name, dept, score);
  res.redirect("/add-student");
});

app.get("/book-list", (req, res) => {
  let bookList = bookdb.prepare("SELECT * FROM books").all();
  res.render("books.ejs", { bookList });
});

app.get("/student-list", (req, res) => {
  let studentList = studentdb.prepare("SELECT * FROM students").all();
  res.render("students.ejs", { studentList });
});

app.post("/search", (req, res) => {
  let title = req.body.title;
  let bookList = bookdb
    .prepare("SELECT * FROM books WHERE title LIKE ?")
    .all(`%${title}%`);
  res.render("books.ejs", { bookList });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
