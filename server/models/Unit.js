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

    artifact: {
        type: String,
        required: true,
        trim: true,
    },
    
});

UnitSchema.statics.toAPI = (doc) =>({
    name: doc.name,
    vision: doc.vision,
    level: doc.level,
    
});

UnitSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId)
    };

    return UnitModel.find(search).select('name vision level').lean().exec(callback);
};

UnitModel = mongoose.model('Unit', UnitSchema);

module.exports.UnitModel = UnitModel;
module.exports.UnitSchema = UnitSchema;