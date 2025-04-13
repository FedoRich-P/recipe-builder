import { Recipe } from '@/features/recipe/model/types/recipe';

export function getOrderedIngredients(recipes: Recipe[] | undefined, selected: string[]): string[] {
  if (!recipes?.length) return [];


  const allIngredients = recipes.flatMap(recipe => recipe.ingredients);

  const uniqueNames = Array.from(new Set(allIngredients.map(ingredient => ingredient?.name)));

  const ordered = [
    ...selected.filter(name => uniqueNames.includes(name)),
    ...uniqueNames.filter(name => !selected.includes(name))
  ];

  ordered.sort((a, b) => {
    if (!selected.includes(a) && !selected.includes(b)) {
      return a.localeCompare(b);
    }
    return 0;
  });

  return ordered;
}