import { usePayloadAuth } from "../composables/usePayloadAuth.mjs";
import { usePayloadUser } from "../composables/usePayloadUser.mjs";
import { defineNuxtPlugin } from "#imports";
export default defineNuxtPlugin(async () => {
  const user = usePayloadUser();
  if (!user.value) {
    const { fetchUser } = usePayloadAuth();
    await fetchUser();
  }
});
