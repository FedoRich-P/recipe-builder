import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe, SearchType } from '@/features/recipe/model/types/recipe';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Типы аргументов и фильтров остаются прежними
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
  type: SearchType; // 'name' | 'category' | 'ingredient'
};

// и мы его не использовали для пагинации
type GetSomeRecipesResponse = {
  recipes: Recipe[];
}

export const recipesApi = createApi({
  reducerPath: 'recipes',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/recipes` }),
  tagTypes: ['Recipe', 'RecipeList'],
  endpoints: (build) => ({
    // Тип возвращаемого значения изменен, чтобы соответствовать использованию в RecipesLayout
    getSomeRecipes: build.query<GetSomeRecipesResponse, GetSomeRecipesArgs>({
      query: ({ page = 1, limit = 8, ...filters }) => ({
        url: '',
        params: { page, limit, ...filters },
      }),
      transformResponse: (response: Recipe[]): GetSomeRecipesResponse => {
        return {
          recipes: response,
        };
      },
      providesTags: (result, error, args) => {
        const listId = `LIST-${JSON.stringify(args)}`; // Кэш на основе всех аргументов
        if (result) {
          return [
            ...result.recipes.map(({ id }) => ({ type: 'Recipe' as const, id })),
            { type: 'RecipeList', id: listId }, // Тег для этого конкретного запроса списка
          ];
        }
        return [{ type: 'RecipeList', id: listId }];
      },
    }),

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

    // getFavoritesRecipes - Без изменений (передача параметра выглядит правильно)
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

    // getRecipeById - Без изменений
    getRecipeById: build.query<Recipe, string | undefined>({
      query: (id) => ({ url: `/${id}` }),
      providesTags: (result, error, id) => (result ? [{ type: 'Recipe', id }] : []),
    }),

    searchRecipes: build.query<Recipe[], SearchArgs | undefined>({
      // Принимает объект SearchArgs или undefined (если поиск пустой)
      query: (args) => {
        // Если аргументы не переданы или термин пустой, не делаем запрос
        // (хотя skip в хуке должен это предотвращать)
        if (!args || !args.term) {
          // Можно вернуть что-то, что не приведет к запросу, но skip надежнее
          return ''; // Или обработать иначе, но skip: !searchArgs в компоненте важнее
        }

        const { term, type } = args;

        // Формируем параметры запроса на основе типа поиска
        const params: Record<string, string> = {};
        // MockAPI обычно фильтрует по имени поля
        params[type] = term; // Например: { name: 'салат' } или { category: 'закуски' }

        // Если для 'name' вы все же хотите использовать 'q', можно добавить условие:
        // if (type === 'name') {
        //   params['q'] = term;
        // } else {
        //   params[type] = term;
        // }
        // Но для консистентности лучше использовать имя поля

        console.log('[API Search] Запрос с параметрами:', params); // Лог для отладки

        return {
          url: '', // Базовый URL уже указан в baseQuery
          params: params,
        };
      },
      providesTags: (result, error, args) => {
        // Тегируем на основе аргументов
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

    // toggleFavorite - Инвалидация выглядит широкой, но безопасной.
    toggleFavorite: build.mutation<Recipe, { id: string; currentFavoriteStatus: boolean }>({
      query: ({ id, currentFavoriteStatus }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: { favorite: !currentFavoriteStatus },
      }),
      // Это инвалидирует ВСЕ списки и конкретный рецепт. Корректно.
      invalidatesTags: (result, error, { id }) => [
        { type: 'Recipe', id },
        { type: 'RecipeList' }, // Инвалидирует ВСЕ теги типа 'RecipeList'
      ],
    }),
  }),
});

// Экспортируем хуки, включая useToggleFavoriteMutation
export const {
  useGetRecipesQuery,
  useGetFavoritesRecipesQuery,
  useGetRecipeByIdQuery,
  useGetSomeRecipesQuery,
  useSearchRecipesQuery,
  useToggleFavoriteMutation, // Добавлен экспорт мутации
} = recipesApi;

export type {
  GetSomeRecipesArgs,
  GetSomeRecipesResponse,
  FetchBaseQueryError,
  SerializedError,
};


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Recipe } from '@/features/recipe/model/types/recipe';
// import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
// import { SerializedError } from '@reduxjs/toolkit';
//
// type PaginationArgs = {
//   page: number;
//   limit: number;
// }
//
// type RecipeFilters = {
//   favorite?: boolean;
//   [key: string]: any;
// }
//
// type GetSomeRecipesArgs = PaginationArgs & RecipeFilters;
// type GetSomeRecipesResponse = {
//   recipes: Recipe[];
//   totalCount: number;  // Этот totalCount мы будем вычислять вручную, так как MockAPI не поддерживает его по умолчанию
// }
//
// export const recipesApi = createApi({
//   reducerPath: 'recipes',
//   baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/recipes` }),
//   tagTypes: ['Recipe', 'RecipeList'],
//   endpoints: (build) => ({
//     getSomeRecipes: build.query<GetSomeRecipesResponse, GetSomeRecipesArgs>({
//       query: ({ page = 1, limit = 8, favorite, ...filters  }) => ({
//         url: '',
//         params: {  page,
//           limit,
//           ...(favorite ? { favorite: 'true' } : {}),
//           ...filters },
//       }),
//       transformResponse: (response: Recipe[]): GetSomeRecipesResponse => {
//         const totalCount = response.length;
//
//         return {
//           recipes: response,
//           totalCount,
//         };
//       },
//       providesTags: (result, error, args) => {
//         const listId = args.favorite
//           ? `FAVORITE_PAGE_${args.page}`
//           : `ALL_PAGE_${args.page}`;
//         return result
//           ? [
//             ...result.recipes.map(({ id }) => ({ type: 'Recipe', id })),
//             { type: 'RecipeList', id: listId }
//           ]
//           : [{ type: 'RecipeList', id: listId }];
//       },
//     }),
//     getRecipes: build.query<Recipe[], void>({
//       query: () => '',
//       providesTags: (result) =>
//         result
//           ? [
//             ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
//             { type: 'RecipeList', id: 'ALL' },
//           ]
//           : [{ type: 'RecipeList', id: 'ALL' }],
//     }),
//     getFavoritesRecipes: build.query<Recipe[], void>({
//       query: () => ({ url: '', params: { favorite: true } }), // Правильно передаем параметр
//       providesTags: (result) =>
//         result
//           ? [
//             ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
//             { type: 'RecipeList', id: 'FAVORITES' },
//           ]
//           : [{ type: 'RecipeList', id: 'FAVORITES' }],
//     }),
//     getRecipeById: build.query<Recipe, string | undefined>({
//       query: (id) => ({ url: `/${id}` }),
//       providesTags: (result, error, id) => (result ? [{ type: 'Recipe', id }] : []),
//     }),
//     searchRecipes: build.query<Recipe[], string | undefined>({
//       query: (searchTerm) => ({ url: '', params: { q: searchTerm } }), // Пример параметра поиска 'q'
//       providesTags: (result, error, searchTerm) =>
//         result
//           ? [
//             ...result.map(({ id }) => ({ type: 'Recipe' as const, id })),
//             { type: 'RecipeList', id: `SEARCH-${searchTerm}` },
//           ]
//           : [{ type: 'RecipeList', id: `SEARCH-${searchTerm}` }],
//     }),
//     toggleFavorite: build.mutation<Recipe, { id: string; currentFavoriteStatus: boolean }>({
//       query: ({ id, currentFavoriteStatus }) => ({
//         url: `/${id}`,
//         method: 'PATCH', // Или PUT, если PATCH не поддерживается
//         body: { favorite: !currentFavoriteStatus },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: 'Recipe', id },
//         { type: 'RecipeList' },
//       ],
//     }),
//   }),
// });
//
// export const {
//   useGetRecipesQuery,
//   useGetFavoritesRecipesQuery,
//   useGetRecipeByIdQuery,
//   useGetSomeRecipesQuery,
//   useSearchRecipesQuery,
// } = recipesApi;
//
// export type {
//   GetSomeRecipesArgs,
//   GetSomeRecipesResponse,
//   FetchBaseQueryError,
//   SerializedError,
// };
