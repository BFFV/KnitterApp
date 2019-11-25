import React from 'react';
import PropTypes from 'prop-types';

export default function Pattern(props) {
  const {
    keyData, id, name, score, image, popularity, authorized, onEdit, onDelete, state,
  } = props;
  const patternPath = `/patterns/${id}`;
  let buttons = '';
  if (authorized) {
    buttons = (
      <div>
        <button className="edit-material" type="button" onClick={onEdit}>
          <i className="fas fa-pen" />
        </button>
        <button className="delete-material" type="button" onClick={onDelete}>
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    );
  }
  return (
    <div className="pattern-search-container" key={keyData}>
      <img className="photo" src={image}>
        <a class="pattern-font-tittle" href={patternPath}>{name}</a>
        <a class="pattern-font">Puntaje:{score}/5</a>
        <a class="pattern-font">Popularidad:{popularity}</a> 
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
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};
