export type Recipe = {
    id: string;
    name: string;
    ingredients: string[];
    steps: string[];
    favorite: boolean;
    calories: number;
    cookingTime: number;
    imageUrl?: string;
};

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'time-asc'
  | 'time-desc'
  | 'calories-asc'
  | 'calories-desc';



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