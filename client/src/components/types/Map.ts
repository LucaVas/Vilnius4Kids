import type { Address } from '@vilnius4kids/server/src/entities';

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

export type AutocompletedAddress = {
  address_components: [
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
    {
      long_name: string;
      short_name: string;
      types: string[];
    },
    {
      long_name: string;
      short_name: string;
      types: string;
    },
  ];
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
    viewport: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };
  icon: string;
  name: string;
  html_attributions: string[];
};
