const sqlite3 = require("sqlite3").verbose();

// Ouvrir (ou créer) la base de données
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erreur ouverture BD :", err.message);
  } else {
    console.log("Connexion à SQLite réussie !");

    // Table albums
    db.run(`CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table media (liée aux albums)
    db.run(`CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER,
      type TEXT, -- image, video, audio, gif
      url TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (album_id) REFERENCES albums(id)
    )`);
  }
});

module.exports = db;
