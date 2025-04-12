import React, { useMemo } from 'react'; // Добавляем useMemo
import { SearchInput } from '@/shared/ui/inputs/SearchInput';
import { selectSearch, selectSearchType, setSearchTerm, setSearchType } from '@/features/recipe/model/recipeSlice';
import { StatsCounter } from '@/shared/ui/StatsCounter';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { SearchType } from '@/features/recipe/model/types/recipe';
import { useGetFavoritesRecipesQuery, useGetRecipesQuery } from '@/features/recipe/model/recipesApi';
import { Navigation } from '@/widgets/navigation/Navigation'; // Предполагаем, что Navigation импортирован

export const Header = () => {
  const dispatch = useAppDispatch();
  const currentSearchTerm = useAppSelector(selectSearch);
  const currentSearchType = useAppSelector(selectSearchType); // 'name' | 'category'

  // Загружаем все рецепты (для счетчиков И для подсказок)
  const { data: allRecipesData, isLoading: isLoadingRecipes } = useGetRecipesQuery();
  // Загружаем избранные (только для счетчика)
  const { data: favoriteRecipesCount } = useGetFavoritesRecipesQuery();

  // --- Подготовка данных для подсказок ---
  const allRecipeNames = useMemo(() => {
    // Если данные еще грузятся или их нет, возвращаем пустой массив
    if (isLoadingRecipes || !allRecipesData) return [];
    // Извлекаем все имена
    return allRecipesData.map(recipe => recipe.name);
  }, [allRecipesData, isLoadingRecipes]);

  const uniqueCategories = useMemo(() => {
    if (isLoadingRecipes || !allRecipesData) return [];
    // Извлекаем все категории, убираем пустые/null, оставляем уникальные
    const categories = allRecipesData
      .map(recipe => recipe.category)
      .filter((category): category is string => !!category); // Тип-гвард для удаления null/undefined и пустых строк
    return Array.from(new Set(categories)); // Оставляем только уникальные
  }, [allRecipesData, isLoadingRecipes]);

  // Определяем, какой массив подсказок использовать сейчас
  const currentSuggestions = useMemo(() => {
    return currentSearchType === 'category' ? uniqueCategories : allRecipeNames;
  }, [currentSearchType, uniqueCategories, allRecipeNames]);
  // -----------------------------------------

  const handleSearchUpdate = (query: string) => {
    dispatch(setSearchTerm(query));
  };

  const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSearchType(event.target.value as SearchType));
    // Опционально: очищать поле поиска при смене типа?
    // dispatch(setSearchTerm(''));
  };

  return (
    <header className="bg-white flex-wrap shadow py-4 px-6 flex items-center justify-between lg:justify-around lg:flex-nowrap gap-4 relative z-100"> {/* Добавляем z-index */}
      <div className="flex items-center gap-2 w-full lg:w-auto flex-grow lg:flex-grow-0 relative"> {/* Добавляем relative для позиционирования подсказок */}
        <SearchInput
          onSearch={handleSearchUpdate}
          initialValue={currentSearchTerm}
          className="flex-grow"
          // Передаем актуальные подсказки в компонент
          suggestions={currentSuggestions}
          // Опционально: передать тип для информации внутри SearchInput
          // suggestionType={currentSearchType}
        />
        <select
          value={currentSearchType}
          onChange={handleSearchTypeChange}
          className="h-[42px] border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-2 text-sm"
          aria-label="Тип поиска"
        >
          <option value="name">По названию</option>
          <option value="category">По категории</option>
        </select>
      </div>

      <Navigation className="flex-wrap gap-2 lg:flex-nowrap lg:gap-3 order-last lg:order-none w-full lg:w-auto justify-center" />

      <StatsCounter
        totalRecipes={allRecipesData?.length} // Используем данные из allRecipesData
        favoriteRecipes={favoriteRecipesCount?.length}
        className="hidden xl:flex order-last lg:order-none"
      />
    </header>
  );
};
