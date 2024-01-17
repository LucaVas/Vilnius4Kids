import { router } from '@server/trpc';
import addCategory from './addCategory';
import deleteCategory from './deleteCategory';
import updateCategory from './updateCategory';
import getCategories from './getCategories';

export default router({
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories
});
