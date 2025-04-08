import { useState, useRef } from 'react';
import { IngredientsPopup } from '@components/IngredientsPopup/IngredientsPopup';

type IngredientsListProps = {
  ingredients: string[];
  recipeName: string;
};

export const IngredientsList = ({ ingredients, recipeName }: IngredientsListProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const moreButtonRef = useRef<HTMLSpanElement | null>(null);

  const handleMoreIngredientsClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="mb-3">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Ингредиенты :</h4>
      <div className="flex flex-wrap gap-1">
        {ingredients.slice(0, 4).map((ingredient, index) => (
          <span key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full truncate"
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                }}
                title={ingredient}>
            {ingredient}
          </span>
        ))}
        {ingredients.length > 4 && (
          <span ref={moreButtonRef}
                onClick={handleMoreIngredientsClick}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full cursor-pointer truncate"
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                }}
                title={`+${ingredients.length - 4} more`}>
            +{ingredients.length - 4} more
          </span>
        )}
      </div>

      {isPopupOpen && (
        <IngredientsPopup ingredients={ingredients}
                          onClose={handleMoreIngredientsClick}
                          moreButtonRef={moreButtonRef}
                          recipeName={recipeName}
        />
      )}
    </div>
  );
};
