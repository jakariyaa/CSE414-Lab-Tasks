const express = require("express");
const app = express();
const port = 3000;

const Database = require("better-sqlite3");
const db = new Database("students.db");

// Create table if it doesn't exist
db.prepare(
  "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, department TEXT, cgpa REAL, dob TEXT)"
).run();

// const insert = db.prepare("INSERT INTO students (id, name, department, cgpa, dob) VALUES (?, ?, ?, ?, ?)");
// const studentsToAdd = [
//   [1, "Alice Johnson", "CSE", 3.8, "2001-05-14"],
//   [2, "Bob Smith", "EEE", 3.5, "2000-12-01"],
//   [3, "Carol Davis", "MCE", 3.2, "2001-08-22"],
//   [4, "David Wilson", "CSE", 3.9, "1999-07-17"],
//   [5, "Eva Brown", "CEE", 3.4, "2002-03-03"],
//   [6, "Frank Moore", "CSE", 3.6, "2000-10-10"],
//   [7, "Grace Lee", "EEE", 3.7, "2001-01-25"],
//   [8, "Hannah Taylor", "MCE", 3.3, "2000-09-09"],
//   [9, "Ian Anderson", "CEE", 3.1, "1999-11-11"],
//   [10, "Jane Martin", "CSE", 3.85, "2001-02-28"],
// ];
// for (const student of studentsToAdd) {
//   insert.run(...student);
// }

app.set("view engine", "ejs");
app.set("views", "./pages");
app.use(express.urlencoded({ extended: true })); // for form data
app.use("/static", express.static("static")); // Serve static files from the "static" directory

// Home page
app.get("/", (req, res) => {
  res.sendFile("pages/home.html", { root: __dirname });
});

// Show add student form
app.get("/add-student", (req, res) => {
  res.sendFile("pages/add-student.html", { root: __dirname });
});

// Add student to database
app.post("/add-student", (req, res) => {
  const name = req.body.name;
  const department = req.body.department;
  const cgpa = req.body.cgpa;
  const dob = req.body.dob;

  db.prepare(
    "INSERT INTO students (name, department, cgpa, dob) VALUES (?, ?, ?, ?)"
  ).run(name, department, cgpa, dob);

  res.redirect("/add-student");
});

// Show student list (Filterable)
app.get("/student-list", (req, res) => {
  const department = req.query.department;
  if (department) {
    studentList = db
      .prepare("SELECT * FROM students WHERE department = ?")
      .all(department);
  } else {
    studentList = db.prepare("SELECT * FROM students").all();
  }
  res.render("student-list.ejs", { studentList });
});

// Show single student details
app.get("/student/:id", (req, res) => {
  const id = req.params.id;
  const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
  res.render("student-details.ejs", { student });
});

// Delete student
app.post("/delete-student/:id", (req, res) => {
  const id = req.params.id;
  db.prepare("DELETE FROM students WHERE id = ?").run(id);
  res.redirect("/student-list");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
