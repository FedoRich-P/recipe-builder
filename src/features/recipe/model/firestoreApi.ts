// // firestoreApi.ts
// import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
// import {
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   getDocs,
//   getDoc,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
//   getCountFromServer,
//   QueryConstraint,
//   FirestoreError,
//   serverTimestamp
// } from 'firebase/firestore';
//
// import { Recipe, SearchType } from './types/recipe';
// import { db } from '@/firebase/firebase';
//
// export type GetRecipesArgs = {
//   limitCount?: number;
//   sortBy?: string;
//   orderDirection?: 'asc' | 'desc';
//   favorite?: boolean;
//   category?: string;
//   startAfterDocId?: string | null;
//   searchType?: SearchType;
//   searchTerm?: string;
// };
//
// export type RecipeDocument = Recipe & { id: string };
//
// export type GetRecipesResponse = {
//   recipes: RecipeDocument[];
//   totalCount: number;
//   lastVisibleDocId: string | null;
// };
//
// export type RtkQueryError = { status: number | 'CUSTOM_ERROR'; data?: any; error?: string; };
//
// export const firestoreApi = createApi({
//   reducerPath: 'firestoreApi',
//   baseQuery: fakeBaseQuery<RtkQueryError>(),
//   tagTypes: ['Recipe', 'RecipeList'],
//   endpoints: (build) => ({
//     getSomeRecipes: build.query<GetRecipesResponse, GetRecipesArgs>({
//       async queryFn(args, { signal }) {
//         const {
//           limitCount,
//           sortBy = 'name',
//           orderDirection = 'asc',
//           favorite,
//           category,
//           startAfterDocId,
//           searchType,
//           searchTerm,
//         } = args;
//
//         // Отладочный лог – для проверки входных параметров.
//         console.log('getSomeRecipes args:', args);
//
//         try {
//           if (signal.aborted) throw new Error("Query aborted");
//
//           const recipesCollection = collection(db, 'recipes');
//           let dataConstraints: QueryConstraint[] = [];
//           let countConstraints: QueryConstraint[] = [];
//           let finalSortBy = sortBy;
//           let finalOrderDirection = orderDirection;
//
//           // Фильтры favorite и category
//           if (favorite !== undefined) {
//             const constraint = where('favorite', '==', favorite);
//             dataConstraints.push(constraint);
//             countConstraints.push(constraint);
//           }
//           if (category) {
//             const constraint = where('category', '==', category.toLowerCase());
//             dataConstraints.push(constraint);
//             countConstraints.push(constraint);
//           }
//
//           // Обработка поиска (добавляем условия только если searchTerm непустой)
//           if (searchType && searchTerm && searchTerm.trim().length > 0) {
//             // Приводим запрос к нижнему регистру; убедитесь, что данные в Firestore хранятся в нижнем регистре
//             const normalizedSearchTerm = searchTerm.trim().toLowerCase();
//             console.log('normalizedSearchTerm:', normalizedSearchTerm);
//             switch (searchType) {
//               case 'name': {
//                 const namePrefixStart = where('name', '>=', normalizedSearchTerm);
//                 const namePrefixEnd = where('name', '<=', normalizedSearchTerm + '\uf8ff');
//                 dataConstraints.push(namePrefixStart, namePrefixEnd);
//                 countConstraints.push(namePrefixStart, namePrefixEnd);
//                 finalSortBy = 'name';
//                 break;
//               }
//               case 'category': {
//                 const categoryConstraint = where('category', '==', normalizedSearchTerm);
//                 dataConstraints.push(categoryConstraint);
//                 countConstraints.push(categoryConstraint);
//                 break;
//               }
//               // Если понадобится поиск по другим полям (например, ingredient), добавьте соответствующий case.
//             }
//           }
//
//           // Подсчёт общего количества документов, удовлетворяющих фильтрам (без сортировки и лимита)
//           const countQuery = query(recipesCollection, ...countConstraints);
//           const countSnapshot = await getCountFromServer(countQuery);
//           if (signal.aborted) throw new Error("Query aborted");
//           const totalCount = countSnapshot.data().count;
//           console.log('Total count:', totalCount);
//
//           // Добавляем сортировку
//           dataConstraints.push(orderBy(finalSortBy, finalOrderDirection));
//
//           // Пагинация – если указан startAfterDocId, пытаемся получить документ и добавить условие startAfter
//           if (startAfterDocId && limitCount) {
//             const startAfterSnapshot = await getDoc(doc(db, 'recipes', startAfterDocId));
//             if (signal.aborted) throw new Error("Query aborted");
//             if (startAfterSnapshot.exists()) {
//               dataConstraints.push(startAfter(startAfterSnapshot));
//             } else {
//               console.warn("StartAfter doc not found:", startAfterDocId);
//             }
//           }
//           // Применяем лимит, если он указан
//           if (limitCount) {
//             dataConstraints.push(limit(limitCount));
//           }
//
//           const dataQuery = query(recipesCollection, ...dataConstraints);
//           const querySnapshot = await getDocs(dataQuery);
//           if (signal.aborted) throw new Error("Query aborted");
//
//           const recipes = querySnapshot.docs.map((docSnap) => ({
//             id: docSnap.id,
//             ...(docSnap.data() as Omit<Recipe, 'id'>),
//           })) as RecipeDocument[];
//           const lastDocInPage = querySnapshot.docs[querySnapshot.docs.length - 1];
//           const newLastVisibleDocId = limitCount && lastDocInPage ? lastDocInPage.id : null;
//
//           return { data: { recipes, totalCount, lastVisibleDocId: newLastVisibleDocId } };
//
//         } catch (err: unknown) {
//           if ((err as Error).message === "Query aborted") {
//             return { error: { status: 'CUSTOM_ERROR', error: 'Query aborted by client' } };
//           }
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (getSomeRecipes):", error.code, error.message, error);
//           if (error.code === 'failed-precondition') {
//             return { error: { status: 'CUSTOM_ERROR', error: `Missing Firestore index. Check browser console for details.`, data: { code: error.code } } };
//           }
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}`, data: { code: error.code } } };
//         }
//       },
//       providesTags: (result, error, args) => {
//         const listId = `LIST-${JSON.stringify(args)}`;
//         if (result?.data?.recipes) {
//           return [
//             ...result.data.recipes.map(({ id }) => ({ type: 'Recipe' as const, id })),
//             { type: 'RecipeList', id: listId },
//           ];
//         }
//         return [{ type: 'RecipeList', id: listId }];
//       },
//     }),
//
//     // --- Получение одного рецепта ---
//     getRecipeById: build.query<RecipeDocument, string>({
//       async queryFn(id, { signal }) {
//         try {
//           if (!id) return { error: { status: 400, data: 'Recipe ID is required' } };
//           if (signal.aborted) throw new Error("Query aborted");
//           const docRef = doc(db, 'recipes', id);
//           const docSnap = await getDoc(docRef);
//           if (signal.aborted) throw new Error("Query aborted");
//           if (docSnap.exists()) {
//             return { data: { id: docSnap.id, ...docSnap.data() } as RecipeDocument };
//           } else {
//             return { error: { status: 404, data: 'Recipe not found' } };
//           }
//         } catch (err: unknown) {
//           if ((err as Error).message === "Query aborted") {
//             return { error: { status: 'CUSTOM_ERROR', error: 'Query aborted by client' } };
//           }
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (getRecipeById):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       providesTags: (result, error, id) => (result ? [{ type: 'Recipe', id }] : []),
//     }),
//
//     // --- Добавление рецепта ---
//     addRecipe: build.mutation<RecipeDocument, Omit<Recipe, 'id'>>({
//       async queryFn(recipeData) {
//         try {
//           const dataToAdd = { ...recipeData, createdAt: serverTimestamp() };
//           const docRef = await addDoc(collection(db, "recipes"), dataToAdd);
//           return { data: { id: docRef.id, ...recipeData, createdAt: new Date() } as RecipeDocument };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (addRecipe):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       invalidatesTags: [{ type: 'RecipeList' }],
//     }),
//
//     // --- Обновление рецепта ---
//     updateRecipe: build.mutation<void, { id: string; changes: Partial<Omit<Recipe, 'id'>> }>({
//       async queryFn({ id, changes }) {
//         try {
//           if (!id) return { error: { status: 400, data: 'Recipe ID is required' } };
//           const docRef = doc(db, "recipes", id);
//           const dataToUpdate = { ...changes, updatedAt: serverTimestamp() };
//           await updateDoc(docRef, dataToUpdate);
//           return { data: undefined };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (updateRecipe):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       invalidatesTags: (result, error, { id }) => [{ type: 'Recipe', id }, { type: 'RecipeList' }],
//     }),
//
//     // --- Удаление рецепта ---
//     deleteRecipe: build.mutation<void, string>({
//       async queryFn(id) {
//         try {
//           if (!id) return { error: { status: 400, data: 'Recipe ID is required' } };
//           const docRef = doc(db, "recipes", id);
//           await deleteDoc(docRef);
//           return { data: undefined };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (deleteRecipe):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       invalidatesTags: (result, error, id) => [{ type: 'Recipe', id }, { type: 'RecipeList' }],
//     }),
//
//     // --- Переключение избранного ---
//     toggleFavorite: build.mutation<void, { id: string; currentStatus: boolean }>({
//       async queryFn({ id, currentStatus }) {
//         try {
//           if (!id) return { error: { status: 400, data: 'Recipe ID is required' } };
//           const docRef = doc(db, "recipes", id);
//           await updateDoc(docRef, { favorite: !currentStatus });
//           return { data: undefined };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (toggleFavorite):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       invalidatesTags: (result, error, { id }) => [{ type: 'Recipe', id }, { type: 'RecipeList' }],
//     }),
//
//     // --- Получение общего количества рецептов ---
//     getTotalRecipeCount: build.query<number, void>({
//       async queryFn() {
//         try {
//           const recipesCollection = collection(db, 'recipes');
//           const countSnapshot = await getCountFromServer(recipesCollection);
//           const totalCount = countSnapshot.data().count;
//           return { data: totalCount };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           console.error("Firestore API Error (getTotalRecipeCount):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       providesTags: [{ type: 'RecipeList', id: 'TOTAL_COUNT' }],
//     }),
//
//     // --- Получение количества избранных рецептов ---
//     getFavoriteRecipeCount: build.query<number, void>({
//       async queryFn() {
//         try {
//           const recipesCollection = collection(db, 'recipes');
//           const q = query(recipesCollection, where('favorite', '==', true));
//           const countSnapshot = await getCountFromServer(q);
//           const favoriteCount = countSnapshot.data().count;
//           return { data: favoriteCount };
//         } catch (err: unknown) {
//           const error = err as FirestoreError;
//           if (error.code === 'failed-precondition') {
//             console.error(`Firestore Error (${error.code}): ${error.message}. Вероятно, отсутствует индекс для поля 'favorite'.`);
//             return { error: { status: 'CUSTOM_ERROR', error: `Missing index for 'favorite' field. Please create it in Firebase console.`, data: { code: error.code } } };
//           }
//           console.error("Firestore API Error (getFavoriteRecipeCount):", error.code, error.message);
//           return { error: { status: 'CUSTOM_ERROR', error: `Firestore Error (${error.code}): ${error.message}` } };
//         }
//       },
//       providesTags: [{ type: 'RecipeList', id: 'FAVORITE_COUNT' }],
//     }),
//   }),
// });
//
// export const {
//   useGetSomeRecipesQuery,
//   useGetRecipeByIdQuery,
//   useAddRecipeMutation,
//   useUpdateRecipeMutation,
//   useDeleteRecipeMutation,
//   useToggleFavoriteMutation,
//   useGetTotalRecipeCountQuery,
//   useGetFavoriteRecipeCountQuery
// } = firestoreApi;
