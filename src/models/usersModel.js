const mongoose = require('mongoose');
const schema = mongoose.Schema;


const UserSchema = schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    permissions: {type: Number, default: 0},
    last_log: {type: Date, default: Date.now()},
    last_ip: {type: String},
    created_at: {type: Date, default: Date.now()},
    registry: {type: Array},
    theme: {type: Boolean, default: true},
    pfImg: {type: JSON, default: {
        type: "image/jpeg",
        savedName: "default.jpg",
        updated: 'Never',
        _updateIP: '-'
    }},
    meta: {type: JSON, default: {
        passUpd: {type: String, default: 'Never'}
    }}
});


module.exports = mongoose.model('user', UserSchema);
