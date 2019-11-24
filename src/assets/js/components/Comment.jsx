import React from 'react';
import PropTypes from 'prop-types';

export default function Comment(props) {
  const {
    keyData, content, editable, authorId, author, time, authorized, onEdit,
    onUpdate, onDelete, onContentChange, state,
  } = props;
  const authorPath = `/users/${authorId}`;
  if (state === 'show') {
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
      <div className="comment" key={keyData}>
        <div className="comment-item">
          <p className="pattern-font"><a className="pattern-font-tittle" href={authorPath}>{author}</a></p>
          <p className="pattern-font">{content}</p>
          <p className="pattern-font">{time}</p>
        </div>
        {buttons}
      </div>
    );
  }
  return (
    <form onSubmit={onUpdate}>
      <div className="panel">
        <textarea rows="8" cols="24" type="text" onChange={onContentChange} value={editable} required />
        <input className="update-button" type="submit" value="Actualizar" />
      </div>
    </form>
  );
}

Comment.propTypes = {
  keyData: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  editable: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};
