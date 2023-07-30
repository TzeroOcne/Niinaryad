export const LocationList = ['home', 'config', 'store'] as const;
export type LocationType = typeof LocationList[number];
export type TimerIDType = string | number | ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;
declare module '@fortawesome/pro-solid-svg-icons/index.es' {
  export * from '@fortawesome/pro-solid-svg-icons';
}