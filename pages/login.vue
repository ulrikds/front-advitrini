<template>
  <PagesLogin />
</template>

<script setup>
import PagesLogin from '~/components/pages/Login.vue'

definePageMeta({
  layout: false
})

// Se já estiver autenticado, redirecionar para /app
const { isAuthenticated, checkAuth } = useAuth()

onMounted(async () => {
  await checkAuth()
  if (isAuthenticated.value) {
    await navigateTo('/app')
  }
})

// Watch para redirecionar se autenticar
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    navigateTo('/app')
  }
})
</script>
