import React from 'react';
import PropTypes from 'prop-types';
import CommentFormContainer from '../containers/CommentForm';
import CommentListContainer from '../containers/CommentList';

export default function CommentBox(props) {
  const {
    patternId, user, refresh, onRefresh, onPostComment,
  } = props;
  if (user) {
    return (
      <div className="pattern-comment">
        <CommentFormContainer patternId={patternId} onPostComment={onPostComment} />
        <CommentListContainer patternId={patternId} refresh={refresh} onRefresh={onRefresh} />
      </div>
    );
  }
  return (
    <div className="pattern-comment">
      <CommentListContainer patternId={patternId} refresh={refresh} onRefresh={onRefresh} />
    </div>
  );
}

CommentBox.propTypes = {
  patternId: PropTypes.number.isRequired,
  user: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onPostComment: PropTypes.func.isRequired,
};
