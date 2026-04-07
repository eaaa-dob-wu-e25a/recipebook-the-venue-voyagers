import { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL;

// RecipeListPage component - displays all recipes in a list
function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all recipes from API on component mount
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/recipes`)
      .then((response) => {
        setRecipes(response.data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load recipes');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="recipe-list-page">
      <h1>All Recipes</h1>

      {loading && <LoadingSpinner />}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="recipe-count">{recipes.length} recipes found</p>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecipeListPage;
