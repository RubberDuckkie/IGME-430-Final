const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let UnitModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  vision: {
    type: String,
    required: true,
    trim: true,
  },

  level: {
    type: Number,
    min: 1,
    required: true,
  },

  weapon: {
    type: String,
    required: true,
    trim: true,
  },
  
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },


});

UnitSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  vision: doc.vision,
  level: doc.level,
  weapon: doc.weapon,

});

UnitSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
    console.log('search', search)
  return UnitModel.find(search).select('name vision level weapon').lean().exec(callback);
};

UnitSchema.statics.delete = (id, callback) => {
  const search = {
    _id: id,
  };
    console.log('search', search)
    UnitModel.deleteOne(search).lean().exec(callback);;
};


UnitModel = mongoose.model('Unit', UnitSchema);

module.exports.UnitModel = UnitModel;
module.exports.UnitSchema = UnitSchema;
