// main.js - entry point of the application

import { loadCountries } from './country.js';
import { loadFavorites, getRecentlyViewed } from './favorites.js';
import { loadRandomExplorer } from './randomExplorer.js';

const app = document.getElementById('app');

// Navigation buttons
document.getElementById('btn-home').addEventListener('click', () => {
  window.location.hash = '';
  showWelcome();
});
document.getElementById('btn-countries').addEventListener('click', () => {
  window.location.hash = 'countries';
});
document.getElementById('btn-random').addEventListener('click', () => {
  window.location.hash = 'random';
});
document.getElementById('btn-favorites').addEventListener('click', () => {
  window.location.hash = 'favorites';
});

// Router - decides what to render based on URL hash
function router() {
  const hash = window.location.hash;

  switch (hash) {
    case '#countries':
      showCountries();
      break;
    case '#random':
      showRandom();
      break;
    case '#favorites':
      showFavorites();
      break;
    case '#':
    case '':
    default:
      showWelcome();
      break;
  }
}

// Welcome page
function showWelcome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <h2>Discover the World Through Food 🍜🌮🍛</h2>
        <p>Explore traditional recipes from countries around the world. From Italian pasta to Japanese sushi — every country has a story to tell through its cuisine.</p>
        <button id="btn-explore" aria-label="Start exploring countries">Start Exploring</button>
      </div>
    </section>

    <section class="how-to">
      <h3>How It Works</h3>
      <div class="steps-grid">
        <div class="step-card">
          <span class="step-icon">🌍</span>
          <h4>Browse Countries</h4>
          <p>Click "Start Exploring" to see countries with available recipes. Search by name to find a specific one.</p>
          <button class="btn-secondary" id="btn-go-countries">Browse Countries</button>
        </div>
        <div class="step-card">
          <span class="step-icon">🍽️</span>
          <h4>Discover Recipes</h4>
          <p>Click on any country to view its traditional dishes, full ingredients, and cooking instructions.</p>
          <button class="btn-secondary" id="btn-go-recipes">Discover Recipes</button>
        </div>
        <div class="step-card">
          <span class="step-icon">❤️</span>
          <h4>Save Favorites</h4>
          <p>Found a recipe you love? Save it to your favorites and access it anytime with one click.</p>
          <button class="btn-secondary" id="btn-go-favorites">View Favorites</button>
        </div>
        <div class="step-card">
          <span class="step-icon">🎲</span>
          <h4>Random Cuisine</h4>
          <p>Feeling adventurous? Let us surprise you with a random dish from anywhere in the world.</p>
          <button class="btn-secondary" id="btn-go-random">Try Random</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById('btn-explore').addEventListener('click', () => {
    window.location.hash = 'countries';
  });
  document.getElementById('btn-go-countries').addEventListener('click', () => {
    window.location.hash = 'countries';
  });
  document.getElementById('btn-go-recipes').addEventListener('click', () => {
    window.location.hash = 'countries';
  });
  document.getElementById('btn-go-favorites').addEventListener('click', () => {
    window.location.hash = 'favorites';
  });
  document.getElementById('btn-go-random').addEventListener('click', () => {
    window.location.hash = 'random';
  });

  // Show recently viewed at the bottom
  showRecentlyViewed();
}

function showCountries() {
  app.innerHTML = '<p>Loading countries...</p>';
  loadCountries(app);
}

function showRandom() {
  loadRandomExplorer(app);
}

function showFavorites() {
  loadFavorites(app);
}

// Renders recently viewed countries on the welcome page
function showRecentlyViewed() {
  const recent = getRecentlyViewed();
  if (recent.length === 0) return;

  const section = document.createElement('section');
  section.className = 'recently-viewed';
  section.innerHTML = `
    <h3>Recently Viewed 🕐</h3>
    <div class="recent-grid">
      ${recent.map(country => `
        <div class="recent-card" data-name="${country.name}">
          <img src="${country.flag || ''}" alt="Flag of ${country.name}" />
          <p>${country.name}</p>
        </div>
      `).join('')}
    </div>
  `;

  app.appendChild(section);

  section.querySelectorAll('.recent-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const country = recent.find(c => c.name === name);
      window.location.hash = 'countries';
      setTimeout(() => {
        import('./recipe.js').then(({ loadRecipesForCountry }) => {
          loadRecipesForCountry(name, app, country);
        });
      }, 300);
    });
  });
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Run on page load
router();