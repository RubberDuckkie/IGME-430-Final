const { response } = require('express');
const models = require('../models');

const { Unit } = models;

const teamPage = (req, res) => {
  Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), units: docs });
  });
};

const makeUnit = (req, res) => {
  if (!req.body.name || !req.body.vision || !req.body.level || !req.body.weapon)   {
    return res.status(400).json({ error: 'Name, vision, level, and weapon are required' });
  }

  const UnitData = {
    name: req.body.name,
    vision: req.body.vision,
    level: req.body.level,
    weapon: req.body.weapon,
    owner: req.session.account._id,
  };



  const newUnit = new Unit.UnitModel(UnitData);

  const unitPromise = newUnit.save();

  unitPromise.then(() => res.json({ redirect: '/maker' }));

  unitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Unit already selected.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return unitPromise;
};

const getUnits = (request, response) => {
  const req = request;
  const res = response;

  return Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ units: docs });
  });
};

const deleteUnit  = (request, response) => {
  const req = request;
  const res = response;

  return Unit.UnitModel.delete(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ UnitList: docs });
  });
};


module.exports.teamPage = teamPage;
module.exports.getUnits = getUnits;
module.exports.make = makeUnit;
module.exports.delete = deleteUnit;
