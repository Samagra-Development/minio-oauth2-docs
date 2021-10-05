var Fs = require('fs')
var file = '/Users/apple/Work/minio/test.txt'
var Minio = require('minio')
require('dotenv').config()

var minioClient = new Minio.Client({
    endPoint: 'cdn.samagra.io',
    useSSL: true,
    accessKey: process.env.accessKey,
    secretKey: process.env.secretKey,
    sessionToken: process.env.sessionToken
});

var fileStream = Fs.createReadStream(file)
var fileStat = Fs.stat(file, async function(err, stats) {
  if (err) {
    return console.log(err)
  }
  minioClient.putObject('e-samwad', 'test2.txt', fileStream, stats.size, function(err, objInfo) {
      if(err) {
          return console.log(err) // err should be null
      }
   console.log("Success", objInfo)
  })
});