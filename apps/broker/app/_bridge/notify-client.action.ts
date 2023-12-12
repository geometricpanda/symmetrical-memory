'use server';

import 'server-only';
import {ISbStoryData} from '@storyblok/react';
import {GoogleAuth} from 'google-auth-library';
import {PubSub} from '@google-cloud/pubsub';

const {GOOGLE_TOPIC_NAME, GOOGLE_APPLICATION_CREDENTIAL} = process.env;


if (!GOOGLE_TOPIC_NAME) {
  throw new Error('Missing GOOGLE_TOPIC_NAME');
}

if (!GOOGLE_APPLICATION_CREDENTIAL) {
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIAL');
}

const credential_str = atob(GOOGLE_APPLICATION_CREDENTIAL);
const credentials = JSON.parse(credential_str);

const auth = new GoogleAuth({
  projectId: credentials.project_id,
  credentials: credentials,
});

const pubSubClient = new PubSub({
  projectId: credentials.project_id,
  auth,
});

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
      .publishMessage({data: dataBuffer});

    console.log(`Message`, storyId, `published for client`, deviceId);

  } catch (error) {
    console.error(`Received error while publishing:`, error);
  }

};
