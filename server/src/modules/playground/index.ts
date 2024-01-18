import { router } from '@server/trpc';
import addPlayground from './addPlayground';
import deletePlayground from './deletePlayground';
import updatePlayground from './updatePlayground';
import getPlayground from './getPlayground';
import getPlaygrounds from './getPlaygrounds';

export default router({
    addPlayground,
    deletePlayground,
    updatePlayground,
    getPlayground,
    getPlaygrounds,
});
