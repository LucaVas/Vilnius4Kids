import { randomUUID } from 'crypto';
import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import logger from '@server/logger';
import { s3bucket, s3client, s3imageSize, s3imageUploadTimeout } from '@server/services/s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export default authenticatedProcedure.query(async () => {
    logger.debug('Received request for signed url to upload image to S3.');

    try {
        const signedURL = await createPresignedPost(s3client, {
            Fields: {
                key: randomUUID(),
            },
            Key: randomUUID(),
            Conditions: [
                ['starts-with', '$Content-Type', 'image/'],
                ['content-length-range', 0, s3imageSize],
            ],
            Expires: s3imageUploadTimeout,
            Bucket: s3bucket,
        });
        return signedURL;
    } catch (e) {
        logger.error(`Error while getting signed url: ${e}`);
        throw new TRPCError({
            message: `Error while trying to upload images.`,
            code: 'INTERNAL_SERVER_ERROR',
        });
    }
});
