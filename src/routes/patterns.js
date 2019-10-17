const KoaRouter = require('koa-router');

const router = new KoaRouter();

// Loads a particular pattern
async function loadPattern(ctx, next) {
  ctx.state.pattern = await ctx.orm.pattern.findByPk(ctx.params.id);
  if (ctx.state.pattern) {
    ctx.state.access = 'protected';
    return next();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
  return 'Invalid Pattern!';
}

// Sets the materials used for a pattern
async function setMaterials(materials, pattern) {
  if (materials) {
    if (typeof (materials) === 'string') {
      const keys = [parseInt(materials, 10)];
      await pattern.setMaterials(keys);
    } else {
      const keys = materials.map(Number);
      await pattern.setMaterials(keys);
    }
  } else {
    await pattern.setMaterials([]);
  }
}

// Obtains the possible categories & materials for a new pattern
async function newPatternInfo(ctx) {
  const info = {};
  info.categoriesList = await ctx.orm.category.findAll();
  info.materialsList = await ctx.orm.material.findAll();
  return info;
}

// Checks if the current user has already voted/added/saved as favorite this pattern
async function checkState(ctx, next) {
  let votePath = ctx.router.url('vote_patterns.create');
  let addPath = ctx.router.url('user_patterns.add');
  let favoritePath = ctx.router.url('user_patterns.favorite');
  let vote = false;
  let userPattern = false;
  let favorite = false;
  if (ctx.state.currentUser) {
    vote = await ctx.orm.vote_pattern.findOne({
      where: {
        userId: ctx.state.currentUser.id,
        patternId: ctx.state.pattern.id,
      },
    });
    if (vote) {
      votePath = ctx.router.url('vote_patterns.update', { id: vote.id });
    }
    const userPatterns = await ctx.state.currentUser.getUsedPatterns()
      .then((patterns) => patterns.filter((x) => x.id === ctx.state.pattern.id));
    if (userPatterns.length) {
      addPath = ctx.router.url('user_patterns.delete');
      userPattern = true;
    }
    const favoritePatterns = await ctx.state.currentUser.getFavoritePatterns()
      .then((patterns) => patterns.filter((x) => x.id === ctx.state.pattern.id));
    if (favoritePatterns.length) {
      favoritePath = ctx.router.url('user_patterns.remove');
      favorite = true;
    }
  }
  ctx.state.votePattern = vote;
  ctx.state.votePath = votePath;
  ctx.state.addPath = addPath;
  ctx.state.userPattern = userPattern;
  ctx.state.favoritePath = favoritePath;
  ctx.state.favorite = favorite;
  return next();
}

// Gets the time since a comment has been updated
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

// Searches for patterns
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
  if (params.sorting === 'popular') {
    ctx.state.patternsList.sort((a, b) => a.score - b.score).reverse();
  } else {
    ctx.state.patternsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  }
  return next();
}

