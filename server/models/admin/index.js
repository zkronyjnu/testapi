var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    access_type: {
        type: String,
        default: 'privileged'
    },
    privileges: {
        type: Array,
        default: []
    },
    created_at: {
        type: Number,
        default: 0
    },
    updated_at: {
        type: Number,
        default: 0
    },
    profile_image: {
        type: String,
    }

});
module.exports = mongoose.model('Admin', AdminSchema, 'admin');