import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@app/hooks';
import { selectSearch, selectSearchType, selectSort } from '@/features/recipe/model/recipeSlice';
import { Loader } from '@components/Loader';
import { RecipesList } from '@/features/recipe/ui/RecipesList';
import {
  useGetSomeRecipesQuery,
  useSearchRecipesQuery,
  useGetFavoritesRecipesQuery,
  useGetRecipesQuery,
} from '@/features/recipe/model/recipesApi';
import { Recipe } from '@/features/recipe/model/types/recipe';

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
    isError: isSearchError,
  } = useSearchRecipesQuery(searchArgs, {
    skip: !searchArgs,
  });

  const sortState = useAppSelector(selectSort);

  // Используем хук для запроса, передавая сортировку в качестве параметров:
  const { data: pagedData, isLoading: pagedLoading, isFetching: pagedFetching } =
    useGetSomeRecipesQuery({
      page: currentPage,
      limit: showAll ? 1000 : ITEMS_PER_PAGE,
      ...(favoriteOnly ? { favorite: true } : {}),
      sortBy: sortState.sortType,
      order: sortState.sortDirection,
    });

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
    if (searchArgs) return isSearchError ? 0 : searchResults?.length ?? 0;
    if (favoriteOnly) return allFavoritesData?.length ?? 0;
    return allRecipesData?.length ?? 0;
  }, [searchArgs, searchResults, isSearchError, favoriteOnly, allFavoritesData, allRecipesData]); // Добавили isSearchError

  // Определяем рецепты для текущего отображения/накопления
  const recipesFromCurrentFetch = useMemo(() => {
    if (searchArgs) {
      if (isSearchError) {
        console.log("[recipesFromCurrentFetch] Search error detected, returning [].");
        return [];
      }
      return searchResults || [];
    }
    return pagedData?.recipes || [];
  }, [searchArgs, searchResults, isSearchError, pagedData]); // Добавили isSearchError

  // --- Эффекты ---

  // 1. Эффект сброса при смене режима
  useEffect(() => {
    setAccumulatedRecipes([]);
    setCurrentPage(1);
    setShowAll(false);
  }, [favoriteOnly, searchTerm]);

  // 2. Эффект накопления/замены рецептов
  useEffect(() => {
    const shouldSkipAccumulation = recipesFromCurrentFetch.length === 0 || isFetchingMoreOrSearching || (searchArgs && isSearchError);

    if (shouldSkipAccumulation) {
      if (searchArgs && isSearchError && accumulatedRecipes.length > 0) {
        console.log('[ЭФФЕКТ НАКОПЛЕНИЯ] Очистка стейта из-за ошибки поиска.');
        setAccumulatedRecipes([]);
      }
      return; // Выходим из эффекта
    }

    setAccumulatedRecipes(prev => {
      const shouldReplace = !!searchArgs || currentPage === 1 || showAll;

      const newRecipes = recipesFromCurrentFetch;
      const combined = shouldReplace ? newRecipes : [...prev, ...newRecipes];

      // Убираем дубликаты по ID
      const uniqueRecipesMap = new Map<string, Recipe>();
      combined.forEach(recipe => uniqueRecipesMap.set(recipe.id, recipe));
      const uniqueRecipes = Array.from(uniqueRecipesMap.values());
      return uniqueRecipes;
    });
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

  const hasRecipes = accumulatedRecipes.length > 0;
  const isLoadingMore = isFetchingMoreOrSearching && !initialLoading;

  return (
    <div className="flex flex-col gap-4">
      {hasRecipes ? (
        <>
          <RecipesList recipes={accumulatedRecipes} />
          {canLoadMore && !searchArgs && (
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {showLoadMoreButton && (
                <button onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-opacity">
                  {isLoadingMore ? 'Загрузка...' : `Показать ещё ${Math.min(ITEMS_PER_PAGE, remaining)}`}
                </button>
              )}
              {showShowAllButton && (
                <button onClick={handleShowAll}
                  disabled={isLoadingMore}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-opacity">
                  Показать все{showAllCountText}
                </button>
              )}
            </div>
          )}

          {isLoadingMore && <div className="text-center mt-4 text-gray-500">Загрузка...</div>}
        </>
      ) : (

        <h1 className="text-center mt-8 text-gray-500">
          {searchTerm
            ? `Нет рецептов по запросу "${searchTerm}"`
            : favoriteOnly
              ? 'Нет избранных рецептов'
              : 'Нет доступных рецептов'}
        </h1>
      )}
    </div>
  );
};
