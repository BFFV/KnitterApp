
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.patterns.comments', '/patterns/:id/comments', async (ctx) => {

  const pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  const commentsList = await pattern.getComments();
  ctx.body = ctx.jsonSerializer('comment', {
    attributes: ['content', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments')}`,
    },
    /* dataLinks: {
      self: (dataset, comment) => `${ctx.origin}/api/comments/${comment.id}`,
    }, */
  }).serialize(commentsList);
});

module.exports = router;

/* router.get('api.course.show', '/:id', async (ctx) => {

  const course = await await ctx.orm.course.findById(ctx.params.id);
  ctx.body = ctx.jsonSerializer('course', {
    attributes: ['code', 'name', 'description'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.courses.list')}:id`,
    },
  }).serialize(course); }); */
