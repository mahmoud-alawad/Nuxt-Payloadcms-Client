import { useCookie, useNuxtApp, useRuntimeConfig } from "#imports";
export const usePayloadToken = () => {
  const nuxt = useNuxtApp();
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public;
  nuxt._cookies = nuxt._cookies || {};
  if (nuxt._cookies[config.payload.cookieName]) {
    return nuxt._cookies[config.payload.cookieName];
  }
  const cookie = useCookie(config.payload.cookieName, config.payload.cookie);
  nuxt._cookies[config.payload.cookieName] = cookie;
  return cookie;
};