// Protects routes from unauthorized access
async function authenticate(ctx, next) {
  const current = ctx.state.currentUser;
  if (ctx.state.access === 'protected') {
    if ((current) && ((current.role === 'admin') || (current.id === ctx.state.pattern.authorId))) {
      return next();
    }
  } else if (current) {
    return next();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
  return 'Unauthorized Access!';
}

router.get('patterns.list', '/', searchPatterns, async (ctx) => {
  const {
    patternsList, materials, categories,
  } = ctx.state;
  await ctx.render('patterns/index', {
    materials,
    categories,
    patternsList,
    patternsPath: ctx.router.url('patterns.list'),
    newPatternPath: ctx.router.url('patterns.new'),
    patternPath: (pattern) => ctx.router.url('patterns.show', { id: pattern.id }),
    editPatternPath: (pattern) => ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: (pattern) => ctx.router.url('patterns.delete', { id: pattern.id }),
    rootPath: '/',
  });
});

router.get('patterns.new', '/new', authenticate, async (ctx) => {
  const pattern = ctx.orm.pattern.build();
  const { categoriesList, materialsList } = await newPatternInfo(ctx);
  const materials = [];
  await ctx.render('patterns/new', {
    pattern,
    categoriesList,
    materials,
    materialsList,
    patternsPath: ctx.router.url('patterns.list'),
    submitPatternPath: ctx.router.url('patterns.create'),
  });
});

router.get('patterns.edit', '/:id/edit', loadPattern, authenticate, async (ctx) => {
  if (!ctx.state.currentUser) {
    ctx.redirect(ctx.router.url('patterns.list'));
  }
  const { pattern } = ctx.state;
  const materialsList = await ctx.orm.material.findAll();
  const materials = await pattern.getMaterials();
  await ctx.render('patterns/edit', {
    pattern,
    materials,
    materialsList,
    patternPath: ctx.router.url('patterns.show', { id: pattern.id }),
    submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
  });
});

router.post('patterns.create', '/', authenticate, async (ctx) => {
  ctx.params = ctx.request.body;
  if (ctx.state.currentUser) {
    ctx.params.authorId = ctx.state.currentUser.id;
  }
  const pattern = ctx.orm.pattern.build(ctx.params);
  let { materials } = ctx.params;
  try {
    await pattern.save(
      {
        fields: ['name', 'instructions', 'image', 'video', 'tension', 'authorId', 'categoryId'],
      },
    );
    await setMaterials(materials, pattern);
    ctx.redirect(ctx.router.url('patterns.show', { id: pattern.id }));
  } catch (validationError) {
    const { categoriesList, materialsList } = await newPatternInfo(ctx);
    materials = [];
    let { errors } = validationError;
    if (validationError.name === 'SequelizeUniqueConstraintError') {
      errors = [{ message: 'Ese nombre ya está en uso!' }];
    } else if (!errors) {
      errors = [{ message: 'Parámetros NO válidos!' }];
    }
    await ctx.render('patterns/new', {
      pattern,
      categoriesList,
      materials,
      materialsList,
      errors,
      patternsPath: ctx.router.url('patterns.list'),
      submitPatternPath: ctx.router.url('patterns.create'),
    });
  }
});

router.patch('patterns.update', '/:id', loadPattern, authenticate, async (ctx) => {
  const { pattern } = ctx.state;
  const materialsList = await ctx.orm.material.findAll();
  const patternMaterials = await pattern.getMaterials();
  try {
    const {
      name, instructions, image, video, tension, materials,
    } = ctx.request.body;
    await pattern.update({
      name, instructions, image, video, tension,
    });
    await setMaterials(materials, pattern);
    ctx.redirect(ctx.router.url('patterns.show', { id: pattern.id }));
  } catch (validationError) {
    let { errors } = validationError;
    if (!errors.length) {
      errors = [{ message: 'Ese nombre ya está en uso!' }];
    }
    await ctx.render('patterns/edit', {
      pattern,
      materials: patternMaterials,
      materialsList,
      errors,
      patternPath: ctx.router.url('patterns.show', { id: pattern.id }),
      submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
    });
  }
});

router.del('patterns.delete', '/:id', loadPattern, authenticate, async (ctx) => {
  if (ctx.state.currentUser) {
    const { pattern } = ctx.state;
    await pattern.destroy();
  }
  ctx.redirect(ctx.router.url('patterns.list'));
});

router.get('patterns.show', '/:id', loadPattern, checkState, async (ctx) => {
  const {
    pattern, votePattern, votePath, userPattern, addPath, favorite, favoritePath,
  } = ctx.state;
  const author = await pattern.getUser();
  const category = await pattern.getCategory();
  const materials = await pattern.getMaterials();
  const commentsList = await pattern.getComments();
  commentsList.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
  const commentUsers = commentsList.map((c) => c.getUser());
  const usersList = await Promise.all(commentUsers);
  const date = new Date();
  const patternComments = commentsList.map((e, i) => [e, usersList[i],
    updatedTime(e.updatedAt, date)]);
  const comment = ctx.orm.comment.build();
  const options = [1, 2, 3, 4, 5];
  await ctx.render('patterns/show', {
    pattern,
    author,
    votePattern,
    comment,
    options,
    category,
    materials,
    patternComments,
    patternsPath: ctx.router.url('patterns.list'),
    editPatternPath: ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: ctx.router.url('patterns.delete', { id: pattern.id }),
    authorPath: ctx.router.url('users.show', { id: author.id }),
    votePatternPath: votePath,
    submitCommentPath: ctx.router.url('comments.create'),
    editCommentPath: (c) => ctx.router.url('comments.edit', { id: c.id }),
    deleteCommentPath: (c) => ctx.router.url('comments.delete', { id: c.id }),
    userPattern,
    addPatternPath: addPath,
    favorite,
    favoritePath,
  });
});

module.exports = router;
