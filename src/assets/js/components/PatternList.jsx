import React from 'react';
import PropTypes from 'prop-types';
import PatternContainer from '../containers/Pattern';

export default function PatternList(props) {
  const { items, onRefreshPatterns } = props;
  if (!items.length) {
    return (
      <div className="patterns-list">
        <div className="pattern-content">
          <h2>No hay patrones!</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="patterns-list">
      <div className="pattern-content">
        <h2>Patrones Encontrados</h2>
      </div>
      {items.map((item) => (
        <PatternContainer
          keyData={keyData}
          id={id}
          name={name}
          score={score}
          image={image}
          popularity={popularity}
          authorized={authorized}
        />
      ))}
    </div>
  );
}

PatternList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
