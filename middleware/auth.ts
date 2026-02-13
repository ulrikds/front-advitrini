export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()
  
  // Verificar autenticação
  await checkAuth()
  
  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
