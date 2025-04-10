import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useGetRecipesQuery } from '@/features/recipe/model/recipesSlice';
import { NotFound } from '@/shared/ui/NotFound/NotFound';
import { Loader } from '@components/Loader';

export const RecipesPage = () => {
  const { data, isLoading, error } = useGetRecipesQuery();

  if (isLoading) return <Loader/>
  if (error) return <NotFound />;

  return <RecipesList recipes={data} />;
};