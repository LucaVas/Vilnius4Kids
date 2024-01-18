import { router } from '@server/trpc';
import report from './report';
import updateReport from './updateReport';
import getReportById from './getReportById';
import getReportsByPlayground from './getReportsByPlayground';
import getReportsByUser from './getReportsByUser';

export default router({
    report,
    updateReport,
    getReportById,
    getReportsByPlayground,
    getReportsByUser,
});
