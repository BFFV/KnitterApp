//Get all patterns by namequery
export async function getPatterns(query) {
  const path = `/api/patterns/?name=${query}`;
  console.log(query)
  const patternList = await fetch(path, { headers: { Accept: 'application/json' } })
    .then((res) => res.json());
  return patternList.data;
}