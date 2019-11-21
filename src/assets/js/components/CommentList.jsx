import React from 'react';
import PropTypes from 'prop-types';

export default function CommentList(props) {
  const { items, onDelete } = props;
  return (
    <ul>
      { items.map((item, idx) => (
        <li key={`${1}`}>
          {item}
          <button value={idx} type="button" onClick={onDelete}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

CommentList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired,
};
