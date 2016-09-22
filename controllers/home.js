/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('home/dashboard', {
    title: 'Home',
    left_activeClass:1
  });
};


exports.land = (req, res) => {
  res.render('home/land', {
    title: 'Home',
    left_activeClass:1
  });
};

/*exports.emailsubscribe = (req, res) => {
  console.log(req.body);
};*/