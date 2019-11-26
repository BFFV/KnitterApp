import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './containers/CommentBox';
import SearchBar from './containers/Searchbar';

const reactCommentBoxContainer = document.getElementById('comment-box');

if (reactCommentBoxContainer) {
  ReactDOM.render(<CommentBox serverData={reactCommentBoxContainer.dataset} />,
    reactCommentBoxContainer);
}

const reactSearchBarContainer = document.getElementById('search-bar');

if (reactSearchBarContainer) {
	ReactDOM.render(<SearchBar/>,
	reactSearchBarContainer)
}
