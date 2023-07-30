import { Collection, Config, Home } from '@page';
import type { LocationType, PageItemType } from '@types';
import type { ComponentType } from 'svelte';
import { locationStore } from './app.store';

const locationPageList:PageItemType[] = [
  {
    component: Home,
    location: 'home',
  }, {
    component: Config,
    location: 'config',
  }, {
    component: Collection,
    location: 'store',        
  }
];

locationStore.subscribe(async (location) => {
  const url = new URL(window.location.href);
  url.searchParams.set('location', location);
  history.pushState({}, '', url);
});

export const getLocationPage = (location:LocationType):ComponentType|undefined => {
  return locationPageList.filter(
    ({ location: pageLocation }) => pageLocation === location
  )?.[0]?.component;
};
