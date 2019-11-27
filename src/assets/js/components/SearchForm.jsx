/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

export default function SearchForm(props) {
  const {
    name, onQueryText, onSubmit,
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
  onQueryText: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
