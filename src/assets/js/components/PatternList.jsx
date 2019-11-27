import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';
import PatternContainer from '../containers/Pattern';

export default function PatternList(props) {
  const { items, onRefreshPatterns } = props;
  if (!items.length) {
    return (
      <div className="patterns-list">
        <h2>Patrones Encontrados</h2>
        <div className="pattern-content">
          <h2>No hay patrones!</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="patterns-list">
      <h2>Patrones Encontrados</h2>
      <div className="pattern-content">
        {items.map((item) => (
          <PatternContainer
            keyData={`${faker.random.uuid()}`}
            id={item.attributes.id}
            name={item.attributes.name}
            score={item.attributes.score}
            image={item.attributes.image}
            popularity={item.attributes.popularity}
            authorized={item.attributes.authorized}
            onRefreshPatterns={onRefreshPatterns}
          />
        ))}
      </div>
    </div>
  );
}

PatternList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
};
