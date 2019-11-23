const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('api.users.post.comment', '/comments', async (ctx) => {
  console.log('pooooooooooooooooooooooooost');
  /*
  // middlewares para validación/auth
  // Postear comentario
  // Si no está autorizado tirar error 403
  // Si esta mal validado tirar error 400
  ctx.body = ctx.jsonSerializer('commentdata', {
    attributes: ['content', 'authorId', 'author', 'time', 'authorized'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
    },
  }).serialize(patternComments);
  */
});

router.patch('api.users.edit.comment', '/comments/:id/edit', async (ctx) => {
  /*
  // middlewares para validación/auth
  // Editar comentario
  // Si no está autorizado tirar error 403
  // Si esta mal validado tirar error 400
  ctx.body = ctx.jsonSerializer('commentdata', {
    attributes: ['content', 'authorId', 'author', 'time', 'authorized'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
    },
  }).serialize(patternComments);
  */
});

router.del('api.users.delete.comment', '/comments/:id/delete', async (ctx) => {
  /*
  // middlewares para validación/auth
  // Eliminar comentario
  // Si no está autorizado tirar error 403
  // Si esta mal validado tirar error 400
  ctx.body = ctx.jsonSerializer('commentdata', {
    attributes: ['content', 'authorId', 'author', 'time', 'authorized'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
    },
  }).serialize(patternComments);
  */
});

module.exports = router;
