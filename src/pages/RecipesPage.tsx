import { RecipesList } from '@components/RecipesList/RecipesList';
import { useAppSelector } from '@app/hooks';
import { selectAllRecipes } from '@/features/recipe/recipeSlice';
import { useFilteredSortedRecipes } from '@/shared/hooks/useFilteredSortedRecipes';

export const RecipesPage = () => {
  const allRecipes = useAppSelector(selectAllRecipes);
  const visibleFavorites = useFilteredSortedRecipes(allRecipes);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
          <RecipesList recipes={visibleFavorites} />
      </div>
    </div>
  );
};