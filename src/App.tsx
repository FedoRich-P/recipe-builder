import { Route, Routes } from 'react-router-dom';
import { Layout } from '@app/layout/Layout';
import { RecipesPage } from '@/pages/RecipesPage';
import { FavoritePage } from '@/pages/FavoritePage';
import { NotFound } from '@/pages/NotFound/NotFound';
import { MainRecipePage } from '@/pages/MainRecipePage';

function App() {

  return <>

    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/recipes/:id" element={<MainRecipePage />} />
        <Route path="*" element={
          <NotFound title="Страница не найдена"
                    description="Извините, запрашиваемая страница не существует"
                    buttonText="На главную"
                    navigateTo="/" />} />
      </Route>
    </Routes>
  </>;
}

export default App;
