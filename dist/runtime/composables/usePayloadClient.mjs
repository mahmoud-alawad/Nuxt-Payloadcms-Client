import { stringify } from "qs";
import { usePayloadUrl } from "./usePayloadUrl.mjs";
import { usePayloadToken } from "./usePayloadToken.mjs";
import { useNuxtApp } from "#imports";
const defaultErrors = (err) => ({
  status: 500,
  name: "UnknownError",
  message: err.message,
  details: err
});
export const usePayloadClient = () => {
  const nuxt = useNuxtApp();
  const baseURL = usePayloadUrl();
  const token = usePayloadToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    if (fetchOptions.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true });
      if (params) {
        url = `${url}?${params}`;
      }
      delete fetchOptions.params;
    }
    try {
      return await $fetch(url, {
        retry: 0,
        baseURL,
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers
        }
      });
    } catch (err) {
      const e = err.data || defaultErrors(err);
      nuxt.hooks.callHook("payloadCms:error", e);
      throw e;
    }
  };
};
