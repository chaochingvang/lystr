require('dotenv').config();
const fs = require('fs');
const aws = require('aws-sdk');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const S3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads file (from multer) to S3
function uploadFile(file) {
  // create a read stream with fs
  const fileStream = fs.createReadStream(file.path);
  // declare the upload parameters
  const uploadParams = {
    Bucket: bucketName, // AWS S3 bucket name
    Body: fileStream, //
    Key: file.filename, // name of file within the bucket (filename created by Multer)
  };

  return S3.upload(uploadParams).promise();
}

// downloads file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey, // created during upload
    Bucket: bucketName,
  };
  return S3.getObject(downloadParams).createReadStream();
}

// delete an object from the bucket
function deleteFile(fileKey) {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return S3.deleteObject(deleteParams).promise();
}

module.exports = {
  uploadFile: uploadFile,
  getFileStream: getFileStream,
  deleteFile: deleteFile,
};
