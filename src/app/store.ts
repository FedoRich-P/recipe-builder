import { configureStore } from '@reduxjs/toolkit'
import {recipeReducer} from "@/features/recipe/model/recipeSlice";
import { recipesApi } from '@/features/recipe/model/recipesSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
    reducer: {
        recipe: recipeReducer,
        [recipesApi.reducerPath]: recipesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(recipesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)