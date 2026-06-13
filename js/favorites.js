// favorites.js - guarda y gestiona recetas favoritas en localStorage

const STORAGE_KEY = 'wce-favorites';

// Guarda una receta en favoritos
export function saveFavorite(meal) {
  const favorites = getFavorites();

  // Evita duplicados
  if (favorites.find(f => f.id === meal.id)) return;

  favorites.push(meal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Elimina una receta de favoritos
export function removeFavorite(mealId) {
  const favorites = getFavorites().filter(f => f.id !== mealId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Devuelve todos los favoritos
export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Verifica si una receta ya está en favoritos
export function isFavorite(mealId) {
  return getFavorites().some(f => f.id === mealId);
}

// Renderiza la pantalla de favoritos
export function loadFavorites(container) {
  const favorites = getFavorites();

  container.innerHTML = `
    <h2>❤️ My Favorite Recipes</h2>
    <div id="favorites-grid" class="recipes-grid"></div>
  `;

  const grid = document.getElementById('favorites-grid');

  if (favorites.length === 0) {
    grid.innerHTML = '<p>No favorites yet. Explore countries and save some recipes!</p>';
    return;
  }

  grid.innerHTML = favorites.map(meal => `
    <div class="recipe-card">
      <img src="${meal.image}" alt="${meal.name}" />
      <div class="card-info">
        <h3>${meal.name}</h3>
        <p><strong>Cuisine:</strong> ${meal.area}</p>
        <div class="card-buttons">
          <button class="btn-view" data-id="${meal.id}">View Recipe</button>
          <button class="btn-remove" data-id="${meal.id}">🗑️ Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  // Ver detalle de receta
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      import('./recipe.js').then(({ showRecipeDetail }) => {
        showRecipeDetail(btn.dataset.id, container);
      });
    });
  });

  // Eliminar de favoritos
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(btn.dataset.id);
      loadFavorites(container); // re-renderiza
    });
  });
}

// Save recently viewed country
export function saveRecentlyViewed(country) {
  let recent = getRecentlyViewed();

  // Remove if already exists
  recent = recent.filter(c => c.name !== country.name);

  // Add to beginning
  recent.unshift(country);

  // Keep only last 5
  recent = recent.slice(0, 5);

  localStorage.setItem('wce-recently-viewed', JSON.stringify(recent));
}

// Get recently viewed countries
export function getRecentlyViewed() {
  const data = localStorage.getItem('wce-recently-viewed');
  return data ? JSON.parse(data) : [];
}