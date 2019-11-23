import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { editComment, deleteComment } from '../services/CommentApi';
import CommentComponent from '../components/Comment';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      content, commentId, authorId, author, time, authorized,
    } = this.props;
    return (
      <CommentComponent
        content={content}
        commentId={commentId}
        authorId={authorId}
        author={author}
        time={time}
        authorized={authorized}
      />
    );
  }
}

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
};
