import { useEffect, useState } from 'react';
import { Recipe } from '@/features/recipe/model/types/recipe';
import { Loader } from '@components/Loader';
import { NotFound } from '@/shared/ui/NotFound/NotFound';
import { RecipesList } from '@/features/recipe/ui/RecipesList';

interface RecipePaginationProps {
  fetchData: (page: number, limit: number) => any; // Функция для получения данных
  totalRecipesCount: number; // Общее количество рецептов
  itemsPerPage: number; // Количество элементов на странице
  isFavoritesPage: boolean; // Если это страница избранных
}

export const RecipePagination = ({
                                   fetchData,
                                   totalRecipesCount,
                                   itemsPerPage,
                                   isFavoritesPage
                                 }: RecipePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);

  const { data, isLoading, error, isFetching } = fetchData(currentPage, showAll ? 1000 : itemsPerPage);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAccumulatedRecipes((prev) => {
        const combined = currentPage === 1 || showAll ? data : [...prev, ...data];
        return Array.from(new Set(combined.map(a => a.id)))
          .map(id => combined.find(a => a.id === id));
      });
    }
  }, [data, showAll, currentPage]);

  if (isLoading && currentPage === 1) return <Loader />;
  if (error && !data) return <NotFound />;

  const remaining = totalRecipesCount - accumulatedRecipes.length;
  const canLoadMore = !showAll && remaining > itemsPerPage;
  const canShowAll = !showAll && remaining > 0;

  return (
    <div className="flex flex-col gap-4">
      <RecipesList recipes={accumulatedRecipes} isMainPage={!isFavoritesPage} />
      <div className="flex gap-3 justify-center mt-6">
        {canLoadMore && (
          <button onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={isFetching}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
            {isFetching ? 'Загрузка...' : `Показать еще - ${itemsPerPage}`}
          </button>
        )}
        {canShowAll && !showAll && remaining <= itemsPerPage && (
          <button onClick={() => {
            setShowAll(true);
            setCurrentPage(1);
          }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Показать все
          </button>
        )}
        {!canLoadMore && canShowAll && (
          <button onClick={() => {
            setShowAll(true);
            setCurrentPage(1);
          }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Показать оставшиеся - {remaining}
          </button>
        )}
      </div>
    </div>
  );
};
