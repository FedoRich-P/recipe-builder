import { StatsCounter } from '@/shared/ui/StatsCounter';
import {
  useGetFavoritesRecipesQuery,
  useGetRecipesQuery,
  useSearchRecipesQuery,
} from '@/entities/recipe/api/recipesApi';
import { Navigation } from '@/shared/ui/navigation/Navigation';
import { SearchBar } from '@/features/search-bar/ui/SearchBar';

export const Header = () => {
  const { data: allRecipesData } = useGetRecipesQuery();
  const { data: favoriteRecipesCount } = useGetFavoritesRecipesQuery();


  return (
    <header
      className="sticky top-0 max-w-[1440px] mx-auto bg-white flex-wrap shadow py-4 px-6 flex items-center justify-around lg:justify-around z-1000">
      <SearchBar />
      <Navigation
        className="flex-wrap gap-2 lg:flex-nowrap lg:gap-3 order-last lg:order-none w-full lg:w-auto justify-center" />
      <StatsCounter totalRecipes={allRecipesData?.length}
                    favoriteRecipes={favoriteRecipesCount?.length}
                    className="hidden xl:flex order-last lg:order-none" />
    </header>
  );
};
