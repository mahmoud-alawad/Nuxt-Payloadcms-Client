import * as _nuxt_schema from '@nuxt/schema';

interface AuthOptions {
}
interface ModuleOptions {
    /**
     * Payload API URL
     * @default process.env.PAYLOAD_URL
     * @example 'http://localhost:4000'
     * @type string
     */
    url?: string;
    /**
     * Payload Prefix
     * @default '/api'
     * @type string
     */
    prefix?: string;
    /**
     * Payload Admin Prefix
     * @default '/admin'
     * @type string
     */
    admin?: string;
    /**
     * Nuxt Cookie Options
     * @default {}
     * @type CookieOptions
     */
    cookie?: any;
    /**
     * Payload Cookie Name
     * @default 'payload_jwt'
     * @type string
     */
    cookieName?: string;
    /**
     * Payload Auth Options
     * @default {}
     * @type AuthOptions
     * TODO
     */
    auth?: AuthOptions;
    /**
     * Add Payloadcms Admin in Nuxt Devtools
     *
     * @default false
     */
    devtools?: boolean;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type AuthOptions, type ModuleOptions, _default as default };
