import { RecipesLayout } from '@/features/recipe/ui/RecipesLayout';

export const RecipesPage = () => {
  return (
    <RecipesLayout />
  );
};



// import { useEffect, useState } from 'react';
// import { Recipe } from '@/features/recipe/model/types/recipe';
// import { useGetRecipesQuery, useGetSomeRecipesQuery } from '@/features/recipe/model/recipesApi';
// import { Loader } from '@components/Loader';
// import { NotFound } from '@/shared/ui/NotFound/NotFound';
// import { RecipesList } from '@/features/recipe/ui/RecipesList';
//
// export const RecipesPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAll, setShowAll] = useState(false);
//   const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);
//   const itemsPerPage = 8;
//
//   const { data: allRecipesDB } = useGetRecipesQuery();
//   const { data, isLoading, error, isFetching } = useGetSomeRecipesQuery({
//     page: currentPage,
//     limit: showAll ? 1000 : itemsPerPage,
//   });
//
//   useEffect(() => {
//     if (data && Array.isArray(data)) {
//       setAccumulatedRecipes((prev) => {
//         const combined = currentPage === 1 || showAll ? data : [...prev, ...data];
//         return Array.from(new Set(combined.map(a => a.id)))
//           .map(id => combined.find(a => a.id === id));
//       });
//     }
//   }, [data, showAll, currentPage]);
//
//   if (isLoading && currentPage === 1) return <Loader />;
//   if (error && !data) return <NotFound />;
//
//   const totalRecipesCount = allRecipesDB ? allRecipesDB.length : 0;
//   const remaining = totalRecipesCount - accumulatedRecipes.length;
//
//   // Логика отображения кнопок
//   const canLoadMore = !showAll && remaining > itemsPerPage;
//   const canShowAll = !showAll && remaining > 0;
//
//   // Кнопка "Показать еще" показывается, если есть достаточно рецептов для загрузки.
//   // Кнопка "Показать все" показывается, если есть оставшиеся рецепты.
//   const showBothButtons = remaining > itemsPerPage;
//
//   return (
//     <div className="flex flex-col gap-4">
//       <RecipesList recipes={accumulatedRecipes} isMainPage={false} />
//       <div className="flex gap-3 justify-center mt-6">
//         {/* Кнопка "Показать еще", если есть еще рецепты и их достаточно для загрузки */}
//         {showBothButtons && canLoadMore && (
//           <button onClick={() => setCurrentPage((p) => p + 1)}
//                   disabled={isFetching}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
//             {isFetching ? 'Загрузка...' : `Показать еще - ${itemsPerPage}`}
//           </button>
//         )}
//         {/* Кнопка "Показать все", если есть оставшиеся рецепты */}
//         {showBothButtons && canShowAll && (
//           <button onClick={() => {
//             setShowAll(true);
//             setCurrentPage(1); // Можно оставить currentPage, если нужно
//           }}
//                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//             Показать оставшиеся - {remaining}
//           </button>
//         )}
//         {/* Кнопка "Показать все", если оставшихся рецептов меньше или равно itemsPerPage */}
//         {!showBothButtons && canShowAll && (
//           <button onClick={() => {
//             setShowAll(true);
//             setCurrentPage(1); // Можно оставить currentPage, если нужно
//           }}
//                   className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//             Показать все
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
