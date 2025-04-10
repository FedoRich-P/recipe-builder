import { useParams, useNavigate } from 'react-router-dom';
import { updateRecipe } from '@/features/recipe/model/recipeSlice';
import { RecipeForm, RecipeFormData } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { useAppDispatch } from '@/app/hooks';
import { useGetRecipeByIdQuery } from '@/features/recipe/model/recipesSlice';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { MobileMenuButton } from '@/shared/ui/buttons/MobileMenuButton';
import { useState } from 'react';
import { RecipeItem } from '@/features/recipe/ui/RecipeItem';
import { NotFound } from '@/shared/ui/NotFound/NotFound';
import { Loader } from '@components/Loader';

export const MainRecipePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery({ id });

  if (isLoading) return <Loader />;
  if (error || !recipe) return <NotFound />;

  const initialValues: RecipeFormData = {
    name: recipe.name,
    ingredients: recipe.ingredients.map((ing) => ({ value: ing })),
    steps: recipe.steps.join('\n'),
  };

  const handleSubmit = (data: RecipeFormData) => {
    const updatedRecipe = {
      ...recipe,
      name: data.name,
      ingredients: data.ingredients.map((ing) => ing.value),
      steps: data.steps.split('\n').map((step) => step.trim()),
    };
    dispatch(updateRecipe(updatedRecipe));
    setShowForm(false);
  };

  return (
    <div className="relative min-h-screen">
      {recipe.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img src={recipe.imageUrl}
               alt={recipe.name}
               className="w-full h-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 min-h-screen bg-black/30 backdrop-blur-sm flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          <button onClick={() => navigate(-1)}
                  className="flex items-center text-white hover:text-gray-200 transition-colors mb-6">
            <ArrowLeftIcon className="w-6 h-6 mr-2" />
            <span className="text-lg">Назад</span>
          </button>

          <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-2xl bg-transparent rounded-xl shadow-2xl overflow-hidden">
              <RecipeItem recipe={recipe} isFavorite={recipe.favorite} className={'min-h-[50vh] block'} />
              <div className="bg-transparent mt-5">
                {!showForm ? (
                  <div className="flex flex-col items-center space-y-4">
                    <button onClick={() => setShowForm(true)}
                            className="w-full max-w-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      Редактировать рецепт
                    </button>
                    {!isOpen && <MobileMenuButton className={'bg-transparent'} onClick={() => setIsOpen(true)} />
                    }
                  </div>
                ) : (
                  <RecipeForm key={id}
                              initialValues={initialValues}
                              onSubmit={handleSubmit}
                              onCancel={() => setShowForm(false)}
                              title="Редактировать рецепт"
                              buttonText="Сохранить изменения"
                              className={'bg-gradient-to-r from-white/80 '} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};