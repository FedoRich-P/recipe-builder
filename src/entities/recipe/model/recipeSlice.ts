// recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchType, SortOption } from '@/entities/recipe/model/types/recipe';


export type RecipeSortState = {
  sortType: SortOption | '';
  sortDirection: 'asc' | 'desc' | '';
};

export type RecipeState = {
  sort: SortOption;
  search: string;
  searchType: SearchType;
  selectedIngredients: string[];
};

const initialState: RecipeState = {
  search: '',
  searchType: 'name',
  sort: {
    sortType: 'name',
    sortDirection: 'asc',
  },
  selectedIngredients: [],
};

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSearchType: (state, action: PayloadAction<SearchType>) => {
      state.searchType = action.payload;
    },
    setSelectedIngredients: (state, action: PayloadAction<string[]>) => {
      state.selectedIngredients = action.payload;
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload;
    },
  },
  selectors: {
    selectSearch: (state: RecipeState) => state.search,
    selectSearchType: (state: RecipeState) => state.searchType,
    selectSelectedIngredients: (state: RecipeState) => state.selectedIngredients,
    selectSort: (state: RecipeState) => state.sort,
  },
});

export const { setSearchTerm, setSearchType, setSelectedIngredients, setSort } = recipeSlice.actions;
export const { selectSearch, selectSearchType, selectSelectedIngredients, selectSort } = recipeSlice.selectors;
export const recipeReducer = recipeSlice.reducer;
