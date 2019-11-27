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

// Gets the materials needed for Pattern Search
export async function getMaterials() {
  const path = '/api/materials/';
  const materialsList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return materialsList.data;
}

// Gets the categories needed for Pattern Search
export async function getCategories() {
  const path = '/api/categories/';
  const categoriesList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return categoriesList.data;
}
