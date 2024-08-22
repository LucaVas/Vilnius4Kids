import type { Address } from "@vilnius4kids/server/src/entities";

export type Marker = {
  id: number;
  saved: boolean;
  address: Address;
  position: {
    lat: number;
    lng: number;
  };
};
export type Location = {
  lat: number;
  lng: number;
};
