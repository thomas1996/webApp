var mongoose = require('mongoose');

var FlightScheme = new mongoose.Schema({
    pilot: String,
    houres: {type: Number, default:0 ,min:0},
    landings: {type: Number, default: 0, min: 0},
    aircraft: {type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft'}
});

mongoose.model('Flight', FlightScheme);