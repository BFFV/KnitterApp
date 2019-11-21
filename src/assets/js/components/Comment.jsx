import React from 'react';
import PropTypes from 'prop-types';

export default function Comment(props) {
  const { onNewPost, title, body } = props;
  return (
    <div>
      <button type="button" onClick={onNewPost}>Load post</button>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

Comment.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onNewPost: PropTypes.func.isRequired,
};
