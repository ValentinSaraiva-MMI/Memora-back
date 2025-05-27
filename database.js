const sqlite3 = require("sqlite3").verbose();

// Ouvrir (ou créer) la base de données
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erreur ouverture BD :", err.message);
  } else {
    console.log("Connexion à SQLite réussie !");
    // Création des tables si elles n'existent pas
    db.run(`CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pseudo TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);
  }
});

module.exports = db;
