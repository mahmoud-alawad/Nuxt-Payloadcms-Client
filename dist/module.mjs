import { defu } from 'defu';
import { defineNuxtModule, createResolver, addPlugin, addImportsDir, extendViteConfig, logger } from '@nuxt/kit';
import { joinURL } from 'ufo';

const module = defineNuxtModule({
  meta: {
    name: "@nuxtjs/payload",
    configKey: "payload",
    compatibility: {
      nuxt: "^3.0.0-rc.8"
    }
  },
  defaults: {
    url: process.env.PAYLOAD_URL || "http://localhost:4000",
    prefix: "/api",
    admin: "/admin",
    cookie: {},
    auth: {},
    cookieName: "payload_jwt",
    devtools: false
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.payload = defu(
      nuxt.options.runtimeConfig.public.payload,
      options
    );
    nuxt.options.runtimeConfig.payload = defu(
      nuxt.options.runtimeConfig.payload,
      options
    );
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    addPlugin(resolve(runtimeDir, "plugins", "payload"));
    addPlugin(resolve(runtimeDir, "plugins", "dns.server"));
    addImportsDir(resolve(runtimeDir, "composables"));
    addImportsDir(resolve(runtimeDir, `composables-${options.version}`));
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.include.push("qs");
    });
    const adminUrl = joinURL(
      //@ts-ignore
      nuxt.options.runtimeConfig.public.payload.url,
      //@ts-ignore
      nuxt.options.runtimeConfig.public.payload.admin
    );
    logger.info(`Payload Admin URL: ${adminUrl}`);
    if (options.devtools) {
      nuxt.hook("devtools:customTabs", (iframeTabs) => {
        iframeTabs.push({
          name: "payload",
          title: "Payload",
          icon: "i-logos-payload-icon",
          view: {
            type: "iframe",
            src: adminUrl
          }
        });
      });
    }
  }
});

export { module as default };
