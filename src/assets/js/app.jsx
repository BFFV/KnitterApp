import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './containers/CommentBox';

const reactCommentBoxContainer = document.getElementById('comment-box');

if (reactCommentBoxContainer) {
  ReactDOM.render(<CommentBox serverData={reactCommentBoxContainer.dataset} />,
    reactCommentBoxContainer);
}

const reactSearchBarContainer = document.getElementById('search-bar');

if (reactSearchBarContainer) {
	ReactDOM.render(<SearchBar serverData={reactSearchBarContainer.dataset} />,
	reactSearchBarContainer)
}
