import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import getUsername from './getUsername'

export default router({
  login,
  signup,
  getUsername
})
