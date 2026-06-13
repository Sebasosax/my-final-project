// uiComponents.js - componentes reutilizables de la interfaz

// Muestra un mensaje de carga
export function showLoading(container, message = 'Loading...') {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

// Muestra un mensaje de error
export function showError(container, message = 'Something went wrong. Please try again.') {
  container.innerHTML = `
    <div class="error-message">
      <p>⚠️ ${message}</p>
      <button onclick="location.reload()">Reload</button>
    </div>
  `;
}

// Crea una tarjeta de país
export function createCountryCard(country) {
  return `
    <div class="country-card" data-code="${country.cca2}">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
      <div class="card-info">
        <h3>${country.name.common}</h3>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    </div>
  `;
}

// Crea una tarjeta de receta
export function createRecipeCard(meal) {
  return `
    <div class="recipe-card" data-id="${meal.idMeal}">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-info">
        <h3>${meal.strMeal}</h3>
        <button class="btn-view" data-id="${meal.idMeal}">View Recipe</button>
      </div>
    </div>
  `;
}

// Botón de regreso genérico
export function createBackButton(label = '← Back') {
  const btn = document.createElement('button');
  btn.id = 'btn-back';
  btn.textContent = label;
  return btn;
}