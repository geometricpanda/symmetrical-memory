/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '@storyblok/react/rsc' {
  export * from '@storyblok/react/dist/types/rsc';
}
