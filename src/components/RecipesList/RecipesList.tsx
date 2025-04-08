import { RecipeItem } from '@components/RecipeItem/RecipeItem';
import { Recipe } from '@/shared/types/recipe';

type RecipeItemProps = {
  recipes: Recipe[];
}

export const RecipesList = ({ recipes }: RecipeItemProps) => {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id}
                    recipe={recipe}
                    isFavorite={recipe.favorite} />
      ))}
    </div>
  );
};