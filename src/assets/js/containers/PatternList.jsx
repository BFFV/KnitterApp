import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PatternListComponent from '../components/PatternList';

export default class PatternList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { onRefreshPatterns } = this.props;
    onRefreshPatterns({ name: '' });
  }

  render() {
    const {
      items, onRefreshPatterns,
    } = this.props;
    return (
      <PatternListComponent items={items} onRefreshPatterns={onRefreshPatterns} />
    );
  }
}

PatternList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
};
