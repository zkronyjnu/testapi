const multer = require('multer');
const s3Storage = require('multer-sharp-s3');
const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.Bucket_accessKeyId,
    secretAccessKey: process.env.Bucket_secretAccessKey,
    region: process.env.Bucket_region
});

const s3 = new aws.S3()

const storage = s3Storage({
    s3,
    Bucket: process.env.Bucket_name,

    ACL: 'public-read',
    toFormat: {
        type: 'webp',

    },
    Key: (req, file, cb) => {

        let nameSplit = file.originalname.split(".");
        ext = nameSplit[nameSplit.length - 1];

        let originalname = file.originalname;
        originalname = originalname.replace("." + ext, "");

        originalname = originalname.split(' ').join('-');

        let fileName = originalname + "-" + Date.now().toString() + ".webp"
        let path = "";
        switch (file.fieldname) {
            case "profile_image":
                path = "profile/" + fileName;
                break;
            default:
                path = "root/" + fileName;
        }

        file.s3Path = path;

        cb(null, path)

    },

})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/*') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG and Webp is allowed!'), false);
    }

}

const upload = multer({
    limits: {
        fileSize: process.env.FILE_UPLOAD_LIMIT_MB * 1024 * 1024,
    },
    fileFilter,
    storage: storage
});


module.exports = upload;