import { useRuntimeConfig } from '#imports'

export const usePayloadCmsUrl = (): string => {
  const config = process.server ? useRuntimeConfig() : useRuntimeConfig().public
  return `${config.payloadCms.url}${config.payloadCms.prefix}`
}
