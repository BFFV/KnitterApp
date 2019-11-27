import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { deletePattern } from '../services/PatternApi';
import PatternComponent from '../components/Pattern';

export default class Pattern extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit(event) {
    event.preventDefault();
    const { id } = this.props;
    window.location.href = `/patterns/${id}/edit`;
  }

  async handleDelete() {
    // eslint-disable-next-line no-alert
    if (window.confirm('Estás seguro?')) {
      const { id, onRefreshPatterns } = this.props;
      await deletePattern(id);
      onRefreshPatterns({ name: '' });
    }
  }

  render() {
    const {
      id, name, score, image, popularity, authorized, keyData,
    } = this.props;
    return (
      <PatternComponent
        keyData={keyData}
        id={id}
        name={name}
        score={score}
        image={image}
        popularity={popularity}
        authorized={authorized}
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
      />
    );
  }
}

Pattern.propTypes = {
  keyData: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  popularity: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
};
