import { defineNuxtPlugin } from "#imports";
export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    if (process.dev) {
      try {
        const dns = await import("dns");
        await dns.setDefaultResultOrder("ipv4first");
      } catch (e) {
        console.error("Error importing dns module:", e);
      }
    }
  }
});
