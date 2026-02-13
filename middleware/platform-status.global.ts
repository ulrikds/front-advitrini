/**
 * Middleware global: verifica status da plataforma (PlataformaOnline).
 * - disable -> redireciona para /fora-do-ar
 * - launch -> redireciona para /lancamento (exceto se usuário for admin)
 * - enable -> segue fluxo normal
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const path = to.path || '';

  if (path === '/fora-do-ar' || path === '/lancamento') {
    return;
  }

  const { fetchStatus, isDisabled, isLaunch, status } = usePlatformStatus();
  await fetchStatus();

  if (isDisabled.value) {
    return navigateTo('/fora-do-ar', { replace: true });
  }

  if (isLaunch.value) {
    // No modo launch, home e login continuam acessíveis
    if (path === '/' || path === '/login') {
      return;
    }
    // Validar login: /auth/me retorna usuário e role; se logado e role !== admin -> /lancamento
    const { checkAuth, user } = useAuth();
    await checkAuth(true);
    const isAdmin = user.value?.role === 'admin';
    if (user.value && !isAdmin) {
      return navigateTo('/lancamento', { replace: true });
    }
  }
});
