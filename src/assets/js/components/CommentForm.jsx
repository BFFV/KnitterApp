import React from 'react';
import PropTypes from 'prop-types';

export default function CommentForm(props) {
  const { onSubmitComment, onContentChange } = props;
  return (
    <div className="comment-pattern">
      <h2>Comentar</h2>
      <form onSubmit={onSubmitComment}>
        <div className="panel">
          <textarea rows="8" cols="47" type="text" onChange={onContentChange} required />
          <input className="create-button" type="submit" value="Comentar" />
        </div>
      </form>
    </div>
  );
}

CommentForm.propTypes = {
  onSubmitComment: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
};
