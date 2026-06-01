export const encodeBasicAuth = (username: string, password: string) => {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
};
