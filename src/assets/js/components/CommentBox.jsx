import React from 'react';
import PropTypes from 'prop-types';
import CommentFormContainer from '../containers/CommentForm';
import CommentListContainer from '../containers/CommentList';

export default function CommentBox(props) {
  const {
    items, patternId, user, onRefreshComments,
  } = props;
  if (user) {
    return (
      <div className="pattern-comment">
        <CommentFormContainer patternId={patternId} onRefreshComments={onRefreshComments} />
        <CommentListContainer items={items} onRefreshComments={onRefreshComments} />
      </div>
    );
  }
  return (
    <div className="pattern-comment">
      <CommentListContainer items={items} onRefreshComments={onRefreshComments} />
    </div>
  );
}

CommentBox.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  patternId: PropTypes.number.isRequired,
  user: PropTypes.bool.isRequired,
  onRefreshComments: PropTypes.func.isRequired,
};
