import React from 'react';
import ReactDOM from 'react-dom';
import Comment from './components/Comment';
/*
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import CommentBox from './components/CommentBox';
*/

const reactCommentContainer = document.getElementByClass('comment');
/*
const reactCommentListContainer = document.getElementByClass('pattern-comments');
const reactCommentFormContainer = document.getElementByClass('comment-pattern');
const reactCommentBoxContainer = document.getElementByClass('pattern-comment');
*/

if (reactCommentContainer) {
  ReactDOM.render(<Comment />, reactCommentContainer);
}

/*
if (reactCommentListContainer) {
  ReactDOM.render(<CommentList />, reactCommentListContainer);
}

if (reactCommentFormContainer) {
  ReactDOM.render(<CommentForm />, reactCommentFormContainer);
}

if (reactCommentBoxContainer) {
  ReactDOM.render(<CommentBox />, reactCommentBoxContainer);
}
*/
