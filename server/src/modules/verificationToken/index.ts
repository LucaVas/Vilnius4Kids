import { router } from '@server/trpc'
import verify from './verify'
import getVerificationToken from './getVerificationToken'

export default router({
  verify,
  getVerificationToken,
})
