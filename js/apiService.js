// apiService.js - handles all external API calls

const MEALS_API = 'https://www.themealdb.com/api/json/v1/1';

// Fetch all countries
export async function getAllCountries() {
  try {
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries/info?returns=name,flag,capital,currency,unicodeFlag,dialCode'
    );

    if (!response.ok) throw new Error('Failed to fetch countries');

    const data = await response.json();
    console.log(data);

    // Sort countries alphabetically by name
    return data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (error) {
    console.error('getAllCountries error:', error);
    return [];
  }
}

// Fetch meals by area/country (e.g. "Mexican", "Italian")
export async function getMealsByArea(area) {
  try {
    const response = await fetch(
      `${MEALS_API}/filter.php?a=${area}`
    );

    if (!response.ok) throw new Error('Failed to fetch meals');

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('getMealsByArea error:', error);
    return [];
  }
}

// Fetch full meal details by ID
export async function getMealById(id) {
  try {
    const response = await fetch(
      `${MEALS_API}/lookup.php?i=${id}`
    );

    if (!response.ok) throw new Error('Failed to fetch meal details');

    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('getMealById error:', error);
    return null;
  }
}

// Fetch a random meal
export async function getRandomMeal() {
  try {
    const response = await fetch(`${MEALS_API}/random.php`);

    if (!response.ok) throw new Error('Failed to fetch random meal');

    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('getRandomMeal error:', error);
    return null;
  }
}