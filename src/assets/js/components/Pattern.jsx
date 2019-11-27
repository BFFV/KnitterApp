/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

export default function Pattern(props) {
  const {
    keyData, id, name, score, image, popularity, authorized, onEdit, onDelete,
  } = props;
  const patternPath = `/patterns/${id}`;
  let buttons = '';
  if (authorized) {
    buttons = (
      <div className="edit-and-delete-pattern">
        <button className="edit-pattern" type="button" onClick={onEdit}>
          <i className="fas fa-pen" />
        </button>
        <button className="delete-pattern" type="button" onClick={onDelete}>
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    );
  }
  return (
    <div className="pattern-search-container" key={keyData}>
      <img className="photo" src={image} alt="Pattern" />
      <a className="pattern-font-tittle" href={patternPath}>{name}</a>
      <a className="pattern-font">
        Puntaje:
        {score}
        /5
      </a>
      <a className="pattern-font">
        Popularidad:
        {popularity}
      </a>
      {buttons}
    </div>
  );
}

Pattern.propTypes = {
  keyData: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  popularity: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
