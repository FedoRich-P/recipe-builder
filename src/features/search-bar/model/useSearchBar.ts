import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectSearch, selectSearchType, setSearchTerm, setSearchType } from '@/entities/recipe/model/recipeSlice';
import { useGetRecipesQuery } from '@/entities/recipe/api/recipesApi';
import { SearchType } from '@/entities/recipe/model/types/recipe';

export const useSearchBar = () => {
  const dispatch = useAppDispatch();
  const currentSearchTerm = useAppSelector(selectSearch);
  const currentSearchType = useAppSelector(selectSearchType);

  const { data: allRecipesData, isLoading: isLoadingRecipes } = useGetRecipesQuery();

  const allRecipeNames = useMemo(() => {
    if (isLoadingRecipes || !allRecipesData) return [];
    return allRecipesData.map(recipe => recipe.name);
  }, [allRecipesData, isLoadingRecipes]);

  const uniqueCategories = useMemo(() => {
    if (isLoadingRecipes || !allRecipesData) return [];
    const categories = allRecipesData
      .map(recipe => recipe.category)
      .filter((category): category is string => !!category);
    return Array.from(new Set(categories));
  }, [allRecipesData, isLoadingRecipes]);

  const currentSuggestions = useMemo(() => {
    return currentSearchType === 'category' ? uniqueCategories : allRecipeNames;
  }, [currentSearchType, uniqueCategories, allRecipeNames]);

  const handleSearchUpdate = (query: string) => {
    dispatch(setSearchTerm(query));
  };

  const handleSortChange = (value: SearchType) => {
    dispatch(setSearchType(value));
    dispatch(setSearchTerm(''));
  };

  return {
    currentSearchTerm,
    currentSearchType,
    currentSuggestions,
    handleSearchUpdate,
    handleSortChange,
  };
};
