// Gets comments from a particular pattern
export async function fetchComments(patternId) {
  const path = `/api/patterns/${patternId}/comments`;
  const commentList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return commentList.data;
}

// a
export async function editComment(userData) {
  const path = '/';
  return fetch(path, {
    method: 'put',
    body: JSON.stringify(userData),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
    .then((res) => res.json());
}
