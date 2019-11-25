import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';
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
          keyData={`${faker.random.uuid()}`}
          content={item.attributes.content}
          commentId={item.attributes['comment-id']}
          authorId={item.attributes['author-id']}
          author={item.attributes.author}
          time={item.attributes.time}
          authorized={item.attributes.authorized}
          onRefreshComments={onRefreshComments}
        />
      ))}
    </div>
  );
}

PatternList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
};
