const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: 'LrQBQI4dOEBRwwM8b+Ay761fWbq7M1d/UaJhPuKN',
  accessKeyId: 'AKIAJQMVTOKS6GK63SPQ',
  region:'us-east-1',
})
const s3 = new aws.S3()

const fileFilter = (req,file,cb) =>{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype ===  "video/quicktime" || file.mimetype === "video/MP2T") {
    cb(null,true)
  }
  else {
    cb(new Error('invalid mime type, only JPEG and PNG'), false);
  }
}
const  upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'fit-like-me',
    acl:"public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "TESTING_META_DATA"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
module.exports = upload;
