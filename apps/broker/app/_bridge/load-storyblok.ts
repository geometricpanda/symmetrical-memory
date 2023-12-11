import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

export const loadStoryblok = (accessToken: string) =>
  storyblokInit({
    accessToken,
    use: [apiPlugin],
    apiOptions: {
      cache: {
        type: 'none'
      }
    }
  });
