export const apiOrigin = import.meta.env.VITE_API_ORIGIN as string;
export const apiPath = import.meta.env.VITE_API_PATH as string;
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
export const apiBase = `${apiOrigin}${apiPath}`;
export const filesTypesAllowed = import.meta.env.VITE_FILE_TYPES_ALLOWED as string;
export const maxFileSizeAllowed = import.meta.env.VITE_MAX_FILE_SIZE_ALLOWED_IN_BYTES as string;

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined');
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined');
}

if (typeof googleMapsApiKey !== 'string') {
  throw new Error('GOOGLE_MAPS_API_KEY is not defined');
}

if (typeof filesTypesAllowed !== 'string') {
  throw new Error('FILE_TYPES_ALLOWED is not defined');
}
if (typeof maxFileSizeAllowed !== 'string') {
  throw new Error('MAX_FILE_SIZE_ALLOWED_IN_BYTES is not defined');
} 
