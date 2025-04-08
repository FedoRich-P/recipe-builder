import { RecipesPage } from '@/pages/RecipesPage';
import { RecipeEditPage } from '@/pages/RecipeEditPage';
import { Route, Routes } from 'react-router-dom';
import { RecipesFavoritePage } from '@/pages/RecipesFavoritePage';
import { Layout } from '@components/layout/Layout';

function App() {
  return <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/favorites" element={<RecipesFavoritePage />} />
        <Route path="/recipes/:id" element={<RecipeEditPage />} />
      </Route>
    </Routes>
  </>;
}

export default App;
