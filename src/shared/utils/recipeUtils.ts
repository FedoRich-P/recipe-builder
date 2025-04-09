// import { createSelector } from '@reduxjs/toolkit';
// import { Recipe, SortOption } from '@/shared/types/recipe';
//
// export const sortRecipes = createSelector(
//   (recipes: Recipe[], sortOption: SortOption) => ({ recipes, sortOption }),
//   ({ recipes, sortOption }) => {
//     const sorted = [...recipes];
//     switch (sortOption) {
//       case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
//       case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
//       case 'ingredients-asc': return sorted.sort((a, b) => a.ingredients.length - b.ingredients.length);
//       case 'ingredients-desc': return sorted.sort((a, b) => b.ingredients.length - a.ingredients.length);
//       default: return sorted;
//     }
//   }
// );
//
// // Мемоизированная функция фильтрации
// export const filterRecipes = createSelector(
//   (recipes: Recipe[], searchTerm: string) => ({ recipes, searchTerm }),
//   ({ recipes, searchTerm }) => {
//     if (!searchTerm) return recipes;
//     const term = searchTerm.toLowerCase();
//     return recipes.filter(recipe =>
//       recipe.name.toLowerCase().includes(term)
//     );
//   }
// );
//
// // Мемоизированная функция для избранного
// export const getFavoriteRecipes = createSelector(
//   (recipes: Recipe[], favoriteIds: string[]) => ({ recipes, favoriteIds }),
//   ({ recipes, favoriteIds }) =>
//     recipes.filter(recipe => favoriteIds.includes(recipe.id))
// );