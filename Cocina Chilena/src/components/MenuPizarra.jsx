import React, { useState } from 'react';
import PlatoCard from './PlatoCard';
import './MenuPizarra.css';

const MenuPizarra = ({ 
  menu, 
  onAddDish, 
  onUpdateDish, 
  onDeleteDish,
  loading,
  onRetry 
}) => {
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishImage, setNewDishImage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const success = onAddDish(newDishName, newDishPrice, newDishImage);
    if (success) {
      setNewDishName('');
      setNewDishPrice('');
      setNewDishImage('');
      setShowAddForm(false);
    }
  };

  if (loading && menu.length > 0) {
    return (
      <div className="menu-pizarra">
        <div className="menu-header">
          <h2>Menu de Cocina Chilena</h2>
          <span className="plato-count">{menu.length} platos</span>
        </div>
        <div className="menu-grid loading-overlay">
          {menu.map(dish => (
            <PlatoCard
              key={dish.idMeal}
              dish={dish}
              onUpdate={onUpdateDish}
              onDelete={onDeleteDish}
            />
          ))}
          <div className="loading-banner">
            <span className="spinner-small"></span>
            <p>Actualizando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-pizarra">
      <div className="menu-header">
        <div className="header-left">
          <h2>Menu de Cocina Chilena</h2>
          <span className="plato-count">{menu.length} platos</span>
        </div>
        <button 
          className={`btn-add ${showAddForm ? 'active' : ''}`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cerrar' : 'Agregar Plato'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="add-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dishName">Nombre del Plato *</label>
              <input
                id="dishName"
                type="text"
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                placeholder="Ej: Pastel de Choclo"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dishPrice">Precio ($) *</label>
              <input
                id="dishPrice"
                type="number"
                value={newDishPrice}
                onChange={(e) => setNewDishPrice(e.target.value)}
                placeholder="Ej: 12500"
                min="0"
                step="100"
                required
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="dishImage">URL de Imagen (opcional)</label>
            <input
              id="dishImage"
              type="url"
              value={newDishImage}
              onChange={(e) => setNewDishImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Agregar al Menu
            </button>
            <button 
              type="button" 
              className="btn-cancel-form"
              onClick={() => {
                setShowAddForm(false);
                setNewDishName('');
                setNewDishPrice('');
                setNewDishImage('');
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {menu.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No hay platos en el menu</h3>
          <p>Agrega tu primer plato chileno usando el boton "Agregar Plato"</p>
          {onRetry && (
            <button onClick={onRetry} className="retry-button">
              Cargar platos desde la API
            </button>
          )}
        </div>
      ) : (
        <div className="menu-grid">
          {menu.map(dish => (
            <PlatoCard
              key={dish.idMeal}
              dish={dish}
              onUpdate={onUpdateDish}
              onDelete={onDeleteDish}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPizarra;