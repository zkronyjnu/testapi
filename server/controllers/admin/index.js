var Admin = require("../../models/admin");
require("../../db_functions");
require("./messages");
let jwt = require("jsonwebtoken");
var helpers = require("../../services/helper");
var AdminService = require("../../services/mdb/adminService");

const upload = require('../../services/image-upload');
const singleUpload = upload.single('profile_image');


exports.login = async(req, res) => {
    let requiredFields = ["email", "password"];
    let validator = helpers.validateParams(req, requiredFields);
    if (!validator.status) {
        return res.status(402).send(
            helpers.showResponse(validator.status, validator.message)
        );
    }

    let {
        email,
        password
    } = req.body;

    //mhn : get admin user by email, password
    let result = await AdminService.getAdminByEmailPass(email, password);

    if (result.status) {

        let token = jwt.sign({
                admin_id: result.data._id,
            },
            process.env["API_SECRET"], {
                expiresIn: process.env["JWT_EXPIRY"],
            }
        );

        let data = {
            token: token,
            time: process.env["JWT_EXPIRY"],
            name: result.data.name,
            email: result.data.email,
            privileges: result.data.privileges,
            access_type: result.data.access_type,
            _id: result.data._id

        };

        return res.status(200).send(helpers.showResponse(true, ADMIN_LOGIN_SUCCESS, data));
    }
    return res.status(401).send(helpers.showResponse(false, ADMIN_LOGIN_FAILED));
};


exports.uploadProfileImage = async(req, res) => {
    singleUpload(req, res, async(err) => {
        if (err) {
            return res.status(402).send(helpers.showResponse(false, "File size should be less then " + process.env.FILE_UPLOAD_LIMIT_MB + "MB"));
        }
        if (!req.file) {
            return res.status(402).send(helpers.showResponse(false, "Please select image file to proceed"));
        }

        let admin_id = req.decoded.admin_id;
        let s3Path = req.file.s3Path;

        if (!admin_id) {
            return res.status(400).send(helpers.showResponse(false, INVALID_ADMIN));
        }

        let result = await AdminService.updateProfileImage(admin_id, s3Path);

        if (result.status) {
            let data = { image_url: s3Path }
            return res.status(200).send(helpers.showResponse(true, UPDATE_SUCCESS, data));
        } else {
            return res.status(401).send(helpers.showResponse(false, UPDATE_FAILURE));
        }
    });
}


exports.getProfileImage = async(req, res) => {
    let admin_id = req.decoded.admin_id;
    if (!admin_id) {
        return res.status(400).send(helpers.showResponse(false, INVALID_ADMIN));
    }

    let result = await AdminService.getAdminDataById(admin_id);

    if (result.status) {
        return res.status(200).send(helpers.showResponse(true, PROFILE_IMAGE, { image_url: result.data.profile_image }));
    } else {
        return res.status(401).send(helpers.showResponse(false, PROFILE_IMAGE_FAILED));
    }
}