import React from 'react';
import PropTypes from 'prop-types';
import SearchFormContainer from '../containers/SearchForm';
import PatternListContainer from '../containers/PatternList';

export default function SearchBox(props) {
  const {
    items, onRefreshPatterns, defaultName,
  } = props;
  return (
    <div className="pattern-body">
      <SearchFormContainer onRefreshPatterns={onRefreshPatterns} defaultName={defaultName} />
      <PatternListContainer items={items} onRefreshPatterns={onRefreshPatterns} />
    </div>
  );
}

SearchBox.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
  defaultName: PropTypes.string.isRequired,
};
