import { Link } from 'react-router-dom';

// RecipeCard component - reusable card component for displaying recipe summary
// Props: recipe object with id, title, cuisine, cook_time_minutes
function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
      <div className="recipe-card">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="recipe-card-image" />
        )}
        <div className="recipe-card-content">
          <h3>{recipe.title}</h3>
          <p className="cuisine">{recipe.cuisine}</p>
          <p className="cook-time">⏱️ {recipe.cook_time_minutes} min</p>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
