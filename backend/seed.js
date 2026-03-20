const db = require('./database');

/**
 * Seed the database with sample data
 * Run with: node seed.js
 */

console.log('🌱 Starting database seed...\n');

try {
  // Clear existing data (for development/testing)
  db.exec('DELETE FROM reviews');
  db.exec('DELETE FROM recipe_tags');
  db.exec('DELETE FROM recipes');
  db.exec('DELETE FROM tags');
  db.exec('DELETE FROM users');

  // ==================== USERS ====================
  const users = [
    { username: 'john_chef', email: 'john@example.com', profile_picture_url: 'https://i.pravatar.cc/150?img=1' },
    { username: 'maria_baker', email: 'maria@example.com', profile_picture_url: 'https://i.pravatar.cc/150?img=2' },
    { username: 'carlo_italian', email: 'carlo@example.com', profile_picture_url: 'https://i.pravatar.cc/150?img=3' },
    { username: 'priya_spice', email: 'priya@example.com', profile_picture_url: 'https://i.pravatar.cc/150?img=4' },
    { username: 'anna_nordic', email: 'anna@example.com', profile_picture_url: 'https://i.pravatar.cc/150?img=5' }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (username, email, profile_picture_url)
    VALUES (?, ?, ?)
  `);

  const userIds = {};
  users.forEach(user => {
    const result = insertUser.run(user.username, user.email, user.profile_picture_url);
    userIds[user.username] = result.lastInsertRowid;
  });

  console.log(`✓ Created ${users.length} users`);

  // ==================== TAGS ====================
  const tags = [
    'Quick',
    'Vegetarian',
    'Comfort Food',
    'Healthy',
    'Dessert',
    'Spicy',
    'Vegan',
    'Gluten-Free'
  ];

  const insertTag = db.prepare(`
    INSERT INTO tags (name)
    VALUES (?)
  `);

  const tagIds = {};
  tags.forEach(tag => {
    const result = insertTag.run(tag);
    tagIds[tag] = result.lastInsertRowid;
  });

  console.log(`✓ Created ${tags.length} tags`);

  // ==================== RECIPES ====================
  const recipes = [
    {
      title: 'Spaghetti Bolognese',
      description: 'Classic Italian pasta dish with rich meat sauce',
      instructions: 'Cook spaghetti according to package instructions. Heat olive oil in a large pan, brown the ground beef with onions and garlic. Add tomato paste, crushed tomatoes, and simmer for 20 minutes. Combine with cooked spaghetti and serve with Parmesan.',
      image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      cuisine: 'Italian',
      cook_time_minutes: 35,
      servings: 4,
      difficulty: 2,
      created_by: 'carlo_italian',
      tags: ['Comfort Food']
    },
    {
      title: 'Chicken Tikka Masala',
      description: 'Creamy Indian curry with tender chicken pieces',
      instructions: 'Marinate chicken in yogurt and spices for 1 hour. Grill or pan-fry the chicken until golden. In another pan, sauté onions and garlic, add tomato sauce and heavy cream. Add cooked chicken and simmer for 15 minutes. Serve with basmati rice and naan bread.',
      image_url: 'https://images.unsplash.com/photo-1524521252197-7831e4d49768?w=400',
      cuisine: 'Indian',
      cook_time_minutes: 50,
      servings: 4,
      difficulty: 3,
      created_by: 'priya_spice',
      tags: ['Spicy', 'Healthy']
    },
    {
      title: 'Vegetable Stir-Fry',
      description: 'Quick and colorful Japanese-style stir-fried vegetables',
      instructions: 'Heat oil in a wok over high heat. Add garlic and ginger, stir-fry for 30 seconds. Add vegetables in order of cooking time (harder vegetables first). Toss with soy sauce and sesame oil. Serve over rice.',
      image_url: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400',
      cuisine: 'Japanese',
      cook_time_minutes: 20,
      servings: 3,
      difficulty: 2,
      created_by: 'john_chef',
      tags: ['Quick', 'Vegetarian', 'Healthy']
    },
    {
      title: 'Chocolate Brownies',
      description: 'Fudgy homemade brownies that are pure chocolate heaven',
      instructions: 'Preheat oven to 350°F. Melt butter and chocolate together. Whisk eggs with sugar and vanilla. Combine chocolate mixture with egg mixture. Fold in flour and baking powder. Pour into greased pan and bake for 25 minutes. Cool before cutting.',
      image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
      cuisine: 'American',
      cook_time_minutes: 35,
      servings: 12,
      difficulty: 2,
      created_by: 'maria_baker',
      tags: ['Dessert']
    },
    {
      title: 'Tacos al Pastor',
      description: 'Mexican street tacos with marinated pork and pineapple',
      instructions: 'Marinate thinly sliced pork with dried chiles, pineapple juice, and spices for 4 hours. Cook on a flat griddle or skillet until caramelized. Serve in warm tortillas with fresh pineapple, onion, and cilantro.',
      image_url: 'https://images.unsplash.com/photo-1552606596-c3b4b8c80f3d?w=400',
      cuisine: 'Mexican',
      cook_time_minutes: 30,
      servings: 4,
      difficulty: 3,
      created_by: 'john_chef',
      tags: ['Spicy']
    },
    {
      title: 'Creamy Mushroom Pasta',
      description: 'Simple but elegant Italian pasta with creamy mushroom sauce',
      instructions: 'Cook pasta until al dente. In another pan, sauté sliced mushrooms and garlic in butter until golden. Add white wine and let reduce. Stir in heavy cream and Parmesan. Combine with pasta and finish with fresh thyme.',
      image_url: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400',
      cuisine: 'Italian',
      cook_time_minutes: 25,
      servings: 3,
      difficulty: 2,
      created_by: 'carlo_italian',
      tags: ['Quick', 'Vegetarian']
    },
    {
      title: 'Greek Salad',
      description: 'Fresh Mediterranean salad with feta and olives',
      instructions: 'Chop tomatoes, cucumbers, red onion, and bell peppers. Toss with Kalamata olives and crumbled feta cheese. Dress with olive oil, lemon juice, oregano, salt and pepper. Let sit for 15 minutes before serving.',
      image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      cuisine: 'Greek',
      cook_time_minutes: 15,
      servings: 4,
      difficulty: 1,
      created_by: 'john_chef',
      tags: ['Quick', 'Vegetarian', 'Healthy', 'Gluten-Free']
    },
    {
      title: 'Smørrebrød',
      description: 'Traditional Danish open-faced sandwich with various toppings',
      instructions: 'Toast dark rye bread slices. Top with butter and choice of: herring with red onion, roast beef with horseradish, or shrimp with lemon. Garnish with fresh herbs and capers. Serve immediately.',
      image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
      cuisine: 'Danish',
      cook_time_minutes: 10,
      servings: 2,
      difficulty: 1,
      created_by: 'anna_nordic',
      tags: ['Quick']
    },
    {
      title: 'Vegan Buddha Bowl',
      description: 'Colorful and nutritious plant-based power bowl',
      instructions: 'Cook quinoa according to package instructions. Roast chickpeas and vegetables (broccoli, sweet potato, beets) with olive oil and spices at 425°F for 25 minutes. Arrange in a bowl with quinoa, fresh greens, avocado, and tahini dressing.',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      cuisine: 'American',
      cook_time_minutes: 40,
      servings: 2,
      difficulty: 2,
      created_by: 'priya_spice',
      tags: ['Vegan', 'Vegetarian', 'Healthy', 'Gluten-Free']
    },
    {
      title: 'Beef Ramen',
      description: 'Japanese noodle soup with rich beef broth and tender meat',
      instructions: 'Simmer beef bones and aromatics for 4 hours to make broth. Cook ramen noodles separately. Slice cooked beef brisket. Pour hot broth into bowls, add noodles and beef. Top with soft-boiled eggs, green onions, nori, and sesame seeds.',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      cuisine: 'Japanese',
      cook_time_minutes: 240,
      servings: 4,
      difficulty: 4,
      created_by: 'carlo_italian',
      tags: ['Spicy', 'Comfort Food']
    }
  ];

  const insertRecipe = db.prepare(`
    INSERT INTO recipes (title, description, instructions, image_url, cuisine, cook_time_minutes, servings, difficulty, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  recipes.forEach(recipe => {
    const result = insertRecipe.run(
      recipe.title,
      recipe.description,
      recipe.instructions,
      recipe.image_url,
      recipe.cuisine,
      recipe.cook_time_minutes,
      recipe.servings,
      recipe.difficulty,
      userIds[recipe.created_by]
    );

    // Link tags to this recipe
    const recipeId = result.lastInsertRowid;
    const insertRecipeTag = db.prepare(`
      INSERT INTO recipe_tags (recipe_id, tag_id)
      VALUES (?, ?)
    `);

    recipe.tags.forEach(tagName => {
      insertRecipeTag.run(recipeId, tagIds[tagName]);
    });
  });

  console.log(`✓ Created ${recipes.length} recipes with tags`);

  // ==================== REVIEWS ====================
  const reviews = [
    { recipe_idx: 0, user: 'john_chef', rating: 5, comment: 'Classic and delicious! Made it twice already.' },
    { recipe_idx: 0, user: 'maria_baker', rating: 4, comment: 'Great recipe, but I prefer more garlic.' },
    { recipe_idx: 1, user: 'carlo_italian', rating: 5, comment: 'Authentic and amazing!' },
    { recipe_idx: 1, user: 'john_chef', rating: 4, comment: 'Very tasty, cooked it last weekend.' },
    { recipe_idx: 2, user: 'priya_spice', rating: 5, comment: 'Quick weeknight dinner, kids loved it!' },
    { recipe_idx: 3, user: 'anna_nordic', rating: 5, comment: 'Best brownies I have ever had!' },
    { recipe_idx: 4, user: 'maria_baker', rating: 4, comment: 'Fun to make, excellent flavors.' },
    { recipe_idx: 6, user: 'john_chef', rating: 5, comment: 'Simple, fresh, and healthy!' },
    { recipe_idx: 7, user: 'carlo_italian', rating: 3, comment: 'Good, but miss the classic Danish flavors.' }
  ];

  const insertReview = db.prepare(`
    INSERT INTO reviews (recipe_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `);

  reviews.forEach(review => {
    const recipeId = review.recipe_idx + 1; // Recipe IDs start at 1
    const userId = userIds[review.user];
    insertReview.run(recipeId, userId, review.rating, review.comment);
  });

  console.log(`✓ Created ${reviews.length} reviews\n`);

  console.log('✅ Database seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Recipes: ${recipes.length}`);
  console.log(`   - Tags: ${tags.length}`);
  console.log(`   - Reviews: ${reviews.length}`);

} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
}
