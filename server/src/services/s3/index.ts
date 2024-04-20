import { S3Client } from '@aws-sdk/client-s3';
import config from '@server/config';

const {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    imageSize,
    imageUploadTimeout,
} = config.s3;

export const s3client = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
});

export const s3bucket = bucket;
export const s3imageSize = imageSize;
export const s3imageUploadTimeout = imageUploadTimeout;
