export const useAuth = () => {
  const user = useState('user', () => null);
  const isAuthenticated = computed(() => !!user.value);
  const loading = useState('authLoading', () => false);
  const checkingAuth = useState('checkingAuth', () => false);
  const lastCheckTime = useState('lastCheckTime', () => 0);

  const config = useRuntimeConfig();
  const API_URL = config.public.apiUrl || 'http://localhost:4000';

  // Verificar se o usuário está autenticado
  const checkAuth = async (force = false) => {
    // Evitar múltiplas chamadas simultâneas
    if (checkingAuth.value && !force) {
      return isAuthenticated.value;
    }

    // Evitar chamadas muito frequentes (debounce de 2 segundos)
    const now = Date.now();
    if (!force && now - lastCheckTime.value < 2000) {
      return isAuthenticated.value;
    }

    checkingAuth.value = true;
    loading.value = true;
    lastCheckTime.value = now;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include', // Importante para enviar cookies
      });

      if (response.status === 503) {
        const data = await response.json().catch(() => ({}));
        // disable: redireciona para fora do ar
        if (data.platformStatus === 'disable' && process.client) {
          await navigateTo('/fora-do-ar', { replace: true });
        }
        // launch: não redirecionar aqui; o middleware só manda para /lancamento quando o usuário estiver logado e role !== admin
        user.value = null;
        checkingAuth.value = false;
        loading.value = false;
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          user.value = data.user;
          checkingAuth.value = false;
          loading.value = false;
          return true;
        }
      }
      user.value = null;
      checkingAuth.value = false;
      loading.value = false;
      return false;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      user.value = null;
      checkingAuth.value = false;
      loading.value = false;
      return false;
    }
  };

  // Fazer login (redireciona para o backend)
  const login = () => {
    if (process.client) {
      console.log('Redirecionando para:', `${API_URL}/auth/google`);
      window.location.href = `${API_URL}/auth/google`;
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      user.value = null;
      checkingAuth.value = false;
      // Redirecionar para home após logout
      if (process.client) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      user.value = null;
      checkingAuth.value = false;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    loading: readonly(loading),
    checkAuth,
    login,
    logout,
  };
};
