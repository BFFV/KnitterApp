import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { postComment } from '../services/CommentApi';
import CommentFormComponent from '../components/CommentForm';

export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(event) {
    const content = event.target.value;
    this.setState({ content });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { patternId } = this.props;
    const { content } = this.state;
    await postComment({ content, patternId });
    this.setState({
      content: '',
    });
  }

  render() {
    return (
      <CommentFormComponent
        onSubmitComment={this.handleSubmit}
        onContentChange={this.handleContentChange}
      />
    );
  }
}

CommentForm.propTypes = {
  patternId: PropTypes.number.isRequired,
};
