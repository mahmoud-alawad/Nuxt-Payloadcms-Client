export default defineNuxtConfig({
  modules: [
    '../src/module'
  ],
  // example of separate client/server URLs
  // runtimeConfig: {
  //   payloadCms: { url: 'http://localhost:4000' },
  //   public: {
  //     payloadCms: { url: 'http://localhost:4000' }
  //   }
  // },
  payloadCms: {
    url: 'http://localhost:4000'
    // To enable the devtools,
    // devtools: true
  },
  devtools: { enabled: true }
})
