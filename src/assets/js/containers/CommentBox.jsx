import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentBoxComponent from '../components/CommentBox';
import { getUser } from '../services/CommentApi';

export default class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,
    };

    this.checkUser = this.checkUser.bind(this);
  }

  componentDidMount() {
    this.checkUser();
  }

  async checkUser() {
    const user = await getUser();
    this.setState({ user: false });
    if (user) {
      this.setState({ user: true });
    }
  }

  render() {
    const { user } = this.state;
    const { serverData } = this.props;
    return (
      <CommentBoxComponent patternId={Number(serverData.patternId)} user={user} />
    );
  }
}

CommentBox.propTypes = {
  serverData: PropTypes.shape({
    patternId: PropTypes.string.isRequired,
  }).isRequired,
};
