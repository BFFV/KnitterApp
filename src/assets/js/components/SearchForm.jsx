/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';


export default function SearchForm(props) {
  const {
    name, category, categories, onQueryText, onCategoryChange, onSubmit,
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
            <select name="category" value={category} onChange={onCategoryChange}>
              <option value="all">Todas</option>
              {categories.map((item) => (
                <option value={item.name}>{item.name.toUpperCase()}</option>
              ))}
            </select>
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
  category: PropTypes.string.isRequired,
  onQueryText: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
