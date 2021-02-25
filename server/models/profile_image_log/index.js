var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProfileImageLogSchema = new Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    image: {
        type: String,
        required: true
    },
    date_created: {
        type: Number
    },
});
module.exports = mongoose.model('profile_image_log', ProfileImageLogSchema, 'profile_image_log');