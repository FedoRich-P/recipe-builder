import { Recipe } from '@/features/recipe/model/types/recipe';

export function getOrderedIngredients(recipes: Recipe[] | undefined, selected: string[]): string[] {
  if (!recipes?.length) return [];

  // Извлекаем все ингредиенты
  const allIngredients = recipes.flatMap(recipe => recipe.ingredients);
  // Получаем уникальные имена
  const uniqueNames = Array.from(new Set(allIngredients.map(ingredient => ingredient?.name)));

  // Сначала добавляем выбранные ингредиенты, потом оставшиеся (сортируя по алфавиту только те, которые не выбраны)
  const ordered = [
    ...selected.filter(name => uniqueNames.includes(name)),
    ...uniqueNames.filter(name => !selected.includes(name))
  ];

  // Дополнительная сортировка: если ингредиенты не выбраны, сортировать по алфавиту
  ordered.sort((a, b) => {
    if (!selected.includes(a) && !selected.includes(b)) {
      return a.localeCompare(b);
    }
    return 0;
  });

  return ordered;
}