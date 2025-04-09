import { Route, Routes } from 'react-router-dom';
import { Layout } from '@app/layout/Layout';
import { RecipesPage } from '@/pages/RecipesPage';
import { FavoritePage } from '@/pages/FavoritePage';
import { EditPage } from '@/pages/EditPage';

function App() {
  return <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/recipes/:id" element={<EditPage />} />
      </Route>
    </Routes>
  </>;
}
export default App;
