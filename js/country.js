// country.js - displays the list of countries and their information

import { getAllCountries } from './apiService.js';
import { filterCountries } from './filter.js';

// Countries that have available recipes in TheMealDB
const COUNTRIES_WITH_MEALS = [
  'American Samoa', 'United States', 'Canada', 'United Kingdom',
  'China', 'Egypt', 'France', 'Greece', 'India', 'Ireland',
  'Italy', 'Jamaica', 'Japan', 'Kenya', 'Malaysia', 'Mexico',
  'Morocco', 'Netherlands', 'Croatia', 'Philippines', 'Poland',
  'Portugal', 'Russia', 'Spain', 'Thailand', 'Tunisia',
  'Turkey', 'Ukraine', 'Vietnam'
];

export async function loadCountries(container) {
  const allCountries = await getAllCountries();

  // Filter only countries that have available recipes
  const countries = allCountries.filter(c =>
    COUNTRIES_WITH_MEALS.includes(c.name)
  );

  if (countries.length === 0) {
    container.innerHTML = '<p>Could not load countries. Try again later.</p>';
    return;
  }

  container.innerHTML = `
    <section class="controls">
      <input type="text" id="search-input" placeholder="Search country..." aria-label="Search for a country" />
    </section>
    <section id="countries-grid" class="countries-grid"></section>
  `;

  renderCountryCards(countries);

  // Search only (no region filtering)
  document.getElementById('search-input').addEventListener('input', () => {
    filterAndRender(countries);
  });
}

function filterAndRender(countries) {
  const search = document.getElementById('search-input').value.toLowerCase();
  const filtered = filterCountries(countries, search);
  renderCountryCards(filtered);
}

// Create and display country cards
function renderCountryCards(countries) {
  const grid = document.getElementById('countries-grid');

  if (countries.length === 0) {
    grid.innerHTML = '<p>No countries found.</p>';
    return;
  }

  grid.innerHTML = countries.map(country => `
    <div class="country-card" data-code="${country.iso2 || ''}">
      <img src="${country.flag || ''}" alt="Flag of ${country.name}" />
      <div class="card-info">
        <h3>${country.name}</h3>
        <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
        <p><strong>Currency:</strong> ${country.currency || 'N/A'}</p>
      </div>
    </div>
  `).join('');

  // Add click event to each card to view recipes
  document.querySelectorAll('.country-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3').textContent;
      showCountryDetail(name);
    });
  });
}

// Display country details (recipes included)
function showCountryDetail(countryName) {
  import('./recipe.js').then(({ loadRecipesForCountry }) => {
    const app = document.getElementById('app');
    loadRecipesForCountry(countryName, app);
  });
}