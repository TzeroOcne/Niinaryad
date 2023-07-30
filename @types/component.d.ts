import { ComponentType } from 'svelte';
import { LocationType } from '.';

export interface HeaderItemType {
  label: string;
  location: LocationType;
  children?: HeaderItem[];
}

export interface PageItemType {
  component: ComponentType;
  location: LocationType;
}