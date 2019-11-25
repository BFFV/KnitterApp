const JSONAPISerializer = require('jsonapi-serializer').Serializer;

function apiUrl(ctx, ...params) {
  return `${ctx.origin}${ctx.router.url(...params)}`;
}

module.exports = ctx => new JSONAPISerializer('patterns', {
  attributes: ['id', 'name', 'score', 'image', 'popularity', 'ngo', 'createdAt'],
  ngo: {
    ref: 'id',
    included: true,
    attributes: ['name', 'logo'],
  },
  topLevelLinks: {
    self: data => (Array.isArray(data)
      ? apiUrl(ctx, 'patterns', data[0].ngo.id)
      : apiUrl(ctx, 'patterns-show', data.ngo.id, data.id)),
  },