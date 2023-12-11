export const isValidToken = async (
  spaceId: string,
  storyblokToken: string,
  timestamp: string,
  token: string,
): Promise<boolean> => {
  const enc = new TextEncoder();
  const validationString = [spaceId, storyblokToken, timestamp].join(':');
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(validationString));
  const computed = Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');

  return token === computed;
};


export const deviceIdCookieName = 'DEVICE_ID';
