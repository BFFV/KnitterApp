import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPatterns } from '../services/PatternApi';
import SearchBoxComponent from '../components/SearchBox';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };

    this.loadPatterns = this.loadPatterns.bind(this);
  }

  async loadPatterns(options) {
    const patterns = await getPatterns(options);
    this.setState({ items: patterns });
  }

  render() {
    const { serverData } = this.props;
    const { items } = this.state;
    return (
      <SearchBoxComponent
        items={items}
        onRefreshPatterns={this.loadPatterns}
        defaultName={serverData.defaultName}
      />
    );
  }
}

SearchBox.propTypes = {
  serverData: PropTypes.shape({
    defaultName: PropTypes.string.isRequired,
  }).isRequired,
};
