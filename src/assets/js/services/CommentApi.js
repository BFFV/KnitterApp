// Gets comments from a particular pattern
export async function fetchComments(patternId) {
  const path = `/api/patterns/${patternId}/comments`;
  const commentList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return commentList.data;
}

// Updates a particular comment
export async function editComment(commentData) {
  const authData = await fetch('/api/auth', {
    method: 'get',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const { token } = authData;
  const { commentId } = commentData;
  const path = `/api/comments/${commentId}/edit`;
  return fetch(path, {
    method: 'PATCH',
    body: JSON.stringify(commentData),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}

// Deletes a particular comment
export async function deleteComment(commentId) {
  const authData = await fetch('/api/auth', {
    method: 'get',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const { token } = authData;
  const path = `/api/comments/${commentId}/delete`;
  return fetch(path, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}
