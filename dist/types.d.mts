
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['payload']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['payload']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['payload']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['payload']?: ModuleOptions }
}


export type { AuthOptions, ModuleOptions, default } from './module.js'
