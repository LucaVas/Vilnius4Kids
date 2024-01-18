import { router } from '@server/trpc';
import addAddress from './addAddress';
import deleteAddress from './deleteAddress';
import updateAddress from './updateAddress';

export default router({
    addAddress,
    updateAddress,
    deleteAddress,
});
