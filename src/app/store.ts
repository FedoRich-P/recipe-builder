import { configureStore } from '@reduxjs/toolkit'
import {recipeReducer} from "@/entities/recipe/model/recipeSlice";
import { setupListeners } from '@reduxjs/toolkit/query';
import { recipesApi } from '@/entities/recipe/api/recipesApi';

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