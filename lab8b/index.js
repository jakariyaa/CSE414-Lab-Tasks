const express = require("express");
const app = express();
const port = 3000;

const Database = require("better-sqlite3");
const db = new Database("products.db");

db.prepare(
  "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, quantity INTEGER)"
).run();

// populate the db
// const insert = db.prepare(
//   "INSERT INTO products (id, name, description, price, quantity) VALUES (?, ?, ?, ?, ?)"
// );
// const productsToAdd = [
//   [1, "Product 1", "Description 1", 10.99, 100],
//   [2, "Product 2", "Description 2", 19.99, 50],
//   [3, "Product 3", "Description 3", 5.99, 200],
//   [4, "Product 4", "Description 4", 15.99, 150],
//   [5, "Product 5", "Description 5", 8.99, 300],
// ];
// for (const product of productsToAdd) {
//   insert.run(...product);
// }

app.set("view engine", "ejs");
app.set("views", "./pages");
app.use(express.urlencoded({ extended: true })); // for form data

// Home page
app.get("/", (req, res) => {
  const search = req.query.name;
  if (search) {
    const productList = db
      .prepare("SELECT * FROM products WHERE name LIKE ?")
      .all(`%${search}%`);
    res.render("home.ejs", { productList });
  } else {
    const productList = db.prepare("SELECT * FROM products").all();
    res.render("home.ejs", { productList });
  }
});

// Product details page
app.get("/product/:id", (req, res) => {
  const productId = req.params.id;
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(productId);
  res.render("product-details.ejs", { product });
});

// Delete product
app.post("/delete-product/:id", (req, res) => {
  const productId = req.params.id;
  db.prepare("DELETE FROM products WHERE id = ?").run(productId);
  res.redirect("/");
});

// Add product form page
app.get("/add", (req, res) => {
  res.sendFile("pages/add-product.html", { root: __dirname });
});

// Add product to database
app.post("/add-product", (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const quantity = req.body.quantity;

  db.prepare(
    "INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)"
  ).run(name, description, price, quantity);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
