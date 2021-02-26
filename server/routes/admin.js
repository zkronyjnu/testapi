var express = require('express');
var router = express.Router();

var AdminController = require('../controllers/admin');

var middleware = require("../controllers/middleware");

router.post('/login', AdminController.login);

router.post('/upload_profile_image', middleware.checkAdminToken, AdminController.uploadProfileImage);
router.get('/get_profile_image', middleware.checkAdminToken, AdminController.getProfileImage);


// Common Routes
router.get('*', (req, res) => { res.status(404).send({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(404).send({ status: false, message: "Invalid Post Request" }) });
module.exports = router;