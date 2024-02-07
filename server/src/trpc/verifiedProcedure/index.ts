import jsonwebtoken from 'jsonwebtoken';
import config from '@server/config';
import { buildVerifiedProcedure } from './buildVerifiedProcedure';

const { tokenKey } = config.auth;

const verifyToken = (token: string) => jsonwebtoken.verify(token, tokenKey);
export const verifiedProcedure = buildVerifiedProcedure(verifyToken);
