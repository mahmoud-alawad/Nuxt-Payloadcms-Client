<template>
  <div class="container flex items-center justify-center">
    <h1>@nuxtjs/payload</h1>

    <h2>Url</h2>
    <pre>{{ url }}</pre>
    <h2>Version</h2>
    <pre>{{ version }}</pre>

    <div v-if="user">
      <h2>User</h2>
      <button type="button" @click="async () => await logout()">
        Logout
      </button>
      <pre>{{ user }}</pre>
    </div>
    <form v-else @submit.prevent="onSubmit">
      <input v-model="form.email" placeholder="Email" type="text" name="email" required>

      <input v-model="form.password" placeholder="Password" type="password" name="password" required>

      <button type="submit">
        {{ loading ? "Loading..." : "Login" }}
      </button>
    </form>
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
const url = usePayloadUrl()
const version = 22
const user = useState('payload_user')
const { login, logout } = usePayloadAuth()
const { find } = usePayload()

const { data } = await useAsyncData('header', () => find('globals/footer'))
const loading = ref(false)
const form = reactive({ email: '', password: '' })

const onSubmit = async () => {
  loading.value = true

  try {
    await login(form)
    console.log(user)
  } catch (e) {
    console.error(e)
    alert('auth error watch console')
  }

  loading.value = false
}
</script>
