var Admin = require("../../models/admin");
var ProfileImageLog = require("../../models/profile_image_log");
require("../../db_functions");
var moment = require("moment");
const md5 = require("md5");;
var ObjectId = require("mongodb").ObjectID;

exports.getAdminDataById = async(admin_id) => {

    let result = await getSingleData(Admin, { _id: ObjectId(admin_id) }, '');

    return result;
};

exports.getAdminByEmailPass = async(email, password) => {
    let where = {
        email: email,
        password: md5(password),
        status: { $eq: 1 },
    };
    let result = await getSingleData(Admin, where, "-password");

    return result;
};


exports.updateProfileImage = async(admin_id, s3Path) => {

    let AdminDataObj = {
        "profile_image": s3Path,
        "updated_at": moment().unix()
    }
    let result = await updateData(Admin, AdminDataObj, ObjectId(admin_id));

    let profileImageLogData = new ProfileImageLog({
        admin_id: ObjectId(admin_id),
        image: s3Path,
        date_created: moment().unix()
    });

    await postData(profileImageLogData);

    return result;
};