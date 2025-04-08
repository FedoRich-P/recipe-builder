type StatsCounterProps  = {
    className?: string;
    totalRecipes?: number;
    favoriteRecipes?: number;
}

export const StatsCounter = ({className, totalRecipes = 0, favoriteRecipes = 0}: StatsCounterProps) => {

    return (
        <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
            <div className="flex justify-around items-center gap-8">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Всего рецептов :</div>
                    <div className="text-2xl font-bold text-gray-800 p-3">{totalRecipes}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-gray-500">Избранных рецептов :</div>
                    <div className="text-2xl font-bold text-orange-500 p-3">{favoriteRecipes}</div>
                </div>
            </div>
        </div>
    );
};