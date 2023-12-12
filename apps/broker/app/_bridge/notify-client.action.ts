'use server';

import 'server-only';
import { ISbStoryData } from '@storyblok/react';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

const { GOOGLE_TOPIC_NAME } = process.env;

if (!GOOGLE_TOPIC_NAME) {
  throw new Error('Missing GOOGLE_TOPIC_NAME');
}

interface Message {
  ClientId: string;
  StoryData: string;
  StoryId: number;
}

export const notifyClient = async (storyId: string, deviceId: string, story: ISbStoryData) => {

  const message: Message = {
    ClientId: deviceId,
    StoryData: JSON.stringify(story),
    StoryId: +storyId
  };

  const dataBuffer = Buffer.from(JSON.stringify(message));

  try {
    await pubSubClient
      .topic(GOOGLE_TOPIC_NAME)
      .publishMessage({ data: dataBuffer });
  } catch (error) {
    console.error(`Received error while publishing:`, error);
  }

};
