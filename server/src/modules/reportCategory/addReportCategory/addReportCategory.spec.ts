import { createTestDatabase } from '@tests/utils/database';
import { authContext } from '@tests/utils/context';
import {
    fakeUser,
} from '@server/entities/tests/fakes';
import { User } from '@server/entities';
import router from '..';

const db = await createTestDatabase();
const user = await db.getRepository(User).save(fakeUser());
const { addReportCategory } = router.createCaller(
    authContext({ db }, user)
);

describe('Add a new report category', async () => {
    it('User can add a new report category', async () => {
        const { message, category } = await addReportCategory({
            name: 'Category 1',
            topic: 'Topic 1',
            description: 'Description 1',
        });

        expect(message).toEqual('Report category added successfully.');
        expect(category.name).toEqual('Category 1');
    });

    it('User cannot add a new category with a too short name', async () => {
        await expect(addReportCategory({ name: '', description: "Description 1", topic: "Topic 1" })).rejects.toThrow(
            'Report category name should be at least 5 characters long'
        );
    });
});
