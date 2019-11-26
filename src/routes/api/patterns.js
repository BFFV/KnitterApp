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

async function searchPatterns(ctx, next) {
  const params = ctx.request.query;
  ctx.state.materials = await ctx.orm.material.findAll();
  ctx.state.categories = await ctx.orm.category.findAll();
  let patterns = [];
  if (params.name) {
    patterns = await ctx.orm.pattern.findAll({
      where: { name: { [ctx.orm.Sequelize.Op.iLike]: `%${params.name}%` } },
    });
  }
  if ((params.category === 'all') || !params.category) {
    if (!params.name) {
      patterns = await ctx.orm.pattern.findAll();
    }
  } else if (!params.name) {
    patterns = await ctx.orm.pattern.findAll({
      where: { categoryId: params.category },
    });
  } else {
    patterns = patterns.filter((pattern) => pattern.categoryId.toString() === params.category);
  }
  ctx.state.patternsList = patterns;
  if (params.materials) {
    ctx.state.patternsList = [];
    if (typeof (params.materials) === 'string') {
      params.materials = [params.materials];
    }
    const asyncMaterials = [];
    patterns.forEach((pattern) => asyncMaterials.push(pattern.getMaterials()));
    const patternMaterials = await Promise.all(asyncMaterials);
    patterns.forEach((pattern) => {
      const searchMaterials = params.materials;
      let materials = patternMaterials.shift();
      materials = materials.map((material) => material.id.toString());
      if (!searchMaterials.filter((x) => !materials.includes(x)).length) {
        ctx.state.patternsList.push(pattern);
      }
    });
  }
  if (params.sorting === 'rating') {
    ctx.state.patternsList.sort((a, b) => a.score - b.score).reverse();
  } else if (params.sorting === 'popular') {
    ctx.state.patternsList.sort((a, b) => a.popularity - b.popularity).reverse();
  } else {
    ctx.state.patternsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  }
  if (params.sorting) {
    ctx.state.sorting = params.sorting;
  }
  if (params.category) {
    ctx.state.category = parseInt(params.category, 10);
  }
  return next();
}

router.get('api.patterns', '/', searchPatterns, async (ctx) => {
  try {
    const patterns = ctx.state.patternsList;
    ctx.body = ctx.jsonSerializer('patterns', {
      attributes: ['id', 'name', 'score', 'image', 'popularity'],
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