import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getUser, fetchComments } from '../services/CommentApi';
import CommentBoxComponent from '../components/CommentBox';

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,
      items: [],
    };
    this.mounted = false;

    this.checkUser = this.checkUser.bind(this);
    this.loadComments = this.loadComments.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.checkUser();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async checkUser() {
    const user = await getUser();
    if (this.mounted) {
      this.setState({ user: false });
    }
    if (user && this.mounted) {
      this.setState({ user: true });
    }
  }

  async loadComments() {
    const { serverData } = this.props;
    const { patternId } = serverData;
    const comments = await fetchComments(patternId);
    if (this.mounted) {
      this.setState({ items: comments });
    }
  }

  render() {
    const { user, items } = this.state;
    const { serverData } = this.props;
    return (
      <CommentBoxComponent
        items={items}
        patternId={Number(serverData.patternId)}
        user={user}
        onRefreshComments={this.loadComments}
      />
    );
  }
}

CommentBox.propTypes = {
  serverData: PropTypes.shape({
    patternId: PropTypes.string.isRequired,
  }).isRequired,
};
