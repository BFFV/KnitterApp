import React, { Component } from 'react';
// import postsService from '../services/posts';
import CommentComponent from '../components/Comment';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: '',
      body: '',
    };

    this.fetchNewPost = this.fetchNewPost.bind(this);
  }

  componentDidMount() {
    this.fetchNewPost();
  }

  async fetchNewPost() {
    this.setState({ loading: true });
    // const newPost = await postsService.getRandomPost();
    // this.setState({ title: newPost.title, body: newPost.body, loading: false });
  }

  render() {
    const {
      loading, title, body, fetchNewPost,
    } = this.state;
    if (loading) {
      return <p>Loading....</p>;
    }

    return (
      <CommentComponent
        title={title}
        body={body}
        onNewPost={fetchNewPost}
      />
    );
  }
}
