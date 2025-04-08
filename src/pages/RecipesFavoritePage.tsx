import { RecipesList } from '@components/RecipesList/RecipesList';
import { useAppSelector } from '@app/hooks';
import { selectFavorites } from '@/features/recipe/recipeSlice';

export const RecipesFavoritePage = () => {
  const recipes = useAppSelector(selectFavorites);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <RecipesList recipes={recipes} />
      </div>
    </div>
  );
};