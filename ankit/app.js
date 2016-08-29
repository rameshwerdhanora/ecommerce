const colorController          = require('./controllers/color');

/* Color CRUD Section */ // Need isAuthenticated code for check user is loggedin.

app.get('/listofcolor',  colorController.listOfColor);
app.get('/addcolor',  colorController.addColor);
app.get('/editcolor/:colorId',  colorController.editColor);
app.post('/savecolor',  colorController.saveColor);
app.get('/removecolor/:colorId',  colorController.removeColor);
app.post('/updatecolor',  colorController.updateColor);