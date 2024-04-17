import { router } from '@server/trpc';
import addReportCategory from './addReportCategory';
import deleteReportCategory from './deleteReportCategory';
import getReportCategories from './getReportCategories';

export default router({
    addReportCategory,
    deleteReportCategory,
    getReportCategories,
});
