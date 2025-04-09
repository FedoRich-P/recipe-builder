type StatsCounterProps  = {
    className?: string;
    totalRecipes?: number;
    favoriteRecipes?: number;
}

export const StatsCounter = ({className, totalRecipes = 0, favoriteRecipes = 0}: StatsCounterProps) => {

    return (
            <div className={`bg-gray-50 p-4 rounded-lg flex justify-around items-center gap-8 ${className}`}>
                <div className="items-center flex">
                    <h4 className="text-xs text-gray-500 whitespace-nowrap">Всего рецептов :</h4>
                    <div className="text-2xl font-bold text-gray-800 p-3">{totalRecipes}</div>
                </div>
                <div className="items-center flex">
                    <h4 className="text-xs text-gray-500 whitespace-nowrap">Избранных рецептов :</h4>
                    <div className="text-2xl font-bold text-orange-500 p-3">{favoriteRecipes}</div>
                </div>
        </div>
    );
};