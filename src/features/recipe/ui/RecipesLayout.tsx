import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@app/hooks';
import { selectSearch, selectSearchType } from '@/features/recipe/model/recipeSlice';
import { Loader } from '@components/Loader';
import { RecipesList } from '@/features/recipe/ui/RecipesList';
import {
  useGetSomeRecipesQuery,
  useSearchRecipesQuery,
  useGetFavoritesRecipesQuery,
  useGetRecipesQuery,
  // SearchArgs // Опционально, если экспортирован
} from '@/features/recipe/model/recipesApi';
import { Recipe, SearchType } from '@/features/recipe/model/types/recipe'; // Убедитесь, что SearchType импортирован

const ITEMS_PER_PAGE = 8;

type RecipesLayoutProps = {
  favoriteOnly?: boolean;
};

export const RecipesLayout = ({ favoriteOnly = false }: RecipesLayoutProps) => {
  // --- Состояние компонента ---
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);
  const [showAll, setShowAll] = useState(false);

  // --- Данные из Redux ---
  const searchTerm = useAppSelector(selectSearch).trim();
  const searchType = useAppSelector(selectSearchType);

  // --- Запросы к API ---

  // 1. Запросы для общего количества (для пагинации)
  const { data: allRecipesData, isLoading: isLoadingAll } = useGetRecipesQuery(undefined, {
    skip: favoriteOnly || !!searchTerm,
  });
  const { data: allFavoritesData, isLoading: isLoadingFavs } = useGetFavoritesRecipesQuery(undefined, {
    skip: !favoriteOnly || !!searchTerm,
  });

  // 2. Формирование аргументов для поиска
  const searchArgs = useMemo(() => {
    if (searchTerm) {
      const typeToUse = searchType || 'name';
      return { term: searchTerm, type: typeToUse };
    }
    return undefined;
  }, [searchTerm, searchType]);

  // 3. Запрос Поиска
  const {
    data: searchResults,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: isSearchError, // <--- Получаем флаг ошибки поиска
  } = useSearchRecipesQuery(searchArgs, {
    skip: !searchArgs,
  });

  // 4. Запрос Пагинации
  const {
    data: pagedData,
    isLoading: pagedLoading,
    isFetching: pagedFetching,
    // isError: isPagedError, // Ошибка пагинации тоже может быть полезна
  } = useGetSomeRecipesQuery(
    {
      page: currentPage,
      limit: showAll ? 1000 : ITEMS_PER_PAGE,
      ...(favoriteOnly ? { favorite: true } : {}),
    },
    {
      skip: !!searchArgs, // Пропускаем, если активен поиск
    }
  );

  // --- Вычисляемые значения ---

  // Определяем начальную загрузку
  const initialLoading = searchArgs
    ? searchLoading
    : favoriteOnly
      ? isLoadingFavs || pagedLoading
      : isLoadingAll || pagedLoading;

  // Определяем фоновую загрузку
  const isFetchingMoreOrSearching = searchArgs ? searchFetching : pagedFetching;

  // Вычисляем общее количество
  const totalCount = useMemo(() => {
    // Если поиск активен, totalCount не используется для кнопок пагинации,
    // но для консистентности считаем по результатам.
    // Если при поиске была ошибка, вернем 0.
    if (searchArgs) return isSearchError ? 0 : searchResults?.length ?? 0;
    if (favoriteOnly) return allFavoritesData?.length ?? 0;
    return allRecipesData?.length ?? 0;
  }, [searchArgs, searchResults, isSearchError, favoriteOnly, allFavoritesData, allRecipesData]); // Добавили isSearchError

  // Определяем рецепты для текущего отображения/накопления
  const recipesFromCurrentFetch = useMemo(() => {
    if (searchArgs) {
      // Если поиск активен и произошла ошибка (API вернул 404),
      // возвращаем пустой массив, чтобы не показывать старые результаты.
      if (isSearchError) {
        console.log("[recipesFromCurrentFetch] Search error detected, returning [].");
        return [];
      }
      // Иначе возвращаем результаты поиска (или [], если данных еще нет)
      return searchResults || [];
    }
    // Если не поиск, возвращаем данные пагинации
    return pagedData?.recipes || [];
  }, [searchArgs, searchResults, isSearchError, pagedData]); // Добавили isSearchError

  // --- Эффекты ---

  // 1. Эффект сброса при смене режима
  useEffect(() => {
    console.log(`[ЭФФЕКТ СБРОСА] Запущен. favoriteOnly: ${favoriteOnly}, searchTerm: "${searchTerm}"`);
    setAccumulatedRecipes([]);
    setCurrentPage(1);
    setShowAll(false);
  }, [favoriteOnly, searchTerm]);

  // 2. Эффект накопления/замены рецептов
  useEffect(() => {
    // Пропускаем накопление, если:
    // - Нет данных для накопления (recipesFromCurrentFetch пуст)
    // - Идет фоновая загрузка
    // - Активен поиск И произошла ошибка (чтобы не накапливать пустой массив поверх старых данных до рендера)
    const shouldSkipAccumulation = recipesFromCurrentFetch.length === 0 || isFetchingMoreOrSearching || (searchArgs && isSearchError);

    if (shouldSkipAccumulation) {
      console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] Пропуск накопления.', {
        hasRecipes: recipesFromCurrentFetch.length > 0,
        isFetchingMoreOrSearching,
        isSearchError: searchArgs && isSearchError // Показываем ошибку только если поиск активен
      });
      // Дополнительная проверка: если пропуск из-за ошибки поиска, а рецепты еще есть в стейте, очистим их
      // Это может быть полезно, если useMemo еще не успел вернуть пустой массив
      if (searchArgs && isSearchError && accumulatedRecipes.length > 0) {
        console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] Очистка стейта из-за ошибки поиска.');
        setAccumulatedRecipes([]);
      }
      return; // Выходим из эффекта
    }

    console.log(`[ЭФФЕКТ НАКОПЛЕНИЯ] Выполняется. currentPage: ${currentPage}, showAll: ${showAll}, searchArgs:`, searchArgs);
    console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] recipesFromCurrentFetch:', recipesFromCurrentFetch);

    setAccumulatedRecipes(prev => {
      // Заменяем список если: активен поиск ИЛИ это первая страница ИЛИ нажали "Показать все"
      const shouldReplace = !!searchArgs || currentPage === 1 || showAll;

      const newRecipes = recipesFromCurrentFetch;
      const combined = shouldReplace ? newRecipes : [...prev, ...newRecipes];

      // Убираем дубликаты по ID
      const uniqueRecipesMap = new Map<string, Recipe>();
      combined.forEach(recipe => uniqueRecipesMap.set(recipe.id, recipe));
      const uniqueRecipes = Array.from(uniqueRecipesMap.values());

      console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] Предыдущее состояние:', prev);
      console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] Новое уникальное состояние:', uniqueRecipes);
      return uniqueRecipes;
    });
    // Добавляем isSearchError и accumulatedRecipes.length в зависимости для корректной работы очистки при ошибке
  }, [recipesFromCurrentFetch, currentPage, showAll, searchArgs, isFetchingMoreOrSearching, isSearchError, accumulatedRecipes.length]);

  // --- Логика кнопок пагинации ---
  const displayedCount = accumulatedRecipes.length;
  // Кнопки показываем только если НЕ идет поиск
  const remaining = searchArgs ? 0 : Math.max(0, totalCount - displayedCount);
  const canLoadMore = remaining > 0 && !showAll;
  const showLoadMoreButton = canLoadMore && remaining > ITEMS_PER_PAGE;
  const showShowAllButton = canLoadMore;
  const showAllCountText = showLoadMoreButton ? ` ${remaining}` : (remaining > 0 ? ` ${remaining}` : '');

  // --- Обработчики событий ---
  const handleLoadMore = () => {
    if (!isFetchingMoreOrSearching) {
      setCurrentPage(p => p + 1);
    }
  };

  const handleShowAll = () => {
    if (!isFetchingMoreOrSearching) {
      setShowAll(true);
      setCurrentPage(1);
    }
  };

  // --- Рендеринг ---
  if (initialLoading) {
    return <Loader />;
  }

  // Определяем, есть ли рецепты для показа
  const hasRecipes = accumulatedRecipes.length > 0;
  // Флаг для индикатора "Загрузка..."
  const isLoadingMore = isFetchingMoreOrSearching && !initialLoading;

  return (
    <div className="flex flex-col gap-4">
      {hasRecipes ? (
        <>
          <RecipesList recipes={accumulatedRecipes} />

          {/* --- Кнопки Пагинации --- */}
          {/* Показываем только если НЕ поиск и есть что грузить */}
          {canLoadMore && !searchArgs && (
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {showLoadMoreButton && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-opacity"
                >
                  {isLoadingMore ? 'Загрузка...' : `Показать ещё ${Math.min(ITEMS_PER_PAGE, remaining)}`}
                </button>
              )}
              {showShowAllButton && (
                <button
                  onClick={handleShowAll}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-opacity"
                >
                  Показать все{showAllCountText}
                </button>
              )}
            </div>
          )}

          {/* Индикатор загрузки */}
          {isLoadingMore && <div className="text-center mt-4 text-gray-500">Загрузка...</div>}
        </>
      ) : (
        // --- Сообщение, если рецептов нет ---
        <h1 className="text-center mt-8 text-gray-500">
          {searchTerm
            ? `Нет рецептов по запросу "${searchTerm}"` // Сообщение при активном поиске
            : favoriteOnly
              ? 'Нет избранных рецептов' // Сообщение для пустой страницы избранного
              : 'Нет доступных рецептов'} {/* Сообщение для пустой страницы "Все рецепты" */}
        </h1>
      )}
    </div>
  );
};
//
// import React, { useEffect, useMemo, useState } from 'react';
// import { GetRecipesArgs, RecipeDocument, useGetSomeRecipesQuery } from '@/features/recipe/model/firestoreApi';
// import { useAppSelector } from '@app/hooks';
// import {
//   selectSearch,
//   selectSearchType,
//   selectSort,
// } from '@/features/recipe/model/recipeSlice';
// import { Loader } from '@components/Loader';
// import { NotFound } from '@/shared/ui/NotFound/NotFound';
// import { RecipesList } from '@/features/recipe/ui/RecipesList';
//
// interface RecipesLayoutProps {
//   baseFilter?: {
//     favorite?: boolean;
//     category?: string;
//   };
// }
//
// const ITEMS_PER_PAGE = 8;
//
// export const RecipesLayout: React.FC<RecipesLayoutProps> = ({ baseFilter = {} }) => {
//   const [lastDocIds, setLastDocIds] = useState<{ [page: number]: string | null }>({ 1: null });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [accumulatedRecipes, setAccumulatedRecipes] = useState<RecipeDocument[]>([]);
//   const [showAllMode, setShowAllMode] = useState(false);
//
//   // Redux selectors
//   const searchTerm = useAppSelector(selectSearch);
//   const searchType = useAppSelector(selectSearchType);
//   const sortState = useAppSelector(selectSort);
//
//   // Query arguments
//   const queryArgs: GetRecipesArgs = useMemo(() => ({
//     limitCount: showAllMode ? undefined : ITEMS_PER_PAGE,
//     sortBy: sortState.sortType || 'name',
//     orderDirection: sortState.sortDirection || 'asc',
//     favorite: baseFilter?.favorite,
//     category: baseFilter?.category,
//     startAfterDocId: showAllMode ? null : lastDocIds[currentPage],
//     searchType: searchType,
//     searchTerm: searchTerm.trim(),
//   }), [currentPage, baseFilter, sortState, lastDocIds, searchTerm, searchType, showAllMode]);
//
//   const {
//     data: responseData,
//     isLoading,
//     error,
//     isFetching
//   } = useGetSomeRecipesQuery(queryArgs, { refetchOnMountOrArgChange: true });
//
//   const currentRecipes = responseData?.recipes || [];
//   const totalCount = responseData?.totalCount || 0;
//   const currentLastVisibleDocId = responseData?.lastVisibleDocId || null;
//
//   // Reset state on filters change
//   useEffect(() => {
//     setCurrentPage(1);
//     setAccumulatedRecipes([]);
//     setLastDocIds({ 1: null });
//     setShowAllMode(false);
//   }, [baseFilter, sortState, searchTerm, searchType]);
//
//   // Accumulate recipes
//   useEffect(() => {
//     if (!currentRecipes.length) return;
//
//     if (showAllMode) {
//       setAccumulatedRecipes([...currentRecipes]);
//     } else {
//       setAccumulatedRecipes(prev => {
//         if (currentPage === 1) return currentRecipes;
//         return [...prev, ...currentRecipes].filter((v, i, a) =>
//           a.findIndex(t => t.id === v.id) === i
//         );
//       });
//
//       if (currentLastVisibleDocId) {
//         setLastDocIds(prev => ({
//           ...prev,
//           [currentPage + 1]: currentLastVisibleDocId
//         }));
//       }
//     }
//   }, [currentRecipes, currentPage, showAllMode]);
//
//   // State flags
//   const isInitialLoad = isLoading && accumulatedRecipes.length === 0;
//   const hasError = !!error && !isLoading;
//   const hasNoResults = !isLoading && !isFetching && accumulatedRecipes.length === 0;
//
//   // Pagination calculations
//   const remaining = Math.max(0, totalCount - accumulatedRecipes.length);
//   const canLoadMore = !showAllMode && remaining > 0;
//   const shouldShowTwoButtons = remaining > ITEMS_PER_PAGE;
//
//   const handleLoadMore = () => {
//     if (lastDocIds[currentPage + 1]) {
//       setCurrentPage(prev => prev + 1);
//     }
//   };
//
//   return (
//     <div className="flex flex-col gap-4">
//       {isInitialLoad && <Loader />}
//
//       {hasNoResults && !hasError && (
//         <NotFound />
//       )}
//
//       {!hasError && accumulatedRecipes.length > 0 && (
//         <>
//           <RecipesList recipes={accumulatedRecipes} />
//
//           {canLoadMore && (
//             <div className="flex gap-3 justify-center mt-6">
//               {shouldShowTwoButtons ? (
//                 <>
//                   <button
//                     onClick={handleLoadMore}
//                     disabled={isFetching}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
//                   >
//                     {isFetching ? 'Загрузка...' : `Показать ещё ${Math.min(ITEMS_PER_PAGE, remaining)}`}
//                   </button>
//                   <button
//                     onClick={() => setShowAllMode(true)}
//                     className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                   >
//                     Показать все {remaining}
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={handleLoadMore}
//                   disabled={isFetching}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
//                 >
//                   {isFetching ? 'Загрузка...' : `Показать все ${remaining}`}
//                 </button>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };