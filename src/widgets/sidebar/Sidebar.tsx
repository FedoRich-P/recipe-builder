import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SearchInput } from '@/shared/ui/inputs/SearchInput';
import { RecipeForm } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { useAppDispatch } from '@app/hooks';
import { setSearchTerm } from '@/features/recipe/model/recipeSlice';
import { IngredientFilter } from '@/features/ingredients-filter/ui/IngredientFilter';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleSubmit = () => {
  //   // const newRecipe = {
  //   //   id: Date.now().toString(),
  //   //   name: data.name,
  //   //   ingredients: data.ingredients.map(ing => ing.value),
  //   //   steps: data.steps.split('\n'),
  //   //   favorite: false,
  //   // };
  //   // dispatch(addRecipe(newRecipe));
  };

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen max-w-130 bg-white shadow-lg z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 h-full flex flex-col">
          <button onClick={() => setIsOpen(false)}
                  className="self-end lg:hidden p-2 mb-2 rounded-lg hover:bg-gray-100 transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Управление рецептами</h2>
          <SearchInput onSearch={handleSearch} className="mb-4" />
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-4 h-4" />
              Добавить рецепт
            </button>
          ) : (
            <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
              <RecipeForm onSubmit={handleSubmit} buttonText={'Добавить рецепт'} onCancel={() => setShowForm(false)} />
            </div>
          )}
          <IngredientFilter />
        </div>
      </aside>
    </>
  );
};