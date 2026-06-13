// filter.js - maneja el filtro de países por región

// Filtra y renderiza países según la región seleccionada
export function initFilter(countries, renderCallback) {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const filtered = filterCountries(countries, searchQuery);
    renderCallback(filtered);
  });
}

// Lógica de filtrado (solo por nombre, la nueva API no tiene región)
export function filterCountries(countries, searchQuery = '') {
  return countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery)
  );
}

// Devuelve todas las regiones únicas disponibles en los datos
export function getUniqueRegions(countries) {
  const regions = countries.map(c => c.region).filter(Boolean);
  return [...new Set(regions)].sort();
}