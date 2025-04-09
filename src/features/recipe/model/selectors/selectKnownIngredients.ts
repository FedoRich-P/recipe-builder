import { createSelector } from '@reduxjs/toolkit';
import { selectAllRecipes } from '@/features/recipe/model/recipeSlice';

export const selectKnownIngredients = createSelector(
  selectAllRecipes,
  (recipes) => {
    const ingredientsSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => ingredientsSet.add(ing.toLowerCase()));
    });
    return Array.from(ingredientsSet).sort();
  }
);