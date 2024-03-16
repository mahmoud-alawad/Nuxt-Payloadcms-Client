import type { FetchError, FetchOptions } from 'ofetch'
import { stringify } from 'qs'
import type { PayloadCmsError } from '../types/v4'
import { usePayloadCmsUrl } from './usePayloadCmsUrl'
import { usePayloadCmsToken } from './usePayloadCmsToken'
import { useNuxtApp } from '#imports'

const defaultErrors = (err: FetchError) => ({
  status: 500,
  name: 'UnknownError',
  message: err.message,
  details: err,
})

export const usePayloadCmsClient = () => {
  const nuxt = useNuxtApp()
  const baseURL = usePayloadCmsUrl()
  const token = usePayloadCmsToken()

  return async <T>(
    url: string,
    fetchOptions: FetchOptions = {},
  ): Promise<T> => {
    const headers: HeadersInit = {}

    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    // Map params according to payloadcms formats
    if (fetchOptions.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true })
      if (params) {
        url = `${url}?${params}`
      }
      delete fetchOptions.params
    }

    try {
      // @ts-ignore
      return await $fetch<T>(url, {
        retry: 0,
        baseURL,
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      })
    } catch (err: any) {
      // @ts-ignore
      const e: PayloadCmsError = err.data || defaultErrors(err)

      nuxt.hooks.callHook('payloadCms:error' as any, e)
      throw e
    }
  }
}
