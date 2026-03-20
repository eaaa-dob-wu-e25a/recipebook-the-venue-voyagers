const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database file
const dbPath = path.join(__dirname, 'recipes.db');
const db = new Database(dbPath);

// Enable foreign keys for referential integrity
db.pragma('foreign_keys = ON');

/**
 * Initialize the database with all required tables
 * This function creates the schema if it doesn't exist
 */
function initializeDatabase() {
  // Users table - stores recipe creators and reviewers
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      profile_picture_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Recipes table - main recipe data
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      instructions TEXT NOT NULL,
      image_url TEXT,
      cuisine TEXT,
      cook_time_minutes INTEGER,
      servings INTEGER,
      difficulty INTEGER CHECK(difficulty >= 1 AND difficulty <= 5),
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tags table - recipe tags (e.g., "Vegetarian", "Quick", etc.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // recipe_tags junction table - many-to-many relationship
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipe_tags (
      recipe_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (recipe_id, tag_id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);

  // Reviews table - user reviews for recipes
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

// Initialize the database when this module is loaded
initializeDatabase();

module.exports = db;
