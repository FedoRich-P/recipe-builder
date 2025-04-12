import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {  selectSelectedIngredients, setSelectedIngredients } from '@/features/recipe/model/recipeSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { IngredientList } from '@/shared/ui/ingregients/IngredientList';
import { SelectedIngredients } from '@/shared/ui/ingregients/SelectedIngredients';
import { useGetRecipesQuery } from '@/features/recipe/model/recipesApi';
import { getOrderedIngredients } from '@/shared/lib/utils/getOrderedIngredients';

export const IngredientFilter = () => {

  const [isOpen, setIsOpen] = useState(true);

  const { data: allRecipes } = useGetRecipesQuery();

  const dispatch = useAppDispatch();

  const selected = useAppSelector(selectSelectedIngredients);

  const orderedIngredients = useMemo(() => {
    return getOrderedIngredients(allRecipes, selected);
  }, [allRecipes, selected]);

  const toggleIngredient = (ingredient: string) => {
    const newSelected = selected.includes(ingredient)
      ? selected.filter((i) => i !== ingredient)
      : [...selected, ingredient];
    dispatch(setSelectedIngredients(newSelected));
  };

  const clearAll = () => dispatch(setSelectedIngredients([]));

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Фильтр по ингредиентам</h3>
        <button onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={isOpen ? 'Свернуть' : 'Развернуть'}>
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <>
          <IngredientList ingredients={orderedIngredients}
                          selected={selected}
                          onToggle={toggleIngredient} />
          <SelectedIngredients ingredients={selected}
                               onRemove={toggleIngredient}
                               onClear={clearAll} />
        </>
      )}
    </div>
  );
};


// const orderedIngredients = useMemo(() => {
//   if (!allRecipes?.length) return [];
//
//   const all = allRecipes.flatMap((r) => r.ingredients);
//
//   const unique = Array.from(new Set(all.map(ingredient => ingredient.name)));
//
//   return [
//     ...selected.filter(ing => unique.includes(ing)),
//     ...unique.filter(ing => !selected.includes(ing)),
//   ].sort((a, b) => {
//     if (!selected.includes(a) && !selected.includes(b)) {
//       return a.localeCompare(b);
//     }
//     return 0;
//   });
// }, [allRecipes, selected]);