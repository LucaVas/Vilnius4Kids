import { router } from '@server/trpc';
import getReportById from './getReportById';
import getReportsByPlayground from './getReportsByPlayground';
import getReportsByUser from './getReportsByUser';
import report from './report';
import updateReport from './updateReport';
import getReports from './getReports';

export default router({
    getReports,
    getReportById,
    getReportsByPlayground,
    getReportsByUser,
    report,
    updateReport,
});
