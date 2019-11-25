const KoaRouter = require('koa-router');

const router = new KoaRouter();

function updatedTime(date1, date2) {
  let difference = date2 - date1;
  let time;
  const daysDifference = Math.floor(difference / 1000 / 86400);
  difference -= daysDifference * 1000 * 86400;
  const hoursDifference = Math.floor(difference / 1000 / 3600);
  difference -= hoursDifference * 1000 * 3600;
  const minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;
  if (daysDifference > 1) {
    time = `Hace ${daysDifference} días`;
  } else if (daysDifference === 1) {
    time = `Hace ${daysDifference} día`;
  } else if (hoursDifference > 1) {
    time = `Hace ${hoursDifference} horas`;
  } else if (hoursDifference === 1) {
    time = `Hace ${hoursDifference} hora`;
  } else if (minutesDifference > 1) {
    time = `Hace ${minutesDifference} minutos`;
  } else if (minutesDifference === 1) {
    time = `Hace ${minutesDifference} minuto`;
  } else {
    time = 'Hace unos segundos';
  }
  return time;
}

router.get('api.patterns', '/', async (ctx) => {
  try {
    const { params } = ctx.params;
    const patternsList = await ctx.orm.patterns.findAll({ where: { name: { [ctx.orm.Sequelize.Op.iLike]: `%${params.name}%` }}});
    const patterns = patternsList.map((c, i) => {
      const newObj = {};
      newObj.id = c.id.toString();
      newObj.name = c.name;
      newObj.score = c.score.toString();
      newObj.image = c.image;
      newObj.popularity = c.popularity.toString();
      newObj.authorized = false;
      const { currentUser } = ctx.state;
      if ((currentUser) && ((currentUser.id === c.authorId) || (currentUser.role === 'admin'))) {
        newObj.authorized = true;
      }
      return newObj;
      });
      ctx.body = ctx.jsonSerializer('patterns', {
        attributes: ['id', 'name', 'score', 'image', 'popularity', 'authorized'],
        topLevelLinks: {
          self: `${ctx.origin}${ctx.router.url('api.patterns')}`,
        },
      }).serialize(patterns);
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos');
  }
});

router.get('api.patterns.comments', '/:id/comments', async (ctx) => {
  try {
    const pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
    const commentList = await pattern.getComments();
    commentList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
    const commentUsers = commentList.map((c) => c.getUser());
    const userList = await Promise.all(commentUsers);
    const date = new Date();
    const patternComments = commentList.map((c, i) => {
      const newObj = {};
      newObj.content = c.content;
      newObj.commentId = c.id.toString();
      newObj.authorId = userList[i].id.toString();
      newObj.author = userList[i].username;
      newObj.time = updatedTime(c.updatedAt, date);
      newObj.authorized = false;
      const { currentUser } = ctx.state;
      if ((currentUser) && ((currentUser.id === c.userId) || (currentUser.role === 'admin'))) {
        newObj.authorized = true;
      }
      return newObj;
    });
    ctx.body = ctx.jsonSerializer('commentdata', {
      attributes: ['content', 'commentId', 'authorId', 'author', 'time', 'authorized'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
      },
    }).serialize(patternComments);
  } catch (validationError) {
    ctx.throw(400, 'Parámetros Inválidos!');
  }
});

module.exports = router;