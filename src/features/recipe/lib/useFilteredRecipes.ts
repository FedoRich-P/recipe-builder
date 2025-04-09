import { useAppSelector } from '@app/hooks';
import { selectFilteredRecipes, selectFilteredFavorites } from '@/features/recipe/model/selectors/selectors';

export const useFilteredRecipes = (useFavorites = false) => {
  return useAppSelector(useFavorites ? selectFilteredFavorites : selectFilteredRecipes);
};