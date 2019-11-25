import React from 'react';
import PropTypes from 'prop-types';

export default function SearchBar(props) {
	const { onQueryText, query }
	return (
		<div class="search-content">
		  <form>
		    <div class="search-name">
		      <label class="pattern-font-form" for="name">Nombre:</label>
		      <input type="text" name="name" onChange={onQueryText} value={query}/>
		    </div>
		  </form>
		</div>
	);
}

SearchBar.propTypes = {
	onQueryText: PropTypes.func.isRequired,
	query: PropTypes.string.isRequired,
};