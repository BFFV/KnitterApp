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

router.get('api.patterns.comments', '/:id/comments', async (ctx) => {
  const pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  const commentList = await pattern.getComments();
  commentList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  const commentUsers = commentList.map((c) => c.getUser());
  const userList = await Promise.all(commentUsers);
  const date = new Date();
  const patternComments = commentList.map((c, i) => {
    const newObj = {};
    newObj.content = c.content;
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
    attributes: ['content', 'authorId', 'author', 'time', 'authorized'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.patterns.comments', { id: ctx.params.id })}`,
    },
  }).serialize(patternComments);
});

module.exports = router;
