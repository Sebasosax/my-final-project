// main.js - punto de entrada de la aplicación

import { loadCountries } from './country.js';
import { loadFavorites } from './favorites.js';
import { loadRandomExplorer } from './randomExplorer.js';


const app = document.getElementById('app');

// Estado de la app
let currentView = 'home';

// Navegación
document.getElementById('btn-home').addEventListener('click', () => showHome());
document.getElementById('btn-random').addEventListener('click', () => showRandom());
document.getElementById('btn-favorites').addEventListener('click', () => showFavorites());

// Vistas
function showHome() {
  currentView = 'home';
  app.innerHTML = '<p>Loading countries...</p>';
  loadCountries(app);
}

function showRandom() {
  currentView = 'random';
  loadRandomExplorer(app);
}


function showFavorites() {
  currentView = 'favorites';
  loadFavorites(app);
}

// Cargar home al iniciar
showHome();