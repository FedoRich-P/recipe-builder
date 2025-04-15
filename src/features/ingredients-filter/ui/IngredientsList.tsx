import { useState, useRef, memo } from 'react';
import { Ingredient } from '@/entities/recipe/model/types/recipe';
import { IngredientsPopup } from '@/features/ingredients-popup/ui/IngredientsPopup';
import { customCN } from '@/shared/lib/utils/customCN';
import { capitalizeWords } from '@/shared/lib/utils/capitalizeWords';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ingredientIcons } from '@/shared/lib/utils/ingredientIcons';

type IngredientsListProps = {
  ingredients: Ingredient[];
  isMain?: boolean;
};

const IngredientsListComponent = ({ ingredients, isMain = false }: IngredientsListProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const moreButtonRef = useRef<HTMLSpanElement>(null);

  const togglePopup = () => setIsPopupOpen(prev => !prev);

  return (
    <section className={customCN(
      'bg-white/80 backdrop-blur-md rounded-lg border border-white/20 mb-4 p-4',
      isMain && 'shadow-sm',
    )}>
      <h3 className={customCN(
        'text-lg font-semibold mb-3',
        isMain ? 'text-gray-800 border-b border-rose-100 pb-2' : 'text-gray-700',
      )}>
        Ингредиенты
      </h3>

      {isMain ? (
        <ul className="space-y-2.5">
          {ingredients.map((ingredient, index) => (
            <li key={index}
                className="flex justify-between items-center py-2.5 px-1 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors group">
              <span className="text-gray-700 font-medium truncate">
                 {ingredientIcons[ingredient.name] && (
                   <FontAwesomeIcon icon={ingredientIcons[ingredient.name]}
                                    className="mr-5 text-xl text-gray-600" />
                 )}
                {capitalizeWords(ingredient.name)}
              </span>
              {ingredient.amount && (
                <span className="text-rose-600 text-sm bg-rose-50 px-2 py-1 rounded-md ml-2 flex-shrink-0">
                  {ingredient.amount}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative">
          <ul className="flex flex-wrap gap-2">
            {ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index}
                  className="px-3 py-1.5 bg-rose-50 text-rose-800 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors flex items-center cursor-default">
                {ingredientIcons[ingredient.name] && (
                  <FontAwesomeIcon
                    icon={ingredientIcons[ingredient.name]}
                    className="mr-2 text-rose-600 text-sm"
                  />
                )}
                <span>{capitalizeWords(ingredient.name)}</span>
              </li>
            ))}
            {ingredients.length > 3 && (
              <span ref={moreButtonRef}
                    onClick={togglePopup}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer flex items-center">
                Ещё {ingredients.length - 3}
              </span>
            )}
          </ul>

          {isPopupOpen && (<IngredientsPopup
              ingredients={ingredients}
              onClose={togglePopup}
              moreButtonRef={moreButtonRef} />
          )}
        </div>
      )}
    </section>
  );
};

export const IngredientsList = memo(IngredientsListComponent);
