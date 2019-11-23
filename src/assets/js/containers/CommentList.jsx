import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchComments } from '../services/CommentApi';
import CommentListComponent from '../components/CommentList';

export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
    };
    this.loadComments = this.loadComments.bind(this);
  }

  componentDidMount() {
    this.loadComments();
    // setInterval(this.loadComments, 10000);
  }

  async loadComments() {
    const { patternId } = this.props;
    this.setState({ loading: true });
    const comments = await fetchComments(patternId);
    this.setState({ items: comments, loading: false });
  }

  render() {
    const {
      loading, items,
    } = this.state;
    let msg = '';
    if (loading) {
      msg = 'Cargando Comentarios...';
    }
    return (
      <div>
        <CommentListComponent items={items} />
        <h3>{msg}</h3>
      </div>
    );
  }
}

CommentList.propTypes = {
  patternId: PropTypes.number.isRequired,
};
