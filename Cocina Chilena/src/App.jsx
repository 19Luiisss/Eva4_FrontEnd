import React, { useState, useEffect, useCallback } from 'react';
import { fetchAndTransformDishes } from './services/api';
import Navbar from './components/Navbar';
import MenuPizarra from './components/MenuPizarra';
import './App.css';

const STORAGE_KEY = 'cocina_chilena_menu';

function App() {
  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error('Error cargando persistencia:', error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }, [menu]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (menu.length > 0 || isInitialized) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const dishes = await fetchAndTransformDishes();
        if (dishes && dishes.length > 0) {
          setMenu(dishes);
        } else {
          setError('No se encontraron platos chilenos en la API');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del menu');
        console.error('Error al cargar datos iniciales:', err);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, [menu.length, isInitialized]);

  const addDish = useCallback((name, price, imageUrl = '') => {
    const numericPrice = Number(price);
    
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      alert('Por favor, ingresa un precio valido (numero positivo)');
      return false;
    }

    const newDish = {
      idMeal: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      strMeal: name.trim() || 'Plato sin nombre',
      strMealThumb: imageUrl.trim() || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
      precio: numericPrice,
      disponible: true,
      categoria: 'Plato Chileno',
      fechaAgregado: new Date().toISOString()
    };

    setMenu(prevMenu => [newDish, ...prevMenu]);
    return true;
  }, []);

  const updateDish = useCallback((id, newPrice) => {
    const numericPrice = Number(newPrice);
    
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      alert('Por favor, ingresa un precio valido (numero positivo)');
      return false;
    }

    setMenu(prevMenu => 
      prevMenu.map(dish => 
        dish.idMeal === id 
          ? { ...dish, precio: numericPrice }
          : dish
      )
    );
    return true;
  }, []);

  const deleteDish = useCallback((id) => {
    if (window.confirm('¿Estas seguro de eliminar este plato del menu?')) {
      setMenu(prevMenu => prevMenu.filter(dish => dish.idMeal !== id));
      return true;
    }
    return false;
  }, []);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dishes = await fetchAndTransformDishes();
      if (dishes && dishes.length > 0) {
        setMenu(dishes);
      } else {
        setError('No se encontraron platos chilenos en la API');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos del menu');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading && menu.length === 0) {
    return (
      <div className="app">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando menu de Cocina Chilena...</p>
        </div>
      </div>
    );
  }

  if (error && menu.length === 0) {
    return (
      <div className="app">
        <Navbar />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <MenuPizarra 
          menu={menu}
          onAddDish={addDish}
          onUpdateDish={updateDish}
          onDeleteDish={deleteDish}
          loading={loading}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}

export default App;