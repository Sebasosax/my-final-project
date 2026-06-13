// recipe.js - muestra recetas por país y detalle de cada receta

import { getMealsByArea, getMealById } from './apiService.js';
import { saveFavorite, isFavorite } from './favorites.js';

// Mapeo de nombre de país a área de TheMealDB
// (TheMealDB no cubre todos los países, solo los principales)
const COUNTRY_TO_AREA = {
  'American Samoa': 'American', 'United States': 'American',
  'Canada': 'Canadian', 'British': 'British', 'United Kingdom': 'British',
  'China': 'Chinese', 'Egypt': 'Egyptian', 'France': 'French',
  'Greece': 'Greek', 'India': 'Indian', 'Ireland': 'Irish',
  'Italy': 'Italian', 'Jamaica': 'Jamaican', 'Japan': 'Japanese',
  'Kenya': 'Kenyan', 'Malaysia': 'Malaysian', 'Mexico': 'Mexican',
  'Morocco': 'Moroccan', 'Netherlands': 'Dutch', 'Croatia': 'Croatian',
  'Philippines': 'Filipino', 'Poland': 'Polish', 'Portugal': 'Portuguese',
  'Russia': 'Russian', 'Spain': 'Spanish', 'Thailand': 'Thai',
  'Tunisia': 'Tunisian', 'Turkey': 'Turkish', 'Ukraine': 'Ukrainian',
  'Vietnam': 'Vietnamese'
};

// Carga y renderiza recetas para un país
export async function loadRecipesForCountry(countryName, container) {
  const area = COUNTRY_TO_AREA[countryName];

  container.innerHTML = `
    <button id="btn-back">← Back to Countries</button>
    <h2>🍽️ ${countryName} Cuisine</h2>
    <div id="recipes-grid" class="recipes-grid">
      <p>Loading recipes...</p>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    import('./country.js').then(({ loadCountries }) => {
      loadCountries(container);
    });
  });

  if (!area) {
    document.getElementById('recipes-grid').innerHTML =
      '<p>No recipes available for this country in our database.</p>';
    return;
  }

  const meals = await getMealsByArea(area);
  const grid = document.getElementById('recipes-grid');

  if (meals.length === 0) {
    grid.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  grid.innerHTML = meals.map(meal => `
    <div class="recipe-card" data-id="${meal.idMeal}">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-info">
        <h3>${meal.strMeal}</h3>
        <button class="btn-view" data-id="${meal.idMeal}">View Recipe</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showRecipeDetail(btn.dataset.id, container);
    });
  });
}

// Muestra el detalle completo de una receta
export async function showRecipeDetail(mealId, container) {
  container.innerHTML = '<p>Loading recipe...</p>';

  const meal = await getMealById(mealId);

  if (!meal) {
    container.innerHTML = '<p>Could not load recipe.</p>';
    return;
  }

  // Extrae ingredientes y medidas
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
    }
  }

  const favorited = isFavorite(meal.idMeal);

  container.innerHTML = `
    <button id="btn-back">← Back to Recipes</button>
    <div class="recipe-detail">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <button id="btn-favorite" data-id="${meal.idMeal}">
        ${favorited ? '❤️ Saved' : '🤍 Save to Favorites'}
      </button>

      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>

      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    loadRecipesForCountry(meal.strArea, container);
  });

  document.getElementById('btn-favorite').addEventListener('click', () => {
    saveFavorite({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      area: meal.strArea
    });
    document.getElementById('btn-favorite').textContent = '❤️ Saved';
  });
}