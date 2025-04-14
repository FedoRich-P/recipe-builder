import { useMemo } from 'react';
import { SearchInput } from '@/shared/ui/inputs/SearchInput';
import { selectSearch, selectSearchType, setSearchTerm, setSearchType } from '@/entities/recipe/model/recipeSlice';
import { StatsCounter } from '@/shared/ui/StatsCounter';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { SearchType } from '@/entities/recipe/model/types/recipe';
import { useGetFavoritesRecipesQuery, useGetRecipesQuery } from '@/shared/api/recipesApi';
import { Navigation } from '@/widgets/navigation/Navigation';
import { CustomSelect, Option } from '@/shared/ui/CustomSelect';

const searchTypeOptions: Option<SearchType>[] = [
  { value: 'name', label: 'По названию' },
  { value: 'category', label: 'По категории' },
];

export const Header = () => {
  const dispatch = useAppDispatch();
  const currentSearchTerm = useAppSelector(selectSearch);
  const currentSearchType = useAppSelector(selectSearchType);

  const { data: allRecipesData, isLoading: isLoadingRecipes } = useGetRecipesQuery();
  const { data: favoriteRecipesCount } = useGetFavoritesRecipesQuery();

  const allRecipeNames = useMemo(() => {
    if (isLoadingRecipes || !allRecipesData) return [];
    return allRecipesData.map(recipe => recipe.name);
  }, [allRecipesData, isLoadingRecipes]);

  const uniqueCategories = useMemo(() => {
    if (isLoadingRecipes || !allRecipesData) return [];
    const categories = allRecipesData
      .map(recipe => recipe.category)
      .filter((category): category is string => !!category);
    return Array.from(new Set(categories));
  }, [allRecipesData, isLoadingRecipes]);

  const currentSuggestions = useMemo(() => {
    return currentSearchType === 'category' ? uniqueCategories : allRecipeNames;
  }, [currentSearchType, uniqueCategories, allRecipeNames]);

  const handleSearchUpdate = (query: string) => {
    dispatch(setSearchTerm(query));
  };

  const handleSortChange = (value: SearchType) => {
    dispatch(setSearchType(value));
    dispatch(setSearchTerm(''));
  };

  return (
    <header
      className="sticky top-0 max-w-[1440px] mx-auto bg-white flex-wrap shadow py-4 px-6 flex items-center justify-around lg:justify-around relative z-1000">
      <div className="flex items-baseline gap-2 w-full lg:w-auto flex-wrap relative">
        <SearchInput onSearch={handleSearchUpdate}
                     initialValue={currentSearchTerm}
                     suggestions={currentSuggestions} />
        <CustomSelect options={searchTypeOptions}
                      value={currentSearchType}
                      onSelect={handleSortChange}
                      label="" />
      </div>
      <Navigation
        className="flex-wrap gap-2 lg:flex-nowrap lg:gap-3 order-last lg:order-none w-full lg:w-auto justify-center" />
      <StatsCounter totalRecipes={allRecipesData?.length}
                    favoriteRecipes={favoriteRecipesCount?.length}
                    className="hidden xl:flex order-last lg:order-none" />
    </header>
  );
};
