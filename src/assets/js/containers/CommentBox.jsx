import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentBoxComponent from '../components/CommentBox';

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { serverData } = this.props;
    return (
      <CommentBoxComponent patternId={Number(serverData.patternId)} />
    );
  }
}

CommentBox.propTypes = {
  serverData: PropTypes.shape({
    patternId: PropTypes.string.isRequired,
  }).isRequired,
};
