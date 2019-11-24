import React from 'react';
import PropTypes from 'prop-types';
import CommentFormContainer from '../containers/CommentForm';
import CommentListContainer from '../containers/CommentList';

export default function CommentBox(props) {
  const { patternId, user } = props;
  if (user) {
    return (
      <div className="pattern-comment">
        <CommentFormContainer patternId={patternId} />
        <CommentListContainer patternId={patternId} />
      </div>
    );
  }
  return (
    <div className="pattern-comment">
      <CommentListContainer patternId={patternId} />
    </div>
  );
}

CommentBox.propTypes = {
  patternId: PropTypes.number.isRequired,
  user: PropTypes.bool.isRequired,
};
