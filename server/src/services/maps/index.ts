import {
    Client,
    TravelMode,
    type LatLng,
} from '@googlemaps/google-maps-services-js';
import config from '@server/config';
import logger from '@server/logger';

const { googleMapsApiKey } = config;
const client = new Client({});

export async function getDistance(origin: LatLng, destination: LatLng) {
    try {
        const distanceResponse = await client.distancematrix({
            params: {
                key: googleMapsApiKey,
                origins: [origin],
                destinations: [destination],
                mode: TravelMode.driving,
                // Feel free to set more params
            },

            timeout: 1000, // milliseconds
        });
        return distanceResponse.data.rows[0].elements[0].distance.text;
    } catch (error) {
        logger.error(`Error while retriving distance: ${error}`);
        throw new Error('Error while retriving distance');
    }
}
