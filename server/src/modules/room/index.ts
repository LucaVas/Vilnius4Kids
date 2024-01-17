import { router } from '@server/trpc';
import deleteRoom from './deleteRoom';
import createRoom from './createRoom';
import updateRoom from './updateRoom';
import loadRoom from './loadRoom';
import getRooms from './getRooms';

export default router({
    createRoom,
    updateRoom,
    deleteRoom,
    getRooms,
    loadRoom,
});
