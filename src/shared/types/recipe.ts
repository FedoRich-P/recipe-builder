export type Recipe = {
    id: string;
    name: string;
    ingredients: string[];
    steps: string[];
    favorite: boolean;
};

export type RecipesState = {
    recipes: Recipe[];
};

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'ingredients-asc'
  | 'ingredients-desc';