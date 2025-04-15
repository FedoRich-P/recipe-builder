import { SearchInput } from '@/shared/ui/inputs/SearchInput';
import { CustomSelect, Option } from '@/shared/ui/CustomSelect';
import { SearchType } from '@/entities/recipe/model/types/recipe';
import { useSearchBar } from '../model/useSearchBar';

const searchTypeOptions: Option<SearchType>[] = [
  { value: 'name', label: 'По названию' },
  { value: 'category', label: 'По категории' },
];

export const SearchBar = () => {
  const {
    currentSearchTerm,
    currentSearchType,
    currentSuggestions,
    handleSearchUpdate,
    handleSortChange
  } = useSearchBar();

  return (
    <div className="flex items-baseline gap-2 w-full lg:w-auto flex-wrap relative">
      <SearchInput
        onSearch={handleSearchUpdate}
        initialValue={currentSearchTerm}
        suggestions={currentSuggestions} />
      <CustomSelect
        options={searchTypeOptions}
        value={currentSearchType}
        onSelect={handleSortChange}
        label="" />
    </div>
  );
};
