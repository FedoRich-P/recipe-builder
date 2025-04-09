import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import { Recipe } from '@/shared/types/recipe';

export const makeFilteredSortedRecipes = () =>
  createSelector(
    [
      (state: RootState) => state.recipe.searchTerm,
      (state: RootState) => state.recipe.sortOption,
      (_: RootState, recipes: Recipe[]) => recipes,
    ],
    (searchTerm, sortOption, recipes) => {
      const filtered = !searchTerm.trim()
        ? recipes
        : recipes.filter((r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const sorted = [...filtered].sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "ingredients-asc":
            return a.ingredients.length - b.ingredients.length;
          case "ingredients-desc":
            return b.ingredients.length - a.ingredients.length;
          default:
            return 0;
        }
      });

      return sorted;
    }
  );



// export const selectVisibleRecipes = createSelector(
//   [
//     (state: RootState) => state.recipe.allRecipes,
//     (state: RootState) => state.recipe.searchTerm,
//     (state: RootState) => state.recipe.sortOption
//   ],
//   (recipes, searchTerm, sortOption) => {
//     const filtered = !searchTerm.trim()
//       ? recipes
//       : recipes.filter((r) =>
//         r.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//
//     const sorted = [...filtered].sort((a, b) => {
//       switch (sortOption) {
//         case 'name-asc': return a.name.localeCompare(b.name);
//         case 'name-desc': return b.name.localeCompare(a.name);
//         case 'ingredients-asc': return a.ingredients.length - b.ingredients.length;
//         case 'ingredients-desc': return b.ingredients.length - a.ingredients.length;
//         default: return 0;
//       }
//     });
//
//     return sorted;
//   }
// );


// import { createSelector } from '@reduxjs/toolkit';
// import { RecipeState } from '@/features/recipe/recipeSlice';
//
// export const selectFilteredRecipes = createSelector(
//   [(state: RecipeState) => state.allRecipes, (state: RecipeState) => state.searchTerm],
//   (recipes, searchTerm) => {
//     if (!searchTerm.trim()) return recipes;
//     const term = searchTerm.toLowerCase();
//     return recipes.filter(recipe => recipe.name.toLowerCase().includes(term));
//   }
// );
//
// export const selectVisibleRecipes = createSelector(
//   [
//     (state: RecipeState) => state.allRecipes,
//     (state: RecipeState) => state.searchTerm,
//     (state: RecipeState) => state.sortOption,
//   ],
//   (recipes, searchTerm, sortOption) => {
//     const filtered = !searchTerm.trim()
//       ? recipes
//       : recipes.filter((r) =>
//         r.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//
//     const sorted = [...filtered].sort((a, b) => {
//       switch (sortOption) {
//         case "name-asc":
//           return a.name.localeCompare(b.name);
//         case "name-desc":
//           return b.name.localeCompare(a.name);
//         case "ingredients-asc":
//           return a.ingredients.length - b.ingredients.length;
//         case "ingredients-desc":
//           return b.ingredients.length - a.ingredients.length;
//         default:
//           return 0;
//       }
//     });
//
//     return sorted;
//   }
// );
//
// export const selectVisibleFavorites = createSelector(
//   [
//     (state: RecipeState) => state.favorites,
//     (state: RecipeState) => state.searchTerm,
//     (state: RecipeState) => state.sortOption,
//   ],
//   (favorites, searchTerm, sortOption) => {
//     const filtered = !searchTerm.trim()
//       ? favorites
//       : favorites.filter((r) =>
//         r.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//
//     const sorted = [...filtered].sort((a, b) => {
//       switch (sortOption) {
//         case "name-asc":
//           return a.name.localeCompare(b.name);
//         case "name-desc":
//           return b.name.localeCompare(a.name);
//         case "ingredients-asc":
//           return a.ingredients.length - b.ingredients.length;
//         case "ingredients-desc":
//           return b.ingredients.length - a.ingredients.length;
//         default:
//           return 0;
//       }
//     });
//
//     return sorted;
//   }
// );
