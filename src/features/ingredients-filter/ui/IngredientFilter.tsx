import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAllRecipes, selectSelectedIngredients, setSelectedIngredients } from '@/features/recipe/model/recipeSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { IngredientList } from '@/shared/ui/ingregients/IngredientList';
import { SelectedIngredients } from '@/shared/ui/ingregients/SelectedIngredients';

export const IngredientFilter = () => {
  const dispatch = useAppDispatch();
  const allRecipes = useAppSelector(selectAllRecipes);
  const selected = useAppSelector(selectSelectedIngredients);
  const [isOpen, setIsOpen] = useState(true);

  const orderedIngredients = useMemo(() => {
    if (!allRecipes?.length) return [];

    const all = allRecipes.flatMap((r) => r.ingredients);
    const unique = Array.from(new Set(all));

    return [
      ...selected.filter(ing => unique.includes(ing)),
      ...unique.filter(ing => !selected.includes(ing)),
    ].sort((a, b) => {
      if (!selected.includes(a) && !selected.includes(b)) {
        return a.localeCompare(b);
      }
      return 0;
    });
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
        <><IngredientList ingredients={orderedIngredients}
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