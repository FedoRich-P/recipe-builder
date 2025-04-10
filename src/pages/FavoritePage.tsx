import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useGetFavoritesRecipesQuery } from '@/features/recipe/model/recipesSlice';
import { NotFound } from '@/shared/ui/NotFound/NotFound';
import { Loader } from '@components/Loader';

export const FavoritePage = () => {
  const {data, isLoading, error} = useGetFavoritesRecipesQuery()

  if (isLoading) return <Loader/>
  if (error) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <RecipesList recipes={data} />
      </div>
    </div>
  );
};