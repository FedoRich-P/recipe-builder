import {useState} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {SearchInput} from "@components/sidebar/SearchInput";
import {SortControls} from "@components/sidebar/SortControls";
import {StatsCounter} from "@components/sidebar/StatsCounter";
import { RecipeForm, RecipeFormData } from '@components/forms/RecipeForm';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
    addRecipe,
    selectAllRecipes,
    selectFavorites,
    setSearchTerm,
} from '@/features/recipe/recipeSlice';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const allRecipes = useAppSelector(selectAllRecipes);
    const favorites = useAppSelector(selectFavorites);

    const handleSearch = (value: string) => {
        dispatch(setSearchTerm(value));
    };

    const handleSubmit = (data: RecipeFormData) => {
        const newRecipe = {
            id: Date.now().toString(),
            name: data.name,
            ingredients: data.ingredients.map(ing => ing.value),
            steps: data.steps.split("\n"),
            favorite: false,
        };
        dispatch(addRecipe(newRecipe));
    };

    return (
        <>
            {!isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="fixed top-22 right-4 z-50 p-3 rounded-md bg-white shadow lg:hidden">
                  <span className="text-sm font-medium text-gray-700"> Открыть меню</span>
              </button>
            )}

            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-130 bg-white shadow-lg z-40 transition-all duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}>
                <div className="p-5 h-full flex flex-col overflow-y-auto">
                    <button onClick={() => setIsOpen(false)}
                            className="self-end lg:hidden p-1 mb-4 rounded-full hover:bg-gray-100">
                        <XMarkIcon className="w-6 h-6 text-gray-500"/>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Поиск и добавление рецептов :</h2>
                    <SearchInput onSearch={handleSearch}
                                 className="mb-6"/>
                    <RecipeForm onSubmit={handleSubmit}/>
                    {/*<SortControls className="mb-6"/>*/}
                    <h3 className="font-medium text-gray-700 mb-2">Recipes Stats</h3>
                    <StatsCounter totalRecipes={allRecipes.length} favoriteRecipes={favorites.length} className="mt-auto"/>
                </div>
            </aside>
        </>
    );
};
