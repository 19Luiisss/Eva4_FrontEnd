const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const API_ENDPOINT = `${API_BASE_URL}/filter.php?a=Chile`;

export const fetchChileanDishes = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.meals) {
      throw new Error('Estructura de datos invalida desde la API');
    }
    
    return data;
  } catch (error) {
    throw new Error(`Error al obtener datos: ${error.message}`);
  }
};

export const transformDishes = (meals) => {
  if (!meals || !Array.isArray(meals)) {
    return [];
  }
  
  return meals.map(meal => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal || 'Plato sin nombre',
    strMealThumb: meal.strMealThumb || '',
    precio: 0,
    disponible: true,
    categoria: 'Plato Chileno',
    fechaAgregado: new Date().toISOString()
  }));
};

export const fetchAndTransformDishes = async () => {
  try {
    const rawData = await fetchChileanDishes();
    const transformedDishes = transformDishes(rawData.meals);
    return transformedDishes;
  } catch (error) {
    throw new Error(`Error en fetchAndTransformDishes: ${error.message}`);
  }
};