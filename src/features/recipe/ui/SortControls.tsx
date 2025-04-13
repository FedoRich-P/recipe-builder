import React, { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectSort, setSort } from '@/features/recipe/model/recipeSlice';
import { SortOption } from '@/features/recipe/model/types/recipe';
import { CustomSelect, Option } from '@components/CustomSelect';
import { SortButton } from '@/shared/ui/buttons/SortButton';

type SortControlsProps = {
  className?: string;
};

const sortOptions: Option<SortOption['sortType']>[] = [
  { value: 'name', label: 'названию' },
  { value: 'cookingTime', label: 'времени готовки' },
  { value: 'calories', label: 'калориям' },
  { value: 'favorite', label: 'избранным' },
];

export const SortControls = ({ className }: SortControlsProps) => {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(selectSort);

  const [selectedOption, setSelectedOption] = useState<SortOption['sortType']>(
    currentSort.sortType || 'name',
  );

  const handleCustomSelect = (option: SortOption['sortType']) => {
    setSelectedOption(option);
  };

  const handleSortToggle = () => {
    let newDirection: 'asc' | 'desc';
    if (selectedOption === currentSort.sortType) {
      newDirection = currentSort.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = 'asc';
    }
    const newSort = { sortType: selectedOption, sortDirection: newDirection };
    console.log('Устанавливаем сортировку:', newSort);
    dispatch(setSort(newSort));
  };

  return (
    <div className={`mb-4 gap-2 ${className}`}>
      <SortButton active={true}
                  sortKey={selectedOption}
                  className={'min-w-[45%] h-[40px] bg-blue-500 text-base hover:bg-blue-600 transition-colors'}
                  currentSort={`${currentSort.sortType}-${currentSort.sortDirection}`}
                  onClick={handleSortToggle}>
        Сортировать по :
      </SortButton>
      <CustomSelect className={'min-w=[40%]'}
                    options={sortOptions}
                    value={selectedOption}
                    onSelect={handleCustomSelect} />
    </div>
  );
};
