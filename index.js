var Fs = require("fs");
var file = "/Users/chakshugautam/Work/minio-oauth2/test.png";
var Minio = require("minio");
require("dotenv").config();

var minioClient = new Minio.Client({
  endPoint: "cdn.samagra.io",
  useSSL: true,
  accessKey: process.env.accessKey,
  secretKey: process.env.secretKey,
  sessionToken: process.env.sessionToken,
});

var metaData = {
  "Content-Type": "png/image",
};
const insertImageFile = () =>
  minioClient.fPutObject(
    "e-samwad",
    "test-image.png",
    file,
    metaData,
    function (err, objInfo) {
      if (err) {
        return console.log(err); // err should be null
      }
      console.log("Success", objInfo);
    }
  );

insertImageFile();
