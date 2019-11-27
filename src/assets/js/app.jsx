import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './containers/CommentBox';
import SearchBox from './containers/SearchBox';

const reactCommentBoxContainer = document.getElementById('comment-box');

if (reactCommentBoxContainer) {
  ReactDOM.render(<CommentBox serverData={reactCommentBoxContainer.dataset} />,
    reactCommentBoxContainer);
}

const reactSearchBoxContainer = document.getElementById('search-box');

if (reactSearchBoxContainer) {
  ReactDOM.render(<SearchBox />,
    reactSearchBoxContainer);
}
