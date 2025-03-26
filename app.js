const express = require("express");
const db = require("./database"); // Import de la BDD
const app = express();
const port = 3000;
const cors = require("cors");

// Middleware pour traiter le JSON
app.use(express.json());
app.use(cors());

// Route de test
app.get("/", (req, res) => {
  res.send("Bonjour le monde !");
});

// 🔹 Route pour ajouter un album
app.post("/albums", (req, res) => {
  const { title, description, category } = req.body;
  const query = `INSERT INTO albums (title, description, category) VALUES (?, ?, ?)`;

  db.run(query, [title, description, category], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description, category });
  });
});

app.delete("/albums/:id", (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM albums WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Album supprimé" });
  });
});

// 🔹 Route pour récupérer tous les albums
app.get("/albums", (req, res) => {
  db.all("SELECT * FROM albums", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route pour delete un album
app.delete("/albums/:id", (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM albums WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Album supprimé" });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
