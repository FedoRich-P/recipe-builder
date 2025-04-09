type IngredientItemProps = {
  ingredient: string;
  isSelected: boolean;
  onToggle: (ingredient: string) => void;
};

export const IngredientItem = ({ ingredient, isSelected, onToggle }: IngredientItemProps) => {
  return (
    <label className="inline-flex items-center gap-2 text-sm cursor-pointer w-full">
      <input type="checkbox"
             checked={isSelected}
             onChange={() => onToggle(ingredient)}
             className="accent-orange-500" />
      <span className={`${isSelected ? 'font-medium text-orange-600' : 'text-gray-700'}`}>
        {ingredient}
      </span>
    </label>
  );
};