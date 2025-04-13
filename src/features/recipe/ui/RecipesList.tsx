import { Recipe } from '@/features/recipe/model/types/recipe';
import { RecipeItem } from '@/features/recipe/ui/RecipeItem';

type RecipeItemProps = {
  recipes: Recipe[] | undefined;
  isMainPage?: boolean;
}

export const RecipesList = ({ recipes, isMainPage }: RecipeItemProps) => {

  return (
    <div className="grid items-start sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-6 p-6">
      {recipes?.map((recipe) => (
        <RecipeItem key={recipe.id}
                    recipe={recipe}
                    isFavorite={recipe.favorite}
                    isMainPage={isMainPage} />))}
    </div>
  );
};