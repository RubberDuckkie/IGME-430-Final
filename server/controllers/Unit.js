const models = require('../models');

const Unit = models.Unit;

const teamPage = (req, res) => {
    Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) =>{
        if (err) {
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }
        return res.render('app', {csrfToken: req.csrfToken(), units: docs});
    });
};

const makeUnit = (req, res) => {
    if(!req.body.name || !req.body.vision || !req.body.level) {
        alert('Name, vision, and level are required');
        return res.status(400).json({error: 'Name, vision, and level are required'});
    }

    const UnitData = {
        name: req.body.name,
        vision: req.body.vision,
        level: req.body.level,
    };

    const newUnit = new Unit.UnitModel(UnitData);

    const unitPromise = newUnit.save();

    unitPromise.then(() => res.json({ redirect: '/maker'}));

    unitPromise.catch((err) => {
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Unit already selected.'});
        }

        return res.status(400).json({error: 'An error occurred'});
    });
    
    return unitPromise;
};

const getUnits = (request, response) => {
    const req = request;
    const res = response;

    return Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({error: 'An error occurred' });
        }
        return res.json({ units: docs});
    });
};


module.exports.teamPage = teamPage;
module.exports.getUnits = getUnits;
module.exports.make = makeUnit;

