import React, { Component } from 'react';
import { getPatterns } from '../services/PatternApi';
import SearchBoxComponent from '../components/SearchBox';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.mounted = false;

    this.loadPatterns = this.loadPatterns.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async loadPatterns(options) {
    const patterns = await getPatterns(options);
    if (this.mounted) {
      this.setState({ items: patterns });
    }
  }

  render() {
    const { items } = this.state;
    return (
      <SearchBoxComponent
        items={items}
        onRefreshPatterns={this.loadPatterns}
      />
    );
  }
}
