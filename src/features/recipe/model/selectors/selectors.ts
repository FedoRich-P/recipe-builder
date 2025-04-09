import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import { Recipe, SortOption } from '@/features/recipe/model/types/recipe';

// Вынесем общую логику в отдельную функцию
const applyFiltersAndSorting = (
  recipes: Recipe[],
  searchTerm: string,
  sortOption: SortOption,
  selectedIngredients: string[]
): Recipe[] => {
  // 1. Фильтрация по названию
  const filteredByName = searchTerm.trim()
    ? recipes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : recipes;

  // 2. Фильтрация по ингредиентам
  const filteredByIngredients = selectedIngredients.length > 0
    ? filteredByName.filter(recipe =>
      selectedIngredients.every(ing =>
        recipe.ingredients.some(recipeIng =>
          recipeIng.toLowerCase().includes(ing.toLowerCase())
        )
      ))
    : filteredByName;

  // 3. Сортировка
  return [...filteredByIngredients].sort((a, b) => {
    switch (sortOption) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "ingredients-asc": return a.ingredients.length - b.ingredients.length;
      case "ingredients-desc": return b.ingredients.length - a.ingredients.length;
      default: return 0;
    }
  });
};

export const selectFilteredRecipes = createSelector(
  [
    (state: RootState) => state.recipe.searchTerm,
    (state: RootState) => state.recipe.sortOption,
    (state: RootState) => state.recipe.selectedIngredients,
    (state: RootState) => state.recipe.allRecipes,
  ],
  (searchTerm, sortOption, selectedIngredients, allRecipes) =>
    applyFiltersAndSorting(allRecipes, searchTerm, sortOption, selectedIngredients)
);

export const selectFilteredFavorites = createSelector(
  [
    (state: RootState) => state.recipe.searchTerm,
    (state: RootState) => state.recipe.sortOption,
    (state: RootState) => state.recipe.selectedIngredients,
    (state: RootState) => state.recipe.favorites,
  ],
  (searchTerm, sortOption, selectedIngredients, favorites) =>
    applyFiltersAndSorting(favorites, searchTerm, sortOption, selectedIngredients)
);
