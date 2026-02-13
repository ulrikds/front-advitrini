/**
 * Composable para verificar o status da plataforma (collection PlataformaOnline).
 * - enable: plataforma aberta
 * - disable: fora do ar (redirecionar para /fora-do-ar)
 * - launch: em lançamento (redirecionar para /lancamento com countdown)
 */
export const usePlatformStatus = () => {
  const status = useState('platformStatus', () => ({
    app: 'enable',
    launchDate: null,
    message: '',
    loading: true,
  }));

  const config = useRuntimeConfig();
  const API_URL = config.public.apiUrl || 'http://localhost:4000';

  const fetchStatus = async (force = false) => {
    if (!force && !status.value.loading && status.value.app) {
      return status.value;
    }
    status.value = { ...status.value, loading: true };
    try {
      const res = await fetch(`${API_URL}/api/status`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      const next = {
        app: data.app || 'enable',
        launchDate: data.launchDate || null,
        message: data.message || '',
        loading: false,
      };
      status.value = next;
      return next;
    } catch (e) {
      console.error('Erro ao verificar status da plataforma:', e);
      status.value = {
        app: 'enable',
        launchDate: null,
        message: '',
        loading: false,
      };
      return status.value;
    }
  };

  const isEnabled = computed(() => status.value.app === 'enable');
  const isDisabled = computed(() => status.value.app === 'disable');
  const isLaunch = computed(() => status.value.app === 'launch');
  const launchDate = computed(() => status.value.launchDate ? new Date(status.value.launchDate) : null);

  return {
    status: readonly(status),
    fetchStatus,
    isEnabled,
    isDisabled,
    isLaunch,
    launchDate,
  };
};
