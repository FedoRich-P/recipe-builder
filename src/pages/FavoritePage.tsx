import { RecipesLayout } from '@/features/recipe/ui/RecipesLayout';

export const FavoritePage = () => {
  return (
    <RecipesLayout favoriteOnly={true} />
  );
};