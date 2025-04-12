import fs from 'fs';
import recipesData from './recipes.json' assert { type: 'json' }; // Укажите путь к вашему JSON

const lowerCaseRecipes = recipesData.map(recipe => ({
  ...recipe,
  name: recipe.name.toLowerCase(),
  category: recipe.category.toLowerCase(),
  // Опционально: обработать ингредиенты
  ingredients: recipe.ingredients.map(ing => ({
    ...ing,
    name: ing.name.toLowerCase()
  }))
}));

const outputFilePath = './recipes_lowercase.json'; // Новое имя файла
fs.writeFileSync(outputFilePath, JSON.stringify(lowerCaseRecipes, null, 2));

console.log(`Преобразованные данные сохранены в ${outputFilePath}`);