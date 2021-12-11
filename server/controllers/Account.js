//importing files
const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Account } = models;

//creates the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

//supposidly is the change password page
const changePage = (req, res) =>{
  res.render('change', {csrfToken : req.csrfToken() });
};

//gets a csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

//ends the session for the user
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//logs the user into the application
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password.' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

//adds the user to the data base
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      res.json({ redirect: '/maker' });
      // return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error has occurred' });
    });
  });
};

//changes the password for the account
const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.oldpass = `${req.body.oldpass}`;
  req.body.newpass = `${req.body.newpass}`;
  req.body.newpass2 = `${req.body.newpass2}`;

  if (!req.body.username || !req.body.oldpass || !req.body.newpass || !req.body.newpass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.newpass !== req.body.newpass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.oldpass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password.' });
    };

    return Account.AccountModel.generateHash(req.body.newpass, (salt, hash) =>{
      const edits = account;
        edits.salt = salt;
        edits.password = hash;
      
      
      const edtitedAcc = account.save();
      edtitedAcc.then(()=> {
      res.json({redirect : '/maker'});
      });
    });

    
  
  });

    
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getToken = getToken;
module.exports.signup = signup;
module.exports.changePass = changePass;
