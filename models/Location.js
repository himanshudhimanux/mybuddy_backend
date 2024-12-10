const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    locationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
    createdBy: { type: String, required: true }, // User ID or Admin ID
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
},{
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
