import { defineStore } from 'pinia';
import type { Location, Marker } from '@/components/types/Map';
import { trpc } from '@/trpc';
import { authUserId } from '@/stores/user';

type MapStoreState = {
  cityCenter: Location;
  styles: any;
  playgrounds: Marker[];
  openedMarker: null | Marker;
  lastMarker: null | Marker;
  playgroundLocation: null | Location;
  userLocation: null | Location;
  geolocationLoading: boolean;
  geolocationAllowed: boolean;
};

export const useMapStore = defineStore('mapStore', {
  state: (): MapStoreState => ({
    cityCenter: {
      lat: 54.6872,
      lng: 25.2797,
    },
    styles: [
      {
        featureType: 'poi.school',
        stylers: [{ visibility: 'on' }, { saturation: -100 }, { color: '#99FF33' }],
      },
      {
        featureType: 'administrative',
        stylers: [{ visibility: 'off' }],
      },
    ],

    playgrounds: [] satisfies Marker[],
    openedMarker: null,
    lastMarker: null,
    playgroundLocation: null,
    userLocation: null,
    geolocationLoading: false,
    geolocationAllowed: false,
  }),
  getters: {
    mapCenter(state) {
      if (this.openedMarker) {
        return this.openedMarker.position;
      }
      if (this.lastMarker) {
        return this.lastMarker;
      } else return this.userLocation ?? this.cityCenter;
    },
  },
  actions: {
    openMarker(marker: Marker | null) {
      if (marker) {
        this.openedMarker = marker;
        this.playgroundLocation = marker.position;
      }
    },
    closeMarker() {
      this.lastMarker = this.openedMarker;
      this.openedMarker = null;
    },
    savePlayground(id: number): void {
      (this.playgrounds as Marker[]).filter((p) => p.id === id).map((p) => (p.saved = true));
    },
    unsavePlayground(id: number) {
      (this.playgrounds as Marker[]).filter((p) => p.id === id).map((p) => (p.saved = false));
    },
    async populate(): Promise<void> {
      try {
        const { playgrounds } = await trpc.playground.getPlaygrounds.query();
        this.playgrounds = playgrounds.map((p) => ({
          id: p.id,
          position: {
            lat: Number(p.latitude),
            lng: Number(p.longitude),
          },
          address: p.address,
          saved: p.users.some((user) => user.id === authUserId.value),
        }));
      } catch (e) {
        console.log(e);
      }
    },
    loadUserLocation(): void {
      this.geolocationLoading = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.geolocationAllowed = true;
          this.geolocationLoading = false;
        }),
          (error: GeolocationPositionError) => {
            this.geolocationAllowed = false;
            this.geolocationLoading = false;
            console.error(
              'Geolocation is not supported or not allowed. Allow geolocation to use distance calculation feature.' +
                error.message
            );
          };
      }
    },
  },
});
