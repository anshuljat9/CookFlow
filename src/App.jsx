import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetails from './pages/RecipeDetails';
import Kitchen from './pages/Kitchen';
import ImportRecipe from './pages/ImportRecipe';
import CookMode from './pages/CookMode';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="recipe/:id" element={<RecipeDetails />} />
          <Route path="kitchen" element={<Kitchen />} />
          <Route path="import" element={<ImportRecipe />} />
          <Route path="cook/:id" element={<CookMode />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;