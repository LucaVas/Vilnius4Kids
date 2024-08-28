import { defineStore } from 'pinia';
import { trpc } from '@/trpc';
import type { Playground } from '@vilnius4kids/server/src/entities';
import { TRPCClientError } from '@trpc/client';
import { DEFAULT_SERVER_ERROR } from '@/constants';
import { isLoggedIn } from './user';

type PlaygroundsStore = {
  isPageLoaded: boolean;
  openPlayground: null | Playground;
  saveUnsaveBtnLoading: boolean;
  ratingScheme: {
    rating: number;
    count: number;
  };
  isSaved: boolean;
  pictures: { src: string; alt: string }[];
};

export const usePlaygroundStore = defineStore('playgroundStore', {
  state: (): PlaygroundsStore => ({
    isPageLoaded: false,
    openPlayground: null,
    saveUnsaveBtnLoading: false,
    ratingScheme: {
      rating: 0,
      count: 0,
    },
    isSaved: false,
    pictures: [
      {
        src: 'https://images.pexels.com/photos/9743546/pexels-photo-9743546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Image 1',
      },
      {
        src: 'https://images.pexels.com/photos/19859154/pexels-photo-19859154/free-photo-of-two-deer-eating-in-the-woods-near-a-tree.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Image 2',
      },
      {
        src: 'https://images.pexels.com/photos/18012333/pexels-photo-18012333/free-photo-of-chairlift.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        alt: 'Image 3',
      },
    ],
  }),
  getters: {},
  actions: {
    async populate(id: number): Promise<void> {
      try {
        const [playground, { count, rating }] = await Promise.all([
          trpc.playground.getPlayground.query({ id }),
          trpc.rating.getRating.query({ id }),
        ]);
        this.openPlayground = playground;
        this.ratingScheme = {
          rating,
          count,
        };

        this.isSaved = false; //
        if (isLoggedIn.value) {
          const isAmongFavorites =
            await trpc.playground.isPlaygroundAmongFavorites.query({
              id,
            });
          this.isSaved = isAmongFavorites;
        }

        this.isPageLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    async savePlayground(): Promise<void> {
      this.saveUnsaveBtnLoading = true;
      if (this.openPlayground) {
        try {
          await trpc.playground.addFavoritePlayground.mutate({
            id: this.openPlayground.id,
          });
          this.isSaved = true;
        } catch (e) {
          //
        } finally {
          this.saveUnsaveBtnLoading = false;
        }
      }
    },
    async unsavePlayground() {
      this.saveUnsaveBtnLoading = true;
      if (this.openPlayground) {
        try {
          await trpc.playground.deleteFavoritePlayground.mutate({
            id: this.openPlayground.id,
          });
          this.isSaved = false;
        } catch (e) {
          //
        } finally {
          this.saveUnsaveBtnLoading = false;
        }
      }
    },
    async ratePlayground(starRating: number): Promise<void | string> {
      if (!this.openPlayground) return;
      try {
        const { newRating } = await trpc.rating.rate.mutate({
          playgroundId: this.openPlayground.id,
          rating: starRating,
        });
        this.ratingScheme = {
          rating: newRating,
          // TODO: fix in case is same user
          count: this.ratingScheme.count + 1,
        };
      } catch (error) {
        if (error instanceof TRPCClientError) {
          return error.data.message || error.message;
        } else {
          return DEFAULT_SERVER_ERROR;
        }
      }
    },
  },
});
