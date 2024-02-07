import jsonwebtoken from 'jsonwebtoken';
import config from '@server/config';
import { buildAdminProcedure } from './buildAdminProcedure';

const { tokenKey } = config.auth;

const verifyToken = (token: string) => jsonwebtoken.verify(token, tokenKey);
export const adminProcedure = buildAdminProcedure(verifyToken);
