const KoaRouter = require('koa-router');
const cloudinary = require('../config/cloudinary');

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
  info.categoriesList.sort((a, b) => a.name - b.name).reverse();
  const allMaterials = await ctx.orm.material.findAll();
  allMaterials.sort((a, b) => a.name - b.name).reverse();
  info.materialsList = allMaterials.map((m) => [m, false]);
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

// Uploads an image to the cloud storage
async function uploadImage(ctx, next) {
  await next();
  const { pattern } = ctx.state;
  if (pattern.id) {
    const { image } = ctx.request.files;
    if (image.name) {
      if (pattern.imageId !== 'default') {
        await cloudinary.deletes(pattern.imageId);
      }
      const upload = await cloudinary.uploads(image.path);
      await pattern.update({ image: upload.secure_url, imageId: upload.public_id });
    }
  }
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
  categories.sort((a, b) => a.name.localeCompare(b.name));
  materials.sort((a, b) => a.name.localeCompare(b.name));
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
    selSorting: ctx.state.sorting,
    selCategory: ctx.state.category,
    options: [['recent', 'Más Reciente'], ['popular', 'Más Popular'], ['rating', 'Mejor Valorado']],
  });
});

router.get('patterns.new', '/new', authenticate, async (ctx) => {
  const pattern = ctx.orm.pattern.build();
  const { categoriesList, materialsList } = await newPatternInfo(ctx);
  categoriesList.sort((a, b) => a.name.localeCompare(b.name));
  materialsList.sort((a, b) => a[0].name.localeCompare(b[0].name));
  await ctx.render('patterns/new', {
    pattern,
    categoriesList,
    materialsList,
    patternPath: ctx.router.url('patterns.list'),
    submitPatternPath: ctx.router.url('patterns.create'),
  });
});

router.get('patterns.edit', '/:id/edit', loadPattern, authenticate, async (ctx) => {
  if (!ctx.state.currentUser) {
    ctx.redirect(ctx.router.url('patterns.list'));
  }
  const { pattern } = ctx.state;
  const allMaterials = await ctx.orm.material.findAll();
  allMaterials.sort().reverse();
  const materials = await pattern.getMaterials();
  const materialsId = materials.map((m) => m.id);
  const materialsList = [];
  allMaterials.forEach((m) => {
    let checked = false;
    if (materialsId.includes(m.id)) {
      checked = true;
    }
    materialsList.push([m, checked]);
  });
  materialsList.sort((a, b) => a[0].name.localeCompare(b[0].name));
  await ctx.render('patterns/edit', {
    pattern,
    materialsList,
    patternPath: ctx.router.url('patterns.show', { id: pattern.id }),
    submitPatternPath: ctx.router.url('patterns.update', { id: pattern.id }),
  });
});

router.post('patterns.create', '/', authenticate, uploadImage, async (ctx) => {
  ctx.params = ctx.request.body;
  ctx.params.image = ctx.request.files.image.name;
  if (ctx.state.currentUser) {
    ctx.params.authorId = ctx.state.currentUser.id;
  }
  const pattern = ctx.orm.pattern.build(ctx.params);
  ctx.state.pattern = pattern;
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
      materialsList,
      errors,
      patternsPath: ctx.router.url('patterns.list'),
      submitPatternPath: ctx.router.url('patterns.create'),
    });
  }
});

router.patch('patterns.update', '/:id', loadPattern, authenticate, uploadImage, async (ctx) => {
  const { pattern } = ctx.state;
  const allMaterials = await ctx.orm.material.findAll();
  allMaterials.sort().reverse();
  const patternMaterials = await pattern.getMaterials();
  const materialsId = patternMaterials.map((m) => m.id);
  const materialsList = [];
  allMaterials.forEach((m) => {
    let checked = false;
    if (materialsId.includes(m.id)) {
      checked = true;
    }
    materialsList.push([m, checked]);
  });
  try {
    const {
      name, instructions, video, tension, materials,
    } = ctx.request.body;
    await pattern.update({
      name, instructions, video, tension,
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
  materials.sort((a, b) => a.name.localeCompare(b.name));
  const options = [1, 2, 3, 4, 5];
  await ctx.render('patterns/show', {
    pattern,
    author,
    votePattern,
    options,
    category,
    materials,
    patternsPath: ctx.router.url('patterns.list'),
    editPatternPath: ctx.router.url('patterns.edit', { id: pattern.id }),
    deletePatternPath: ctx.router.url('patterns.delete', { id: pattern.id }),
    authorPath: ctx.router.url('users.show', { id: author.id }),
    userPath: (user) => ctx.router.url('users.show', { id: user.id }),
    votePatternPath: votePath,
    userPattern,
    addPatternPath: addPath,
    favorite,
    favoritePath,
  });
});

module.exports = router;
