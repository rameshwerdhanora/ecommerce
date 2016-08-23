/**
 * GET /
 * Order 
 */
exports.list = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }	
  res.render('order/list', {
    title: 'Order'
  });
};
