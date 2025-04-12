import { IngredientItem } from '@/shared/ui/ingregients/IngredientItem';

type IngredientListProps = {
  ingredients: string[];
  selected: string[];
  onToggle: (ingredient: string) => void;
};

export const IngredientList = ({ ingredients, selected, onToggle }: IngredientListProps) => {

  if (ingredients.length === 0) {
    return <div className="text-gray-500 text-sm">Нет доступных ингредиентов</div>;
  }

  return (
    <div className="max-h-75 overflow-y-auto pr-1 mb-2 space-y-1">
      {ingredients.map((ingredient, index) => (
        <IngredientItem key={index}
                        ingredient={ingredient}
                        isSelected={selected.includes(ingredient)}
                        onToggle={onToggle} />
      ))}
    </div>
  );
};