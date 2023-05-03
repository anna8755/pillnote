const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
    reminder: { type: Schema.Types.ObjectId, ref: 'Reminder', required: true, cascade: true },
    time: { type: Date, required: true },
    notes: { type: String }
})

module.exports = model('Log', LogSchema);