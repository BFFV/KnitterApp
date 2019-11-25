import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { editPattern, deletePattern } from '../services/PatternApi';
import PatternComponent from '../components/Pattern';

export default class Pattern extends Component {
  constructor(props) {
    super(props);
   

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit() {
    const { patternId, onRefreshPatterns } = this.props;
    await editPattern(patternId);
    onRefreshPatterns();
  }

  async handleDelete() {
    const { patternId, onRefreshPatterns } = this.props;
    await deletePattern(patternId);
    onRefreshPatterns();
  }

  render() {
    const {
      patternId, name, score, image, authorized, keyData,
    } = this.props;
    return (
      <PatternComponent
        keyData={keyData}
        patternId={patternId}
        name={name}
        score={score}
        image={image}
        authorized={authorized}
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
        onContentChange={this.handleContentChange}
      />
    );
  }
}

Pattern.propTypes = {
  keyData: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  patternId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  onRefreshPatterns: PropTypes.func.isRequired,
};
