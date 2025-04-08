import { RecipesList } from '@components/RecipesList/RecipesList';
import { useAppSelector } from '@app/hooks';
import { selectAllRecipes } from '@/features/recipe/recipeSlice';

export const RecipesPage = () => {
  const recipes = useAppSelector(selectAllRecipes);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
          <RecipesList recipes={recipes} />
      </div>
    </div>
  );

  // return (
  //   <div className="grid grid-cols-[320px_1fr] gap-8 min-h-screen p-8 bg-gray-50">
  //     <Sidebar/>
  //     <RecipesList recipes={recipes} />
  //   </div>
  // );
};