import { usePayloadAuth } from '../composables/usePayloadAuth'
import { usePayloadUser } from '../composables/usePayloadUser'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(async () => {
  const user = usePayloadUser()

  if (!user.value) {
    const { fetchUser } = usePayloadAuth()

    await fetchUser()
  }
})
