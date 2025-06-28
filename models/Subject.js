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
    subjectFee: {
        type: String,
        required: true
    },
    // FacultyId: [{
    //     type: mongoose.Schema.Types.ObjectId, // Correctly define the field's type
    //     ref: 'Teacher', // Reference the 'Teacher' model
    //     required: true,
    //   }],
})


module.exports = mongoose.model('Subject', subjectSchema);