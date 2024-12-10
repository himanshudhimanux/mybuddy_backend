const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subjecttype: {
        type: String,
        required: true
    },
    FacultyId: {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    }
})


module.exports = mongoose.model('Subject', subjectSchema);