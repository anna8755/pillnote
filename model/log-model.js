const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    time: { type: Date, required: true },
    notes: { type: String }
})

module.exports = model('Log', LogSchema);