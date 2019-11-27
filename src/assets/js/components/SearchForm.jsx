/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

export default function SearchForm(props) {
  const {
    name, categories, materials, options, onQueryText,
    onCategoryChange, onSubmit, onCheck, onSort,
  } = props;
  return (
    <div className="pattern-search">
      <div className="search-content">
        <h2>Buscar Patrones</h2>
      </div>
      <div className="search-content">
        <form onSubmit={onSubmit}>
          <div className="search-name">
            <label className="pattern-font-form" htmlFor="name">Nombre:</label>
            <input type="text" name="name" onChange={onQueryText} value={name} />
          </div>
          <div className="search-select">
            <label className="pattern-font-form" htmlFor="category">Categoría:</label>
            <select name="category" onChange={onCategoryChange}>
              <option value="all">Todas</option>
              {categories.map((item) => (
                <option value={item.attributes.id}>{item.attributes.name}</option>
              ))}
            </select>
          </div>
          <div className="search-sorting">
            <label className="pattern-font-form" htmlFor="sorting">Ordenar por:</label>
            <select name="sorting" onChange={onSort}>
              {options.map((item) => (
                <option value={item.value}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="search-materials">
            <h3>Materiales:</h3>
            {materials.map((item) => (
              <div className="material-search-content">
                <div className="material-search-name">
                  <p className="material-search-name-para">{item.attributes.name}</p>
                </div>
                <input type="checkbox" name="materials" value={item.attributes.id} onChange={onCheck} />
              </div>
            ))}
          </div>
          <div className="button-search-container">
            <button className="search-button-form" type="submit">
              <i className="fas fa-search fa-1x" />
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

SearchForm.propTypes = {
  name: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onQueryText: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
};
