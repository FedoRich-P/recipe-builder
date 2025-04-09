import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Recipe } from '@/shared/types/recipe';
import { makeFilteredSortedRecipes } from '@/shared/selectors/reciveSelectors';

export const useFilteredSortedRecipes = (recipes: Recipe[]) => {
  const selectFilteredSorted = useMemo(makeFilteredSortedRecipes, []);
  return useAppSelector((state) => selectFilteredSorted(state, recipes));
};