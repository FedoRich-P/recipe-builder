import { RecipesList } from '@components/RecipesList/RecipesList';
import { selectFavorites } from '@/features/recipe/recipeSlice';
import { useFilteredSortedRecipes } from '@/shared/hooks/useFilteredSortedRecipes';
import { useAppSelector } from '@/app/hooks';

export const RecipesFavoritePage = () => {
  const favorites = useAppSelector(selectFavorites);
  const visibleFavorites = useFilteredSortedRecipes(favorites);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <RecipesList recipes={visibleFavorites} />
      </div>
    </div>
  );
};