import { Recipe } from '@/entities/recipe/model/types/recipe';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { IngredientsList } from '@/features/ingredients-filter/ui/IngredientsList';
import { FavoriteDeleteButtons } from '@/shared/ui/buttons/FavoriteDeleteButtons';
import { capitalizeWords } from '@/shared/lib/utils/capitalizeWords';
import { useDeleteRecipeMutation, useToggleFavoriteMutation } from '@/shared/api/recipesApi';

type RecipeItemProps = {
  recipe: Recipe | undefined;
  isFavorite: boolean;
  className?: string;
  isMainPage?: boolean;
};

export const RecipeItem = ({ recipe, isFavorite, className, isMainPage = false }: RecipeItemProps) => {
  const [toggleFavorite] = useToggleFavoriteMutation()
  const [deleteRecipe] = useDeleteRecipeMutation()

  if (!recipe) return <h2>Нет такого рецепта...</h2>;

  const handleToggleFavorite = () => {
    toggleFavorite({ id: recipe.id, currentFavoriteStatus: isFavorite });
  };


  const handleDeleteRecipe = () => {
    deleteRecipe(recipe.id)
  };

  return (
    <div
      className={`bg-gradient-to-t from-white/70 to-transparent rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full`}>
      <NavLink to={`/recipes/${recipe.id}`}
               className={`relative block h-48 overflow-hidden group ${className}`}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl}
               alt={recipe.name}
               className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105`} />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4">
          <div className="flex justify-between text-sm text-white">
            <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded">
              <ClockIcon className="w-4 h-4" />
              <span>{recipe.cookingTime} мин.</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded">
              <FireIcon className="w-4 h-4" />
              <span>{recipe.calories} ккал</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-md">
            {capitalizeWords(recipe.name)}
          </h3>
        </div>
      </NavLink>

      <div className="p-4 flex flex-col flex-grow pb-0">
        <h3>{recipe.category}</h3>
      </div>

      <div className="p-4 flex flex-col flex-grow pb-0">
        <div className="flex-grow">
          <IngredientsList ingredients={recipe.ingredients} isMain={isMainPage} />
        </div>
      </div>

      <div className=" px-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <ul>
            {Array.isArray(recipe.steps) && recipe?.steps.map((step, i) => (
              <li key={i} className={' text-gray-700 text-sm rounded-full truncate mb-2'}>{i + 1}. {step}</li>
            ))}
          </ul>
        </div>
      </div>

      <FavoriteDeleteButtons isFavorite={isFavorite}
                             onToggleFavorite={handleToggleFavorite}
                             onDelete={handleDeleteRecipe}
                             className={'justify-end gap-8 p-4 pt-0'} />
    </div>
  );
};