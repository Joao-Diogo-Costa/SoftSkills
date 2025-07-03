const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Credenciais para o S3
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

//  S3 Client
const s3 = new S3Client({

  credentials: {

    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,

  },
  region: bucketRegion
});


function getKeyFromS3Url(url) {
  if (!url) return null;

  // Encontra a posição do nome do bucket na URL, que é o início da Key
  // Ex: .s3.amazonaws.com/
  const s3DomainPart = `.s3.${process.env.BUCKET_REGION}.amazonaws.com/`;
  const indexOfKeyStart = url.indexOf(s3DomainPart);

  if (indexOfKeyStart === -1) {
    // URL não parece ser do S3 ou não corresponde ao padrão esperado
    return null;
  }

  // A Key começa logo após a parte do domínio
  return url.substring(indexOfKeyStart + s3DomainPart.length);
}

module.exports = {
  s3,
  PutObjectCommand,
  DeleteObjectCommand,
  getKeyFromS3Url,
};