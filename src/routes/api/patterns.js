
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.patterns.comments', '/:id/comments', async (ctx) => {
  const pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  const commentsList = await pattern.getComments();
  ctx.body = ctx.jsonSerializer('comment', {
    attributes: ['content', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
    },
  }).serialize(commentsList);
});

module.exports = router;
