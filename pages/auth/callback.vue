<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <div v-if="loading" class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p v-if="loading" class="mt-4 text-gray-600">Loading login...</p>
      <div v-else-if="error" class="text-red-600">
        <p class="text-lg font-semibold">Error in login</p>
        <p class="mt-2">{{ error }}</p>
        <button
          @click="goToLogin"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try again...
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { checkAuth } = useAuth();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const route = useRoute();
  const success = route.query.success;
  const errorParam = route.query.error;

  if (success === 'true') {
    // Login bem-sucedido, aguardar um pouco para garantir que os cookies sejam processados
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar autenticação com força (force = true)
    try {
      const authenticated = await checkAuth(true);
      if (authenticated) {
        // Aguardar um pouco mais antes de redirecionar para garantir que o estado seja atualizado
        await new Promise(resolve => setTimeout(resolve, 300));
        // Redirecionar para /app após login bem-sucedido
        await navigateTo('/app', { replace: true });
      } else {
        error.value = 'Não foi possível verificar sua autenticação. Por favor, tente fazer login novamente.';
        loading.value = false;
      }
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      error.value = 'Erro ao processar login. Por favor, tente novamente.';
      loading.value = false;
    }
  } else {
    // Tratar diferentes tipos de erro
    if (errorParam === 'oauth_not_configured') {
      error.value = 'Google OAuth não está configurado no servidor. Entre em contato com o administrador.';
    } else if (errorParam) {
      error.value = decodeURIComponent(errorParam);
    } else {
      error.value = 'Falha na autenticação com Google';
    }
    loading.value = false;
  }
});

const goToLogin = () => {
  navigateTo('/login');
};
</script>
