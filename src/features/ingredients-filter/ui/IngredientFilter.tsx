import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectSelectedIngredients, setSelectedIngredients } from '@/features/recipe/model/recipeSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { IngredientList } from '@/shared/ui/ingregients/IngredientList';
import { SelectedIngredients } from '@/shared/ui/ingregients/SelectedIngredients';
import { useGetSomeRecipesQuery } from '@/features/recipe/model/recipesApi';
import { useNavigate } from 'react-router-dom';
import { getOrderedIngredients } from '@/shared/lib/utils/getOrderedIngredients';

export const IngredientFilter = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedIngredients);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSomeRecipesQuery({
    page: 1,
    limit: 100,
  });

  const allRecipes = data?.recipes || [];

  const allIngredients = useMemo(() => {
    return getOrderedIngredients(allRecipes, selected);
  }, [allRecipes, selected]);

  const filteredRecipes = useMemo(() => {
    if (selected.length === 0) return [];
    return allRecipes.filter((recipe) =>
      selected.every((ingredient) =>
        recipe.ingredients.some((ing) => ing.name === ingredient),
      ),
    );
  }, [allRecipes, selected]);

  const toggleIngredient = (ingredient: string) => {
    const newSelected = selected.includes(ingredient)
      ? selected.filter((i) => i !== ingredient)
      : [...selected, ingredient];
    dispatch(setSelectedIngredients(newSelected));
  };

  const clearAll = () => dispatch(setSelectedIngredients([]));

  return (
    <div className="pb-5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-gray-300 after:via-gray-400 after:to-gray-300 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Фильтр по ингредиентам</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700"
                aria-label={isOpen ? 'Свернуть' : 'Развернуть'}>
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <>
          <SelectedIngredients ingredients={selected} onRemove={toggleIngredient} onClear={clearAll} />

          <IngredientList ingredients={allIngredients}
                          selected={selected}
                          onToggle={toggleIngredient} />
        </>
      )}

      <div className="mt-4 max-h-[200px] overflow-y-auto space-y-2">
        {isLoading && <p>Загрузка...</p>}
        {isError && <p>Произошла ошибка при загрузке рецептов</p>}
        {selected.length === 0 ? (
          <p className="text-gray-500 italic">Выберите хотя бы один ингредиент для фильтрации.</p>
        ) : (
          filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border border-orange-400 bg-orange-50 p-2 rounded-md cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <h4 className="text-sm font-semibold text-orange-700">{recipe.name}</h4>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Нет рецептов, соответствующих выбранным ингредиентам.</p>
          )
        )}
      </div>
    </div>
  );
};