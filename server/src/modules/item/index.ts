import { router } from '@server/trpc';
import addItem from './addItem';
import removeItem from './removeItem';
import updatePosition from './updatePosition';
import updateCategory from './updateCategory';
import updateRoom from './updateRoom';
import removeCategories from './removeCategories';
import removeRoom from './removeRoom';

export default router({
    addItem,
    removeItem,
    updatePosition,
    updateCategory,
    updateRoom,
    removeCategories,
    removeRoom,
});
