// @ts-nocheck
import { useCookie, useNuxtApp, useRuntimeConfig } from '#imports'

export const usePayloadToken = () => {
  const nuxt = useNuxtApp()
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public

  nuxt._cookies = nuxt._cookies || {}
  if (nuxt._cookies[config.payloadCms.cookieName]) {
    return nuxt._cookies[config.payloadCms.cookieName]
  }

  const cookie = useCookie<string | null>(config.payloadCms.cookieName, config.payloadCms.cookie)
  nuxt._cookies[config.payloadCms.cookieName] = cookie
  return cookie
}
