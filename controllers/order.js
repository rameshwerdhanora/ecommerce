/**
 * GET /
 * Order list
 */
exports.list = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('order/list', {
    title: 'Order List'
  });
};


/**
 * GET /
 * Order detail
 */
exports.detail = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('order/detail', {
    title: 'Order'
  });
};
