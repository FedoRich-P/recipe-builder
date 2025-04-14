import { RecipesLayout } from '@/entities/recipe/ui/RecipesLayout';

export const FavoritePage = () => {
  return (
    <RecipesLayout favoriteOnly={true} />
  );
};