// randomExplorer.js - genera una sugerencia aleatoria de país y receta

import { getRandomMeal } from './apiService.js';

export async function loadRandomExplorer(container) {
  container.innerHTML = `
    <div class="random-container">
      <h2>🎲 Random Cuisine Explorer</h2>
      <p>Discover a random dish from around the world!</p>
      <button id="btn-surprise">Surprise Me!</button>
      <div id="random-result"></div>
    </div>
  `;

  document.getElementById('btn-surprise').addEventListener('click', () => {
    fetchRandom();
  });

  // Carga uno automáticamente al entrar
  fetchRandom();

  async function fetchRandom() {
    const result = document.getElementById('random-result');
    result.innerHTML = '<p>Loading...</p>';

    const meal = await getRandomMeal();

    if (!meal) {
      result.innerHTML = '<p>Could not load a random recipe. Try again.</p>';
      return;
    }

    // Extrae ingredientes
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
      }
    }

    result.innerHTML = `
      <div class="recipe-detail">
        <h3>${meal.strMeal}</h3>
        <p class="cuisine-tag">🌍 ${meal.strArea} Cuisine</p>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />

        <div class="random-actions">
          <button id="btn-save-random" data-id="${meal.idMeal}">🤍 Save to Favorites</button>
          <button id="btn-another">🎲 Try Another</button>
        </div>

        <h4>Ingredients</h4>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>

        <h4>Instructions</h4>
        <p>${meal.strInstructions}</p>
      </div>
    `;

    // Guardar en favoritos
    document.getElementById('btn-save-random').addEventListener('click', (e) => {
      import('./favorites.js').then(({ saveFavorite, isFavorite }) => {
        if (isFavorite(meal.idMeal)) {
          e.target.textContent = '❤️ Already Saved';
          return;
        }
        saveFavorite({
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          area: meal.strArea
        });
        e.target.textContent = '❤️ Saved!';
      });
    });

    // Cargar otro random
    document.getElementById('btn-another').addEventListener('click', () => {
      fetchRandom();
    });
  }
}