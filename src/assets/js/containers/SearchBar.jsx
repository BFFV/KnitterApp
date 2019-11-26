import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPatterns } from '../services/PatternApi';
import SearchBarComponent from '../components/SearchBar';

export default class SearchBar extends Component {
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
    await getPatterns(query);
  }

  render() {
    const { query } = this.state;
    return (
      <SearchBarComponent
        onQueryText={this.onQueryText}
        query={query}
      />
    );
  }
}

SearchBar.propTypes = {
  onQueryText: PropTypes.func.isRequired,
};
