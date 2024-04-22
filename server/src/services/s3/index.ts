import config from '@server/config';
import aws from 'aws-sdk';

const {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    imageSize,
    imageUploadTimeout,
} = config.s3;

export const s3client = new aws.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4',
});

export const s3bucket = bucket;
export const s3imageSize = imageSize;
export const s3imageUploadTimeout = imageUploadTimeout;

