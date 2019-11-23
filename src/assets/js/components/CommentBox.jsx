import React from 'react';
import PropTypes from 'prop-types';
// import CommentFormContainer from '../containers/CommentForm';
import CommentListContainer from '../containers/CommentList';

export default function CommentBox(props) {
  const { patternId } = props;
  return (
    <div className="pattern-comment">
      <CommentListContainer patternId={patternId} />
    </div>
  );
}

CommentBox.propTypes = {
  patternId: PropTypes.number.isRequired,
};
