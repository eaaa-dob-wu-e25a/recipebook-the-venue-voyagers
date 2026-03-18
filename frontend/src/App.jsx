import axios from 'axios';
import './App.css' 
import RecipeListPage from './pages/RecipeListPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const url = process.env.REACT_APP_API_URL

const apiCall = () => {
  axios.get(url).then((data) => {
    console.log(data)
  })
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to RecipeBook</h1>} />
        <Route path="/recipes" element={<RecipeListPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
