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
  saveUnsaveBtnLoading: boolean;
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
    saveUnsaveBtnLoading: false,
  }),
  getters: {
    mapCenter(state): Location {
      if (state.openedMarker) {
        return state.openedMarker.position;
      }
      if (state.lastMarker) {
        return state.lastMarker.position;
      } else return state.userLocation ?? state.cityCenter;
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
    async savePlayground(): Promise<void> {
      this.saveUnsaveBtnLoading = true;
      if (this.openedMarker) {
        try {
          await trpc.playground.addFavoritePlayground.mutate({
            id: this.openedMarker.id,
          });
          this.playgrounds
            .filter((p) => p.id === this.openedMarker?.id)
            .map((p) => (p.saved = true));
        } catch (e) {
          //
        } finally {
          this.saveUnsaveBtnLoading = false;
        }
      }
    },
    async unsavePlayground(id: number) {
      this.saveUnsaveBtnLoading = true;
      if (this.openedMarker) {
        try {
          await trpc.playground.deleteFavoritePlayground.mutate({ id });
          this.playgrounds.filter((p) => p.id === id).map((p) => (p.saved = false));
        } catch (e) {
          //
        } finally {
          this.saveUnsaveBtnLoading = false;
        }
      }
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
