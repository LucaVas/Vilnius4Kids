import { router } from '@server/trpc';
import addPlayground from './addPlayground';
import addFavoritePlayground from './addFavoritePlayground';
import deletePlayground from './deletePlayground';
import updatePlayground from './updatePlayground';
import getPlayground from './getPlayground';
import getPlaygrounds from './getPlaygrounds';
import getFavoritePlaygrounds from './getFavoritePlaygrounds';


export default router({
    addPlayground,
    addFavoritePlayground,
    deletePlayground,
    updatePlayground,
    getPlayground,
    getPlaygrounds,
    getFavoritePlaygrounds
});
