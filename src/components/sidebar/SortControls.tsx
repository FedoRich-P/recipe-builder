import { useDispatch, useSelector } from 'react-redux';
import { setSortOption } from '@/features/recipe/recipeSlice';
import { selectSortOption } from '@/features/recipe/recipeSlice';
import { SortOption } from '@/shared/types/recipe';
import { SortButton } from './SortButton';

interface SortControlsProps {
  className?: string;
}

export const SortControls = ({ className }: SortControlsProps) => {
  const dispatch = useDispatch();
  const sortOption = useSelector(selectSortOption);

  const handleSortChange = (option: 'name' | 'ingredients') => {
    let newSort: SortOption;

    if (option === 'name') {
      newSort = sortOption === 'name-asc' ? 'name-desc' : 'name-asc';
    } else {
      newSort = sortOption === 'ingredients-asc' ? 'ingredients-desc' : 'ingredients-asc';
    }

    dispatch(setSortOption(newSort));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-medium text-gray-700">Sort Recipes</h3>
      <div className="flex flex-wrap gap-2">
        <SortButton active={sortOption.startsWith('name')}
                    sortKey="name"
                    currentSort={sortOption}
                    onClick={() => handleSortChange('name')}>
          Name
        </SortButton>

        <SortButton active={sortOption.startsWith('ingredients')}
                    sortKey="ingredients"
                    currentSort={sortOption}
                    onClick={() => handleSortChange('ingredients')}>
          Ingredients
        </SortButton>
      </div>
    </div>
  );
};