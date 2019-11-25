
//Get all patterns by namequery
export async function fetchComments(query) {
  const path = `/api/patterns/${query}`;
  const patternList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return patternList.data;
}