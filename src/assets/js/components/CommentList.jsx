import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';
import CommentContainer from '../containers/Comment';

export default function CommentList(props) {
  const { items } = props;
  if (!items.length) {
    return (
      <div className="pattern-comments">
        <div className="comment-tittle">
          <h2>No hay comentarios!</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="pattern-comments">
      <div className="comment-tittle">
        <h2>Comentarios</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={`${faker.random.uuid()}`}>
            <CommentContainer
              content={item.attributes.content}
              commentId={item.attributes['comment-id']}
              authorId={item.attributes['author-id']}
              author={item.attributes.author}
              time={item.attributes.time}
              authorized={item.attributes.authorized}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

CommentList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
