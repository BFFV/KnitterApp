import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentListComponent from '../components/CommentList';

export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: null,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    const { onRefreshComments } = this.props;
    onRefreshComments();
    if (this.mounted) {
      this.setState({ interval: setInterval(onRefreshComments, 5000) });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    const { interval } = this.state;
    clearInterval(interval);
  }

  render() {
    const {
      items, onRefreshComments,
    } = this.props;
    return (
      <CommentListComponent items={items} onRefreshComments={onRefreshComments} />
    );
  }
}

CommentList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefreshComments: PropTypes.func.isRequired,
};
