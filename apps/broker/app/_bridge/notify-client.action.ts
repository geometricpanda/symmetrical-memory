'use server';

import 'server-only';
import {ISbStoryData} from '@storyblok/react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite';

const {FIREBASE_CREDENTIAL} = process.env;

if(!FIREBASE_CREDENTIAL) {
  throw new Error('FIREBASE_CREDENTIAL not found');
}

const firebaseCredential = atob(FIREBASE_CREDENTIAL);
const firebaseConfig = JSON.parse(firebaseCredential);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const notifyClient = async (storyId: string, deviceId: string, story: ISbStoryData) => {

  const col = collection(db, 'storyblok-changes');
  const docRef = doc(col, deviceId);

  const data = {
    storyId,
    story,
  }

  try {
    await setDoc(docRef, data);
    console.log(`Document written with ID: ${docRef.id}`);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

};
