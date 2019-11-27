import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchFormComponent from '../components/SearchForm';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };

    this.onQueryText = this.onQueryText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async onQueryText(event) {
    const { onRefreshPatterns } = this.props;
    const name = event.target.value;
    this.setState({ name });
    onRefreshPatterns({ name });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { onRefreshPatterns } = this.props;
    const { name } = this.state;
    onRefreshPatterns({ name });
  }

  render() {
    const { name } = this.state;
    return (
      <SearchFormComponent
        onQueryText={this.onQueryText}
        onSubmit={this.handleSubmit}
        name={name}
      />
    );
  }
}

SearchForm.propTypes = {
  onRefreshPatterns: PropTypes.func.isRequired,
};
