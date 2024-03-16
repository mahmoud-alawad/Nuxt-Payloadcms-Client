import { usePayloadCmsAuth } from '../composables/usePayloadCmsAuth'
import { usePayloadCmsUser } from '../composables/usePayloadCmsUser'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(async () => {
  const user = usePayloadCmsUser()

  if (!user.value) {
    const { fetchUser } = usePayloadCmsAuth()

    await fetchUser()
  }
})
