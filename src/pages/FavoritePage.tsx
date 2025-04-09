import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useFilteredRecipes } from '@/features/recipe/lib/useFilteredRecipes';

export const FavoritePage = () => {
  const visibleFavorites = useFilteredRecipes(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <RecipesList recipes={visibleFavorites} />
      </div>
    </div>
  );
};