const controllers = require('./controllers');
const mid = require('./middleware');

//a massive list of endpoints, each descriptive of its function
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getUnits', mid.requiresSecure, controllers.Unit.getUnits);
  app.delete('/delete', mid.requiresLogin, controllers.Unit.delete);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/passchange', mid.requiresLogin, controllers.Account.changePass);
  app.post('/passchange', mid.requiresLogin, controllers.Account.changePass);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Unit.teamPage);
  app.post('/maker', mid.requiresLogin, controllers.Unit.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
