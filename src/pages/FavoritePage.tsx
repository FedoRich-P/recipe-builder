import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useGetFavoritesRecipesQuery } from '@/features/recipe/model/recipesSlice';

export const FavoritePage = () => {
  const {data, isLoading, error} = useGetFavoritesRecipesQuery()

  if (isLoading) return 'Loading...';
  if (error) return 'Список рецептов пуст';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <RecipesList recipes={data} />
      </div>
    </div>
  );
};