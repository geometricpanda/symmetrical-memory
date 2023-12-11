'use client';

import { FC, useCallback, useEffect } from 'react';
import { ISbStoryData, registerStoryblokBridge } from '@storyblok/react/rsc';
import { loadStoryblokBridge } from '@storyblok/react';
import { notifyClient } from './notify-client.action';

export interface StoryblokProviderProps {
  story: ISbStoryData;
  storyId: string;
  deviceId: string;
}

export const StoryblokProvider: FC<StoryblokProviderProps> = (
  {
    story,
    storyId,
    deviceId
  }) => {

  const handleStoryChange = useCallback((storyData: ISbStoryData) => {
    notifyClient(storyId, deviceId, storyData);
  }, [deviceId, storyId]);

  const handleBridgeLoaded = useCallback(() => {
    registerStoryblokBridge(+storyId, handleStoryChange, {});
  }, [storyId, handleStoryChange]);

  useEffect(() => {
    loadStoryblokBridge().then(handleBridgeLoaded);
    handleStoryChange(story);
  }, [story, handleStoryChange, handleBridgeLoaded]);

  return null;
};
