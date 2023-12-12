import { FC } from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useStoryblokApi } from '@storyblok/react/rsc';

import { deviceIdCookieName } from '../../_utils';
import { StoryblokProvider, loadStoryblok } from '../../_bridge';

import styles from './page.module.css';

loadStoryblok(process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!);

export interface PageProps {
  searchParams?: {
    _storyblok: string;
  };
}

const Page: FC<PageProps> = async ({ searchParams }) => {
  const storyblok = useStoryblokApi();
  const cookieStore = cookies();
  const deviceId = cookieStore.get(deviceIdCookieName);

  const storyId = searchParams?.['_storyblok'];

  if (!storyId || !deviceId) {
    return notFound();
  }

  const url = new URL('exp://u.expo.dev/update/fb7f2813-8118-49fd-91c8-8d11f2d5406d');
  url.searchParams.set('storyId', storyId);
  url.searchParams.set('deviceId', deviceId.value);


  const story = await storyblok.getStory(storyId, {
    version: 'draft'
  });

  if (!story.data.story) {
    return notFound();
  }

  return (
    <div className={styles['page']}>
      <div className={styles['page__qr-code']}>
        <QRCodeSVG size={430} value={url.toString()} />,
      </div>
      <StoryblokProvider
        story={story.data.story}
        storyId={storyId}
        deviceId={deviceId.value} />
    </div>
  );

};

export default Page;
