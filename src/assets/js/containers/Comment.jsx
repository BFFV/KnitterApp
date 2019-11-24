import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { editComment, deleteComment } from '../services/CommentApi';
import CommentComponent from '../components/Comment';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: '',
      state: 'show',
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleEdit() {
    const { content } = this.props;
    this.setState({ state: 'edit', editable: content });
  }

  handleContentChange(event) {
    const editable = event.target.value;
    this.setState({ editable });
  }

  async handleUpdate(event) {
    event.preventDefault();
    const { commentId, onRefreshComments } = this.props;
    const { editable } = this.state;
    await editComment({ commentId, content: editable });
    this.setState({ state: 'show' });
    onRefreshComments();
  }

  async handleDelete() {
    const { commentId, onRefreshComments } = this.props;
    await deleteComment(commentId);
    onRefreshComments();
  }

  render() {
    const {
      content, commentId, authorId, author, time, authorized, keyData,
    } = this.props;
    const { editable, state } = this.state;
    return (
      <CommentComponent
        keyData={keyData}
        content={content}
        editable={editable}
        commentId={commentId}
        authorId={authorId}
        author={author}
        time={time}
        authorized={authorized}
        onEdit={this.handleEdit}
        onUpdate={this.handleUpdate}
        onDelete={this.handleDelete}
        onContentChange={this.handleContentChange}
        state={state}
      />
    );
  }
}

Comment.propTypes = {
  keyData: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  onRefreshComments: PropTypes.func.isRequired,
};
