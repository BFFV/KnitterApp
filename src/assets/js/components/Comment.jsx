import React from 'react';
import PropTypes from 'prop-types';

export default function Comment(props) {
  const {
    content, commentId, authorId, author, time, authorized,
  } = props;
  const authorPath = `/users/${authorId}`;
  let buttons = '';
  if (authorized) {
    buttons = (
      <div>
        <button className="edit-material" type="button">
          <i className="fas fa-pen" />
        </button>
        <button className="delete-material" type="button">
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    );
  }
  return (
    <div className="comment">
      <div className="comment-item">
        <p className="pattern-font"><a className="pattern-font-tittle" href={authorPath}>{author}</a></p>
        <p className="pattern-font">{content}</p>
        <p className="pattern-font">{time}</p>
      </div>
      {buttons}
    </div>
  );
}

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
};
