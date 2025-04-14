export type Recipe = {
    id: string;
    name: string;
    ingredients: Ingredient[];
    steps: string[];
    favorite: boolean;
    calories: number;
    cookingTime: number;
    imageUrl?: string;
    category: string
};

export type RecipeFormData = {
    name: string;
    ingredients: Ingredient[];
    stepsString: string;
    cookingTime?: number | null | '';
    calories?: number | null | '';
    category: string;
    image: FileList | null;
};

export type Ingredient = {
    name: string;
    amount: string;
};

export type SortOption = {
    sortType: 'name' | 'cookingTime' | 'calories' | 'favorite' | '';
    sortDirection: 'asc' | 'desc' | '';
};

export type SearchType = 'name' | 'ingredient' | 'category' | 'none';

export type RecipesState = {
    recipes: Recipe[];
};
