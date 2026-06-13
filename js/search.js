// search.js - maneja la búsqueda de países

import { getAllCountries } from './apiService.js';

export async function initSearch(container) {
  const countries = await getAllCountries();

  // Escucha el input de búsqueda que ya existe en country.js
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === '') return;

    const results = countries.filter(country =>
      country.name.common.toLowerCase().includes(query)
    );

    renderSearchResults(results, container);
  });
}

function renderSearchResults(results, container) {
  const grid = document.getElementById('countries-grid');
  if (!grid) return;

  if (results.length === 0) {
    grid.innerHTML = '<p>No countries found.</p>';
    return;
  }

  grid.innerHTML = results.map(country => `
    <div class="country-card" data-code="${country.cca2}">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
      <div class="card-info">
        <h3>${country.name.common}</h3>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}