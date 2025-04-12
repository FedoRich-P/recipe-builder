// import { useMemo } from 'react';
// import { selectKnownIngredients } from '@/features/recipe/model/selectors/selectKnownIngredients';
// import { useAppSelector } from '@app/hooks';

// export const useIngredientSuggestions = (input: string) => {
  // const knownIngredients = useAppSelector(selectKnownIngredients);

  // return useMemo(() => {
  //   const query = input.trim().toLowerCase();
  //   if (!query) return [];
  //   return knownIngredients.filter(ing => ing.startsWith(query));
  // }, [input, knownIngredients]);
// };