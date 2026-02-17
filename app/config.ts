export const config = {
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN as string,
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
  AUTH0_CALLBACK_URL: import.meta.env.VITE_AUTH0_CALLBACK_URL as string,
  AUTH0_API_AUDIENCE: import.meta.env.VITE_AUTH0_API_AUDIENCE as string,

  API_URL: import.meta.env.VITE_API_URL as string,
};