const API_SECRET = process.env['API_SECRET'];
let jwt = require('jsonwebtoken');

let adminService = require('../services/mdb/adminService');

checkAdminToken = async(req, res, next) => {
    let token = req.headers['access_token'] || req.headers['authorization'];
    if (!token) {
        return res.json({ status: false, message: "Something went wrong with token", statusCode: 401 });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, API_SECRET, async(err, decoded) => {
            if (err) {
                return res.json({ status: false, message: "Something went wrong with token", statusCode: 401 });
            } else {
                let admin_id = decoded.admin_id;
                let response = await adminService.getAdminDataById(admin_id);
                if (!response.status) {
                    return res.json({ status: false, message: "Your Account has been deleted by Super Admin !!! Please Contact Administrator", statusCode: 451 });
                } else {
                    if (!response.data.status) {
                        return res.json({ status: false, message: "Your account login has been disabled by Super Admin !!! Please contact Administrator", statusCode: 423 });
                    } else {
                        req.decoded = decoded;
                        req.token = token
                        next();
                    }
                }
            }
        });
    } else {
        return res.json({ status: false, message: "Something went wrong with token", statusCode: 401 });
    }
}

module.exports = {
    checkAdminToken: checkAdminToken,
}