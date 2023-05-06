const { Schema, model } = require('mongoose');

const ForgotLinkSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', cascade: true, unique: true },
    link: { type: String, required: true }
})

module.exports = model('ForgotLink', ForgotLinkSchema);