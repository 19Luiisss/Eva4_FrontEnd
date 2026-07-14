import React, { useState } from 'react';
import './PlatoCard.css';

const PlatoCard = ({ dish, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(dish.precio.toString());

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const success = onUpdate(dish.idMeal, editPrice);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditPrice(dish.precio.toString());
    setIsEditing(false);
  };

  return (
    <div className={`plato-card ${!dish.disponible ? 'indisponible' : ''}`}>
      <div className="plato-card-image">
        <img 
          src={dish.strMealThumb} 
          alt={dish.strMeal}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
          }}
        />
        <span className={`disponibilidad-badge ${dish.disponible ? 'disponible' : 'no-disponible'}`}>
          {dish.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      <div className="plato-card-content">
        <h3 className="plato-nombre">{dish.strMeal}</h3>
        
        <div className="plato-detalles">
          <span className="plato-categoria">{dish.categoria || 'Plato Chileno'}</span>
          <span className="plato-fecha">{new Date(dish.fechaAgregado).toLocaleDateString('es-CL')}</span>
        </div>

        <div className="plato-precio-container">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="edit-input-group">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="0"
                  step="100"
                  className="edit-input"
                  autoFocus
                />
              </div>
              <div className="edit-actions">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="precio-display">
              <span className="precio-valor">${dish.precio.toLocaleString('es-CL')}</span>
              <div className="card-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => setIsEditing(true)}
                  aria-label="Editar precio"
                >
                  Editar
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => onDelete(dish.idMeal)}
                  aria-label="Eliminar plato"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatoCard;