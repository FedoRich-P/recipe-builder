import { Recipe } from '@/features/recipe/model/types/recipe';
import { useAppSelector } from '@app/hooks';
import { selectFilteredRecipes } from '@/features/recipe/model/selectors/selectors';
import { selectSelectedIngredients } from '@/features/recipe/model/recipeSlice';
import { RecipeItem } from '@/features/recipe/ui/RecipeItem';

type RecipeItemProps = {
  recipes: Recipe[];
}

export const RecipesList = ({ recipes }: RecipeItemProps) => {
  const filteredRecipes = useAppSelector(selectFilteredRecipes);
  const selectedIngredients = useAppSelector(selectSelectedIngredients);

  if (selectedIngredients.length > 0 && filteredRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Нет рецептов с выбранными ингредиентами</p>
        <p className="text-sm text-gray-500 mt-2">
          Попробуйте изменить параметры фильтрации
        </p>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Рецепты не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-6 p-6">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id}
                    recipe={recipe}
                    isFavorite={recipe.favorite} />))}
    </div>
  );
};