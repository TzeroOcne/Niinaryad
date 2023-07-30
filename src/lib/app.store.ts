import { LocationConst } from '@consts';
import type { LocationType, ServiceAccountKey } from '@types';
import { writable } from 'svelte/store';

export const appCounter = writable(0);
export const chromeAPI = (import.meta.env.DEV) ? undefined : chrome;
export const messageStore = writable('');

export const dbIsOpen = writable(false);
export const initParams = new URLSearchParams(window.location.search);

export const initialLocation = initParams.get('location') as LocationType ?? 'home';
let locationVal:LocationType = LocationConst.includes(initialLocation) ? initialLocation : 'home';
export const locationStore = writable(locationVal);
locationStore.subscribe(val => {
  locationVal = val;
});
export const getLocation = () => locationVal;

export const keyFileStore = writable<string>('');
export const keyConfigStore = writable<ServiceAccountKey>();

export const inDev = import.meta.env.DEV;
export const inChrome = chrome != null;

appCounter.subscribe(counter => {
  if (inDev) return;
  chrome.storage.sync.set({
    counter
  });
});

export const increaseAppCounter = () => {
  appCounter.update(value => value + 1);
};

export const decreaseAppCounter = () => {
  appCounter.update(value => value - 1);
};
