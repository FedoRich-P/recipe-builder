import { StatsCounter } from '@components/sidebar/StatsCounter';
import { useAppSelector } from '@app/hooks';
import { SortControls } from '@components/sidebar/SortControls';
import { Navigation } from '@components/Navigation';

export const Header = () => {
  const allRecipes = useAppSelector(state => state.recipe.allRecipes);
  const favorites = useAppSelector(state => state.recipe.favorites);
  return (
    <header className="bg-white shadow py-4 px-6 flex items-center justify-around">
      <SortControls className={'flex flex-wrap gap-2 justify-start lg:flex-row lg:gap-4 lg:flex-nowrap lg:flex-row md:gap-4'} />
      <Navigation />
      <StatsCounter totalRecipes={allRecipes.length}
                    favoriteRecipes={favorites.length}
                    className={"hidden xl:flex"} />
    </header>
  );
};