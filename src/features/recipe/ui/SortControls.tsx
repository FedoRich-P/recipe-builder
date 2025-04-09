import { useDispatch, useSelector } from 'react-redux';
import { setSortOption } from '@/features/recipe/model/recipeSlice';
import { selectSortOption } from '@/features/recipe/model/recipeSlice';
import { SortOption } from '@/features/recipe/model/types/recipe';
import { SortButton } from '@/shared/ui/buttons/SortButton';

type SortControlsProps = {
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
    <div className={`flex gap-2 ${className}`}>
      <SortButton active={sortOption.startsWith('name')}
                  sortKey="name"
                  currentSort={sortOption}
                  onClick={() => handleSortChange('name')}>
        Сортировать по названию
      </SortButton>

      <SortButton active={sortOption.startsWith('ingredients')}
                  sortKey="ingredients"
                  currentSort={sortOption}
                  onClick={() => handleSortChange('ingredients')}>
        Сортировать по ингредиентам
      </SortButton>
    </div>
  );
};