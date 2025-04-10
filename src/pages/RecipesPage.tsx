import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useGetRecipesQuery } from '@/features/recipe/model/recipesSlice';

export const RecipesPage = () => {
  const { data, isLoading, error } = useGetRecipesQuery();

  if (isLoading) return 'Loading...';
  if (error) return 'Список рецептов пуст';

  return <RecipesList recipes={data} />;
};