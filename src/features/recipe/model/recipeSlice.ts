import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, SortOption } from '@/features/recipe/model/types/recipe';
import { preloadedState } from '@/recipeDB';

export type RecipeState = {
  allRecipes: Recipe[];
  favorites: Recipe[];
  searchTerm: string;
  sortOption: SortOption;
  selectedIngredients: string[],
}

const initialState: RecipeState = {
  allRecipes: preloadedState.recipes,
  favorites: preloadedState.recipes.filter(recipe => recipe.favorite),
  searchTerm: "",
  sortOption: "name-asc",
  selectedIngredients: [],
};

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.allRecipes.unshift(action.payload);
      if (action.payload.favorite) {
        state.favorites.unshift(action.payload);
      }
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.allRecipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        // Обновляем в основном списке
        state.allRecipes[index] = action.payload;

        // Обновляем в избранном
        const favIndex = state.favorites.findIndex(r => r.id === action.payload.id);
        if (action.payload.favorite) {
          if (favIndex === -1) {
            state.favorites.push(action.payload);
          } else {
            state.favorites[favIndex] = action.payload;
          }
        } else if (favIndex !== -1) {
          state.favorites.splice(favIndex, 1); // Удаляем если сняли избранное
        }
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.allRecipes = state.allRecipes.filter(r => r.id !== action.payload);
      state.favorites = state.favorites.filter(r => r.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipe = state.allRecipes.find(r => r.id === action.payload);
      if (recipe) {
        recipe.favorite = !recipe.favorite;

        // Обновляем избранное в одном месте
        const favIndex = state.favorites.findIndex(r => r.id === action.payload);
        if (recipe.favorite && favIndex === -1) {
          state.favorites.push(recipe);
        } else if (!recipe.favorite && favIndex !== -1) {
          state.favorites.splice(favIndex, 1);
        }
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
    },
    setSelectedIngredients: (state, action: PayloadAction<string[]>) => {
      state.selectedIngredients = action.payload;
    },
  },
  selectors: {
    selectAllRecipes: (state: RecipeState) => state.allRecipes,
    selectFavorites: (state: RecipeState) => state.favorites,
    selectSearchTerm: (state: RecipeState) => state.searchTerm,
    selectSortOption: (state: RecipeState) => state.sortOption,
    selectSelectedIngredients: (state: RecipeState) => state.selectedIngredients,
  }
});

export const {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  setSearchTerm,
  setSortOption,
  setSelectedIngredients
} = recipeSlice.actions;

export const {
  selectAllRecipes,
  selectFavorites,
  selectSearchTerm,
  selectSortOption,
  selectSelectedIngredients,
} = recipeSlice.selectors;

export const recipeReducer = recipeSlice.reducer;
