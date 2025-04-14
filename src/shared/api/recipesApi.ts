import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe, SearchType } from '@/entities/recipe/model/types/recipe';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

type PaginationArgs = {
  page: number;
  limit: number;
}
type RecipeFilters = {
  favorite?: boolean;
  [key: string]: any;
}

type GetSomeRecipesArgs = PaginationArgs & RecipeFilters;

type SearchArgs = {
  term: string;
  type: SearchType;
};

type GetSomeRecipesResponse = {
  recipes: Recipe[];
}

export const recipesApi = createApi({
  reducerPath: 'recipes',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/recipes` }),
  tagTypes: ['Recipe', 'RecipeList'],
  endpoints: (build) => ({
    getSomeRecipes: build.query<GetSomeRecipesResponse, GetSomeRecipesArgs & { sortBy?: string, order?: 'asc' | 'desc' | '' }>( {
      query: ({ page = 1, limit = 8, sortBy, order, ...filters }) => ({
        url: '',
        params: {
          page,
          limit,
          sortBy,
          order,
          ...filters
        },
      }),
      transformResponse: (response: Recipe[]): GetSomeRecipesResponse => ({ recipes: response }),
      providesTags: (result, error, args) => {
        const listId = `LIST-${JSON.stringify(args)}`;
        if (result) {
          return [
            ...result.recipes.map(({ id }) => ({ type: 'Recipe' as const, id })),
            { type: 'RecipeList', id: listId },
          ];
        }
        return [{ type: 'RecipeList', id: listId }];
      },
    }),
    // getSomeRecipes: build.query<GetSomeRecipesResponse, GetSomeRecipesArgs>({
    //   query: ({ page = 1, limit = 8, favorite, ingredients }) => {
    //     const params: Record<string, string | number> = {
    //       page,
    //       limit,
    //       ...(favorite !== undefined && { favorite }),
    //       ...(ingredients && { 'ingredients.name': ingredients }),  // Здесь добавляем фильтрацию по ингредиентам
    //     };
    //
    //     return { url: '', params };
    //   },
    //   transformResponse: (response: Recipe[]): GetSomeRecipesResponse => ({ recipes: response }),
    //   providesTags: (result, error, args) => {
    //     const listId = `LIST-${JSON.stringify(args)}`;
    //     if (result) {
    //       return [
    //         ...result.recipes.map(({ id }) => ({ type: 'Recipe' as const, id })),
    //         { type: 'RecipeList', id: listId },
    //       ];
    //     }
    //     return [{ type: 'RecipeList', id: listId }];
    //   },
    // }),

    getRecipes: build.query<Recipe[], void>({
      query: () => '',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
            { type: 'RecipeList', id: 'ALL' },
          ]
          : [{ type: 'RecipeList', id: 'ALL' }],
    }),

    getFavoritesRecipes: build.query<Recipe[], void>({
      query: () => ({ url: '', params: { favorite: true } }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
            { type: 'RecipeList', id: 'FAVORITES' },
          ]
          : [{ type: 'RecipeList', id: 'FAVORITES' }],
    }),

    getRecipeById: build.query<Recipe, string | undefined>({
      query: (id) => ({ url: `/${id}` }),
      providesTags: (result, error, id) => (result ? [{ type: 'Recipe', id }] : []),
    }),

    searchRecipes: build.query<Recipe[], SearchArgs | undefined>({
      query: (args) => {

        if (!args || !args.term) return '';

        const { term, type } = args;
        const params: Record<string, string> = {};
        params[type] = term;

        return { url: '', params};
      },
      providesTags: (result, error, args) => {
        const tagId = args ? `SEARCH-${args.type}-${args.term}` : 'SEARCH-EMPTY';
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
            { type: 'RecipeList', id: tagId },
          ];
        }
        return [{ type: 'RecipeList', id: tagId }];
      },
    }),

    toggleFavorite: build.mutation<Recipe, { id: string; currentFavoriteStatus: boolean }>({
      query: ({ id, currentFavoriteStatus }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: { favorite: !currentFavoriteStatus },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Recipe', id },
        { type: 'RecipeList' },
      ],
    }),
    deleteRecipe: build.mutation<void, string>({
      query: (id) => {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Recipe', id },
        { type: 'RecipeList', id: 'ALL' },
      ],
    }),
    createRecipe: build.mutation<void, Recipe>({
      query: (newRecipe) => ({
        url: '',
        method: 'POST',
        body: newRecipe,
      }),
      invalidatesTags: [{ type: 'RecipeList', id: 'ALL' }],
    }),

    updateRecipe: build.mutation<Recipe, { id: string; data: Partial<Recipe> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Recipe', id },
        { type: 'RecipeList' },
      ],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetFavoritesRecipesQuery,
  useGetRecipeByIdQuery,
  useGetSomeRecipesQuery,
  useSearchRecipesQuery,
  useToggleFavoriteMutation,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useUpdateRecipeMutation
} = recipesApi;

export type {
  GetSomeRecipesArgs,
  GetSomeRecipesResponse,
  FetchBaseQueryError,
  SerializedError,
};
