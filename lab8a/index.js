const express = require("express");
const app = express();
const port = 3000;

const Database = require("better-sqlite3");
const db = new Database("notes.db");

app.set("view engine", "ejs");
app.set("views", "./pages");
app.use(express.urlencoded({ extended: true })); // for form data

db.prepare(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, name TEXT, description TEXT)"
).run();

// Home page
app.get("/", (req, res) => {
  const search = req.query.search;
  if (search) {
    const notes = db
      .prepare("SELECT * FROM notes WHERE name LIKE ?")
      .all(`%${search}%`);
    res.render("home.ejs", { notes });
  } else {
    const notes = db.prepare("SELECT * FROM notes").all();
    res.render("home.ejs", { notes });
  }
});

// Add note form page
app.get("/add", (req, res) => {
  res.sendFile("pages/add-note.html", { root: __dirname });
});

// Add note
app.post("/add", (req, res) => {
  const { name, description } = req.body;

  db.prepare("INSERT INTO notes (name, description) VALUES (?, ?)").run(
    name,
    description
  );

  res.redirect("/");
});

// single note details
app.get("/note/:id", (req, res) => {
  const id = req.params.id;
  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  res.render("note-details.ejs", { note });
});

// delete note
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
