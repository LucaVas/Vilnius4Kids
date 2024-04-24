export const apiOrigin = import.meta.env.VITE_API_ORIGIN as string;
export const apiPath = import.meta.env.VITE_API_PATH as string;
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
export const apiBase = `${apiOrigin}${apiPath}`;
export let filesTypesAllowed = import.meta.env.VITE_AWS_S3_FILE_TYPES_ALLOWED as string;
export let maxFileSizeAllowed = import.meta.env.VITE_AWS_S3_FILE_SIZE_MAX_IN_BYTES as string;

if (typeof apiOrigin !== 'string') throw new Error('VITE_API_ORIGIN is not defined');

if (typeof apiPath !== 'string') throw new Error('VITE_API_PATH is not defined');

if (typeof googleMapsApiKey !== 'string')
  throw new Error('VITE_GOOGLE_MAPS_API_KEY is not defined');

if (typeof filesTypesAllowed !== 'string') filesTypesAllowed = 'image/png,image/jpeg,image/jpg';

if (typeof maxFileSizeAllowed !== 'string') maxFileSizeAllowed = '5000000';
