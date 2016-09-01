/**
 * GET /
 * Email Template list
 */
exports.list = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('emailtemplate/list', {
    title: 'Email Template List'
  });
};


/**
 * GET /
 * Email Template Update Detail
 */
exports.edit = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('emailtemplate/edit', {
    title: 'Edit Email Template'
  });
};
