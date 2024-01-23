import { router } from '@server/trpc';
import getReportById from './getReportById';
import getReportsByPlayground from './getReportsByPlayground';
import getReportsByUser from './getReportsByUser';
import report from './report';
import updateReport from './updateReport';

export default router({
    getReportById,
    getReportsByPlayground,
    getReportsByUser,
    report,
    updateReport,
});
