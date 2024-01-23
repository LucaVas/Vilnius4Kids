import { router } from '@server/trpc';
import addReportCategory from './addReportCategory';
import deleteReportCategory from './deleteReportCategory';

export default router({
    addReportCategory,
    deleteReportCategory,
});
