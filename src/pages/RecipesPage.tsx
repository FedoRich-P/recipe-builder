import { RecipesList } from '@/features/recipe/ui/RecipesList';
import { useFilteredRecipes } from '@/features/recipe/lib/useFilteredRecipes';

export const RecipesPage = () => {
  const visibleRecipes = useFilteredRecipes();

  return  <RecipesList recipes={visibleRecipes} />
};