import { StatsCounter } from '@/shared/ui/StatsCounter';
import { useAppSelector } from '@app/hooks';
import { SortControls } from '@/features/recipe/ui/SortControls';
import { Navigation } from '@/widgets/navigation/Navigation';

export const Header = () => {
  const allRecipes = useAppSelector(state => state.recipe.allRecipes);
  const favorites = useAppSelector(state => state.recipe.favorites);
  return (
    <header className="bg-white flex-wrap shadow py-4 px-6 flex items-center justify-around lg:flex-nowrap">
      <SortControls className={'flex flex-wrap gap-2 justify-start lg:flex-nowrap lg:gap-4 md:mb-3 '} />
      <Navigation className={'flex-wrap mt-5 gap-2 lg:flex-nowrap lg:gap-3 md:mb-3 '}/>
      <StatsCounter totalRecipes={allRecipes.length}
                    favoriteRecipes={favorites.length}
                    className={"hidden xl:flex"} />
    </header>
  );
};