<template>
  <div class="h-full w-full overflow-x-hidden">
    <NuxtPage />
  </div>
</template>

<script setup>
// Verificar autenticação globalmente
const { checkAuth } = useAuth()

onMounted(async () => {
  await checkAuth()
})
</script>
