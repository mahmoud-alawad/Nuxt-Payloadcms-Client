import { useRuntimeConfig } from "#imports";
export const usePayloadUrl = () => {
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public;
  return `${config.payload.url}${config.payload.prefix}`;
};
