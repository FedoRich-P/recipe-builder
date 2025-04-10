import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe } from '@/features/recipe/model/types/recipe';

export const recipesApi = createApi({
  reducerPath: 'recipes',
  baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_API_BASE_URL}/recipes`}),
  endpoints: (build) => ({
    getRecipes: build.query<Recipe[], void>({
      query: () => ({url: '' })
    }),
    getRecipeById: build.query<Recipe, {id: string | undefined}>({
      query: ({ id }) => ({url: `/${id}` })
    }),
    getFavoritesRecipes: build.query<Recipe[], void>({
      query: () => ({url: '?favorite=true' })
    }),
  })
})

export  const {useGetRecipesQuery, useGetFavoritesRecipesQuery, useGetRecipeByIdQuery} = recipesApi

// type RecipeState = {
//   data: Recipe[];
//   clientState: {
//     searchTerm: string;
//     sortOption: SortOption;
//     selectedIngredients: string[];
//   }
// }
//
// const initialState: RecipeState = {
//   data: [],
//   clientState: {
//     searchTerm: '',
//     sortOption: 'name-asc',
//     selectedIngredients: [],
//   },
// };

// export const fetchRecipes = createAsyncThunk(
//   'recipes/fetchRecipes',
//   async function() {
//     return await axios.get<Recipe[]>(`${import.meta.env.VITE_API_BASE_URL}/recipes`);
//   },
// );