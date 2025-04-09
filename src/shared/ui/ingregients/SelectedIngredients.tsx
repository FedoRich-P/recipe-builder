import { XMarkIcon } from '@heroicons/react/24/solid';

type SelectedIngredientsProps = {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
  onClear: () => void;
};

export const SelectedIngredients = ({ ingredients, onRemove, onClear }: SelectedIngredientsProps) => {
  if (ingredients.length === 0) return null;

  return (
    <>
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-1">Выбранные:</h4>
        <ul className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <li key={ing}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
              {ing}
              <XMarkIcon className="w-4 h-4 cursor-pointer"
                         onClick={() => onRemove(ing)} />
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onClear}
              className="text-sm text-orange-600 hover:underline">
        Очистить фильтр
      </button>
    </>
  );
};