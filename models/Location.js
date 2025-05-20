const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User ID or Admin ID
    
},{
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
