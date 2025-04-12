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

export type Ingredient = {
    name: string;
    amount: string;
};

export type SortOption =
  | 'name'
  | 'time'
  | 'calories'

export type SearchType = 'name' | 'ingredient' | 'category' | 'none';

export type RecipesState = {
    recipes: Recipe[];
};

// export type SortOption =
//   | 'name-asc'
//   | 'name-desc'
//   | 'ingredients-asc'
//   | 'ingredients-desc';

// export type Recipe = {
//     id: string;
//     name: string;
//     ingredients: string[];
//     steps: string[];
//     favorite: boolean;
// };