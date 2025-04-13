import { RecipeItem } from '@/features/recipe/ui/RecipeItem';
import { PlusIcon } from '@heroicons/react/24/outline';
// import { MobileMenuButton } from '@/shared/ui/buttons/MobileMenuButton';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRecipeByIdQuery, useUpdateRecipeMutation } from '@/features/recipe/model/recipesApi';
import { Loader } from '@components/Loader';
import { NotFound } from '@/shared/ui/NotFound/NotFound';
import { RecipeFormData } from '@/features/recipe/model/types/recipe';
import { RecipeForm } from '@/shared/ui/forms/RecipeForm/RecipeForm';

export const MainRecipePage = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery(id);
  const [updateRecipe] = useUpdateRecipeMutation();

  if (isLoading) return <Loader />;
  if (error || !recipe) return <NotFound />;

  const initialValues = {
    name: recipe.name,
    ingredients: recipe.ingredients,
    stepsString: recipe.steps.join('\n'),
  };

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await updateRecipe({
        id: recipe.id,
        data: {
          name: data.name,
          ingredients: data.ingredients,
          steps: data.stepsString.split('\n').map((step) => step.trim()),
        },
      }).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Ошибка при обновлении рецепта:', err);
    }
  };

  return (
    <div className="relative min-h-screen">
      {recipe.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover brightness-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white/10" />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col backdrop-blur-md bg-black/40">
        <div className="container mx-auto px-4 py-10 flex-grow flex flex-col">
          <button onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-300 transition mb-6">
            <ArrowLeftIcon className="w-6 h-6 mr-2" />
            <span className="text-lg font-medium">Назад</span>
          </button>

          <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl p-6 backdrop-blur-md">
              <RecipeItem recipe={recipe}
                          isFavorite={recipe.favorite}
                          className="min-h-[40vh] block"
                          isMainPage={true} />
              <div className="mt-6">
                {!showForm ? (
                  <div className="flex flex-col items-center gap-4">
                    <button onClick={() => setShowForm(true)}
                      className="w-full max-w-md px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold shadow-md transition-all flex items-center justify-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      Редактировать рецепт
                    </button>
                    {/*{!isOpen && (*/}
                    {/*  <MobileMenuButton*/}
                    {/*    className="bg-white/70 hover:bg-white/90 transition-colors rounded-lg shadow"*/}
                    {/*    onClick={() => setIsOpen(true)} />*/}
                    {/*)}*/}
                  </div>
                ) : (
                  <div className="mt-6">
                    <RecipeForm key={id}
                                initialValues={initialValues as RecipeFormData}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowForm(false)}
                                title="Редактировать рецепт"
                                buttonText="Сохранить изменения"
                                className="bg-white rounded-xl shadow-lg p-6" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};