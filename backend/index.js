require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for React frontend

// ==================== RECIPES ====================

/**
 * GET /recipes
 * List all recipes with optional filtering
 * Query params: ?cuisine=Italian&search=pasta
 */
app.get('/recipes', (req, res) => {
  try {
    const { cuisine, search } = req.query;

    // Build the query dynamically based on filters
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];

    if (cuisine) {
      query += ' AND cuisine = ?';
      params.push(cuisine);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const recipes = db.prepare(query).all(...params);

    // Get tags for each recipe
    const recipesWithTags = recipes.map(recipe => {
      const tags = db
        .prepare(`
          SELECT t.id, t.name
          FROM tags t
          JOIN recipe_tags rt ON t.id = rt.tag_id
          WHERE rt.recipe_id = ?
        `)
        .all(recipe.id);

      return { ...recipe, tags };
    });

    res.json(recipesWithTags);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

/**
 * GET /recipes/:id
 * Get a single recipe with its tags and reviews
 */
app.get('/recipes/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Get recipe
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Get tags
    const tags = db
      .prepare(`
        SELECT t.id, t.name
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = ?
      `)
      .all(recipe.id);

    // Get reviews with user info
    const reviews = db
      .prepare(`
        SELECT r.id, r.rating, r.comment, r.created_at, u.username, u.profile_picture_url
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.recipe_id = ?
        ORDER BY r.created_at DESC
      `)
      .all(recipe.id);

    // Get creator info
    const creator = db.prepare('SELECT id, username, profile_picture_url FROM users WHERE id = ?').get(recipe.created_by);

    res.json({
      ...recipe,
      tags,
      reviews,
      creator
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

/**
 * POST /recipes
 * Create a new recipe
 * Body: { title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, created_by, tags: [tag_ids] }
 */
app.post('/recipes', (req, res) => {
  try {
    const { title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, created_by, tags } = req.body;

    // Validate required fields
    if (!title || !instructions || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insert = db.prepare(`
      INSERT INTO recipes (title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, created_by);
    const recipeId = result.lastInsertRowid;

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      const insertTag = db.prepare('INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)');
      tags.forEach(tagId => {
        insertTag.run(recipeId, tagId);
      });
    }

    // Fetch and return the new recipe
    const newRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

/**
 * PUT /recipes/:id
 * Update an existing recipe
 */
app.put('/recipes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty } = req.body;

    const update = db.prepare(`
      UPDATE recipes
      SET title = ?, description = ?, instructions = ?, image_url = ?, cuisine = ?, cook_time_minutes = ?, servings = ?, difficulty = ?
      WHERE id = ?
    `);

    update.run(title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, id);

    const updatedRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

/**
 * DELETE /recipes/:id
 * Delete a recipe (cascades to tags and reviews due to foreign keys)
 */
app.delete('/recipes/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Check if recipe exists
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
    res.json({ message: 'Recipe deleted successfully', id });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// ==================== USERS ====================

/**
 * GET /users
 * List all users
 */
app.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, email, profile_picture_url, created_at FROM users').all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /users/:id
 * Get a single user with their created recipes and reviews
 */
app.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recipes created by this user
    const recipes = db.prepare('SELECT id, title, cuisine FROM recipes WHERE created_by = ?').all(id);

    // Get reviews by this user
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.comment, r.created_at, rec.title as recipe_title
      FROM reviews r
      JOIN recipes rec ON r.recipe_id = rec.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `).all(id);

    res.json({
      ...user,
      recipes,
      reviews
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ==================== TAGS ====================

/**
 * GET /tags
 * List all available tags
 */
app.get('/tags', (req, res) => {
  try {
    const tags = db.prepare('SELECT id, name FROM tags ORDER BY name ASC').all();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// ==================== REVIEWS ====================

/**
 * POST /reviews
 * Create a new review for a recipe
 * Body: { recipe_id, user_id, rating, comment }
 */
app.post('/reviews', (req, res) => {
  try {
    const { recipe_id, user_id, rating, comment } = req.body;

    // Validate required fields
    if (!recipe_id || !user_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate rating is 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const insert = db.prepare(`
      INSERT INTO reviews (recipe_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(recipe_id, user_id, rating, comment);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// ==================== SERVER ====================

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🍳 RecipeBook API running on http://localhost:${PORT}`);
});