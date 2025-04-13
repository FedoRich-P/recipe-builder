import { ingredientIcons } from '@/shared/lib/utils/ingredientIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IngredientItemProps = {
  ingredient: string;
  isSelected: boolean;
  onToggle: (ingredient: string) => void;
};

export const IngredientItem = ({ ingredient, isSelected, onToggle }: IngredientItemProps) => {
  const Icon = ingredientIcons[ingredient];

  return (
    <div onClick={() => onToggle(ingredient)}
      className={`flex items-center cursor-pointer p-2 ${isSelected ? 'bg-blue-100' : ''}`}>
      {Icon && <FontAwesomeIcon icon={Icon} className="mr-5 text-xl text-gray-600" />}
      <span className="text-sm">{ingredient}</span>
    </div>
  );
};