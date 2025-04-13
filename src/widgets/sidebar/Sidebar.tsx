import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { RecipeForm } from '@/shared/ui/forms/RecipeForm/RecipeForm';
import { IngredientFilter } from '@/features/ingredients-filter/ui/IngredientFilter';
import { SortControls } from '@/features/recipe/ui/SortControls';
import { MobileMenuButton } from '@/shared/ui/buttons/MobileMenuButton';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
  };

  return (
   <>
     {!isOpen && (
       <MobileMenuButton
         className="bg-gray/70 hover:bg-white/90 transition-colors rounded-lg shadow z-1000"
         onClick={() => setIsOpen(true)} />
     )}
     <aside
       className={`sidebar fixed lg:sticky left-0 h-screen max-w-120 w-full bg-white shadow-lg z-100 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
       <div className="p-4 pt-10 h-full flex flex-col overflow-y-auto w-full">
         <SortControls className="flex flex-wrap gap-2 w-full lg:w-auto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-gray-300 after:via-gray-400 after:to-gray-300" />
         <IngredientFilter />
         <button onClick={() => setIsOpen(false)}
                 className="absolute top-0 right-5 self-end lg:hidden p-2 mb-2 rounded-lg hover:bg-gray-100 transition-colors z-1000">
           <XMarkIcon className="w-8 h-8 text-gray-500" />
         </button>
         <h2 className="text-xl font-bold text-gray-800 mb-4">Управление рецептами</h2>
         {!showForm ? (
           <button
             onClick={() => setShowForm(true)}
             className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
             <PlusIcon className="w-4 h-4" />
             Добавить рецепт
           </button>
         ) : (
           <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
             <RecipeForm onSubmit={handleSubmit} buttonText={'Добавить рецепт'} onCancel={() => setShowForm(false)} />
           </div>
         )}
       </div>
     </aside>
   </>
  );
};