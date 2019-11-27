// Search Patterns
export async function getPatterns(query) {
  let path = '/api/patterns/';
  let prefix = '?';
  Object.keys(query).forEach((key) => {
    if (key === 'materials') {
      query[key].forEach((material) => {
        path += `${prefix}${key}=${material}`;
        if (prefix === '?') {
          prefix = '&';
        }
      });
    } else {
      path += `${prefix}${key}=${query[key]}`;
      if (prefix === '?') {
        prefix = '&';
      }
    }
  });
  const patternList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return patternList.data;
}

// Deletes a particular pattern
export async function deletePattern(patternId) {
  const authData = await fetch('/api/auth', {
    method: 'get',
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const { token } = authData;
  const path = `/api/patternsAuth/${patternId}/delete`;
  return fetch(path, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}
