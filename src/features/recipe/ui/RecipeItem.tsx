import { Recipe } from '@/features/recipe/model/types/recipe';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '@app/hooks';
import { toggleFavorite, deleteRecipe } from '@/features/recipe/model/recipeSlice';
import { NavLink } from 'react-router-dom';
import { IngredientsList } from '@/features/ingredients-filter/ui/IngredientsList';
import { FavoriteDeleteButtons } from '@/shared/ui/buttons/FavoriteDeleteButtons';

type RecipeItemProps = {
  recipe: Recipe | undefined;
  isFavorite: boolean;
  className?: string;
};

export const RecipeItem = ({ recipe, isFavorite, className }: RecipeItemProps) => {
  const dispatch = useAppDispatch();

  if (!recipe) return <h2>Нет такого рецепта...</h2>;

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe.id));
  };

  const handleDeleteRecipe = () => {
    dispatch(deleteRecipe(recipe.id));
  };

  return (
    <div
      className={`bg-gradient-to-t from-white/70 to-transparent rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full`}>
      <NavLink to={`/recipes/${Number(recipe.id)}`}
               className={`relative block h-48 overflow-hidden group ${className}`}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl}
               alt={recipe.name}
               className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105`}/>
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
            {recipe.name}
          </h3>
        </div>
      </NavLink>

      <div className="p-4 flex flex-col flex-grow pb-0">
        <div className="flex-grow">
          <IngredientsList ingredients={recipe.ingredients} recipeName={recipe.name} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow pb-0">
        <div className="flex-grow">
          <ul>
            {recipe.steps.map((step, i) => (
              <li className={" text-gray-700 text-base rounded-full truncate mb-2"}>{i+1} / {step}</li>
            ))}
          </ul>
        </div>
      </div>

      <FavoriteDeleteButtons isFavorite={isFavorite}
                             onToggleFavorite={handleToggleFavorite}
                             onDelete={handleDeleteRecipe}
                             className={'justify-around p-4 pt-2'} />
    </div>
  );
};