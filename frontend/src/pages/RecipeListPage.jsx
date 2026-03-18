import { useState, useEffect } from "react";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
      axios.get(url + "/recipes").then((response) => {
          setRecipes(response.data.recipes);
      });
    }, []);

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
