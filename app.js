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

app.post("/auth", (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  // Vérifie si l'utilisateur existe déjà
  const queryCheck = `SELECT * FROM users WHERE email = ?`;
  db.get(queryCheck, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (user) {
      // L'utilisateur existe -> vérifier le mot de passe
      if (user.password === password) {
        res.json({ message: "Connexion réussie", user });
      } else {
        res.status(401).json({ error: "Mot de passe incorrect" });
      }
    } else {
      // L'utilisateur n'existe pas → on l'inscrit
      const insertQuery = `INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)`;
      db.run(insertQuery, [pseudo, email, password], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          message: "Inscription réussie",
          user: { id: this.lastID, pseudo, email },
        });
      });
    }
  });
});

// 🔹 Route d'inscription
app.post("/register", (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const insertQuery = `INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)`;
  db.run(insertQuery, [pseudo, email, password], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Inscription réussie",
      user: { id: this.lastID, pseudo, email },
    });
  });
});

// 🔹 Route de connexion
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const queryCheck = `SELECT * FROM users WHERE email = ?`;
  db.get(queryCheck, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    if (user.password === password) {
      res.json({ message: "Connexion réussie", user });
    } else {
      res.status(401).json({ error: "Mot de passe incorrect" });
    }
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
