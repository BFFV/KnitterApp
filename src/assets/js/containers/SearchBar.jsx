import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPatterns } from '../services/PatternApi';
import CommentFormComponent from '../components/SearchBar';

export default class CommentForm extends SearchBar {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };

    this.onQueryText = this.onQueryText.bind(this);
  }

  async onQueryText(event) {
    const query = event.target.value;
    this.setState({ query });
    event.preventDefault();
    await postComment({ query });
  }

  render() {
    const { query } = this.state;
    return (
      <CommentFormComponent
        onQueryText={this.onQueryText}
        query={query}
      />
    );
  }
}

CommentForm.propTypes = {
  query: PropTypes.string.isRequired,
};
