import { NavLink, Route, Routes } from 'react-router-dom';
import { Layout } from '@app/layout/Layout';
import { RecipesPage } from '@/pages/RecipesPage';
import { FavoritePage } from '@/pages/FavoritePage';
import { NotFound } from '@/shared/ui/NotFound/NotFound';

function App() {

  return <>

    {/*<nav style={{ padding: '1rem', marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>*/}
    {/*  <NavLink to="/" style={{ marginRight: '1rem' }}>Все рецепты</NavLink>*/}
    {/*  <NavLink to="/favorites">Избранное</NavLink>*/}
    {/*</nav>*/}

    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        {/*<Route path="/recipes/:id" element={<MainRecipePage />} />*/}
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
