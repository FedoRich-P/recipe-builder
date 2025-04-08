import { NavLink } from 'react-router-dom';
import { StatsCounter } from '@components/sidebar/StatsCounter';
import { useAppSelector } from '@app/hooks';

export const Header = () => {
  const allRecipes = useAppSelector(state => state.recipe.allRecipes)
  const favorites = useAppSelector(state => state.recipe.favorites)
  return (
    <header className="bg-white shadow py-4 flex items-center justify-evenly">
      <nav className="container px-4 flex space-x-6">
        <NavLink to="/"
                 className={({ isActive }) =>
                   `font-medium ${isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'}`}>
          Все рецепты
        </NavLink>
        <NavLink to="/favorites"
                 className={({ isActive }) =>
                   `font-medium ${isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-400'}`}>
          Избранные рецепты
        </NavLink>
      </nav>
      <StatsCounter totalRecipes={allRecipes.length} favoriteRecipes={favorites.length} className="mt-auto"/>
    </header>
  );
};