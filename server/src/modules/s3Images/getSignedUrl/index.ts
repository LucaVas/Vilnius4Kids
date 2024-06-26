import { randomBytes } from 'crypto';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { s3bucket, s3client, s3imageUploadTimeout } from '@server/services/s3';

export default authenticatedProcedure.query(async () => {
    logger.debug('Received request for signed url to upload image to S3.');

    const rawBytes = randomBytes(16);
    const imageName = rawBytes.toString('hex'); // 32 hex chars string

    try {
        const signedURL = await s3client.getSignedUrlPromise('putObject', {
            Bucket: s3bucket,
            Key: imageName,
            Expires: s3imageUploadTimeout,
        });
        return { url: signedURL, imageName };
    } catch (e) {
        logger.error(`Error while getting signed url: ${e}`);
        throw new TRPCError({
            message: `Error while trying to upload images.`,
            code: 'INTERNAL_SERVER_ERROR',
        });
    }
});
