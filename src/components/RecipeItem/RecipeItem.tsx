import { Recipe } from '@/shared/types/recipe';
import { ClockIcon, FireIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '@app/hooks';
import { toggleFavorite, deleteRecipe } from '@/features/recipe/recipeSlice'; // предполагаем, что deleteRecipe существует
import { NavLink } from 'react-router-dom';
import { FavoriteDeleteButtons } from './FavoriteDeleteButtons';
import { IngredientsList } from './IngredientsList';

type RecipeItemProps = {
  recipe: Recipe;
  isFavorite: boolean;
};

export const RecipeItem = ({ recipe, isFavorite }: RecipeItemProps) => {
  const dispatch = useAppDispatch();

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe.id));
  };

  const handleDeleteRecipe = () => {
    dispatch(deleteRecipe(recipe.id));
  };

  return (
    <div className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between p-5 pb-0">
          {/* Левая часть: Заголовок и ссылка */}
          <div className="flex items-center gap-2">
            <NavLink to={`/recipes/${recipe.id}`} className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">{recipe.name}</h3>
              <ArrowLongRightIcon className="w-5 h-5 text-gray-500" />
            </NavLink>
          </div>
          {/* Правая часть: Кнопки для избранного и удаления */}
          <FavoriteDeleteButtons isFavorite={isFavorite}
                                 onToggleFavorite={handleToggleFavorite}
                                 onDelete={handleDeleteRecipe} />
        </div>
        <div className="p-5 pt-0">
          <IngredientsList ingredients={recipe.ingredients} recipeName={recipe.name} />
          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>25 mins</span>
            </div>
            <div className="flex items-center space-x-2">
              <FireIcon className="w-4 h-4" />
              <span>320 kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
