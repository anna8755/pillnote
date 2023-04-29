const { Schema, model } = require('mongoose');

const ReminderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    medicine: { type: String, required: true },
    time: { type: Date, required: true },
    notes: { type: String }
});

module.exports = model('Reminder', ReminderSchema);