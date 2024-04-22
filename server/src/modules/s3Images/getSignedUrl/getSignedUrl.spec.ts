import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import { s3client } from '@server/services/s3';
import router from '..';

const db = await createTestDatabase();

describe('Get a signed url', async () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('User can get a signed url', async () => {
        const spy = vi.spyOn(s3client, 'getSignedUrlPromise');
        spy.mockImplementationOnce(() => Promise.resolve('fake-url'));

        const { getSignedUrl } = router.createCaller(authContext({ db }));

        const { url } = await getSignedUrl();

        expect(url).toEqual('fake-url');
        expect(spy).toBeCalledTimes(1);
    });


    it('Throws error if aws client fails', async () => {

        const { getSignedUrl } = router.createCaller(authContext({ db }));

        const spy = vi.spyOn(s3client, 'getSignedUrlPromise');
        spy.mockRejectedValue(new Error('AWS Error'));

        await expect(getSignedUrl()).rejects.toThrow(
            /Error while trying to upload images/
        );
    });
});
