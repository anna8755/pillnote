const { Schema, model } = require('mongoose');

const ReminderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', cascade: true },
    medicine: { type: String, required: true },
    time: { type: Date, required: true },
    notes: { type: String },
    viewed: { type: Boolean }
});

module.exports = model('Reminder', ReminderSchema);