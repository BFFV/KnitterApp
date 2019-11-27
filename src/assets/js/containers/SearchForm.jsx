import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchFormComponent from '../components/SearchForm';
import { getCategories } from '../services/PatternApi';
import faker from 'faker';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      category: '',
      categories: [],
    };

    this.onQueryText = this.onQueryText.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  async loadCategories() {
    const categories = await getCategories();
    console.log(categories);
    this.setState({ 'categories': categories });
  }

  async onQueryText(event) {
    const { onRefreshPatterns } = this.props;
    const name = event.target.value;
    this.setState({ name });
    onRefreshPatterns({ name });
  }

  async onCategoryChange(event)       {
    const { onRefreshPatterns } = this.props;
    const category = event.target.value;
    this.setState({ category });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { onRefreshPatterns } = this.props;
    const { name } = this.state;
    onRefreshPatterns({ name });
  }

  render() {
    const { name, category, categories, onCategoryChange } = this.state;
    return (
      <SearchFormComponent
        onQueryText={this.onQueryText}
        onSubmit={this.handleSubmit}
        onCategoryChange={this.onCategoryChange}
        name={name}
        category={category}
        categories={categories}
      />
    );
  }
}

SearchForm.propTypes = {
  onRefreshPatterns: PropTypes.func.isRequired,
};
