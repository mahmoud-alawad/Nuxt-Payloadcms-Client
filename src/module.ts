import { defu } from 'defu'
import {
  defineNuxtModule,
  addImportsDir,
  addPlugin,
  createResolver,
  extendViteConfig,
  logger,
} from '@nuxt/kit'
import { joinURL } from 'ufo'

export interface AuthOptions {}

export interface ModuleOptions {
  /**
   * Payload API URL
   * @default process.env.PAYLOAD_URL
   * @example 'http://localhost:4000'
   * @type string
   */
  url?: string

  /**
   * Payload Prefix
   * @default '/api'
   * @type string
   */
  prefix?: string

  /**
   * Payload Admin Prefix
   * @default '/admin'
   * @type string
   */
  admin?: string

  /**
   * Nuxt Cookie Options
   * @default {}
   * @type CookieOptions
   */
  cookie?: any

  /**
   * Payload Cookie Name
   * @default 'payload_jwt'
   * @type string
   */
  cookieName?: string

  /**
   * Payload Auth Options
   * @default {}
   * @type AuthOptions
   * TODO
   */
  auth?: AuthOptions

  /**
   * Add Payloadcms Admin in Nuxt Devtools
   *
   * @default false
   */
  devtools?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/payload',
    configKey: 'payload',
    compatibility: {
      nuxt: '^3.0.0-rc.8',
    },
  },
  defaults: {
    url: process.env.PAYLOAD_URL || 'http://localhost:4000',
    prefix: '/api',
    admin: '/admin',
    cookie: {},
    auth: {},
    cookieName: 'payload_jwt',
    devtools: false,
  },
  setup(options:any, nuxt) {
    // Default runtimeConfig
    nuxt.options.runtimeConfig.public.payload = defu(
      nuxt.options.runtimeConfig.public.payload,
      options,
    )
    nuxt.options.runtimeConfig.payload = defu(
      nuxt.options.runtimeConfig.payload,
      options,
    )

    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // Add plugin to load user before bootstrap
    addPlugin(resolve(runtimeDir, 'plugins', 'payload'))
    addPlugin(resolve(runtimeDir, 'plugins', 'dns.server'))

    // Add composables
    addImportsDir(resolve(runtimeDir, 'composables'))
    addImportsDir(resolve(runtimeDir, `composables-${options.version}`))

    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('qs')
    })

    const adminUrl = joinURL(
      //@ts-ignore
      nuxt.options.runtimeConfig.public.payload.url,
      //@ts-ignore
      nuxt.options.runtimeConfig.public.payload.admin,
    )
    logger.info(`Payload Admin URL: ${adminUrl}`)
    if (options.devtools) {
      nuxt.hook('devtools:customTabs', (iframeTabs) => {
        iframeTabs.push({
          name: 'payload',
          title: 'Payload',
          icon: 'i-logos-payload-icon',
          view: {
            type: 'iframe',
            src: adminUrl,
          },
        })
      })
    }
  },
})
