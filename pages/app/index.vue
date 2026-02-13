<template>
  <div class="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 relative overflow-hidden max-h-screen">
    <!-- Background Pattern - Ice & Steel -->
    <div class="absolute inset-0 opacity-40">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl opacity-15"></div>
    </div>
    
    <!-- Sidebar -->
    <AppSidebar 
      :active-menu="activeMenu" 
      @menu-change="handleMenuChange" 
    />
    
    <!-- Container Principal -->
    <main class="flex-1 relative z-10 h-full overflow-y-auto overflow-x-hidden pb-16 md:pb-0 md:ml-0 transition-all duration-300" :class="isMinimized ? 'md:ml-20' : 'md:ml-64'">
      <div class="p-4 sm:p-6 w-full max-w-[80%] mx-auto">
        <component :is="currentComponent" />
      </div>
    </main>
  </div>
</template>

<script setup>
// Importar componentes
import PagesDashboard from '~/components/pages/Dashboard.vue'
import PagesModelMannequin from '~/components/pages/CreationModelMannequin.vue'
import PagesProductPresentation from '~/components/pages/CreationProductApresentation.vue'
import PagesVideoCreation from '~/components/pages/CreationVideoVeo.vue'
import PagesTrackMotion from '~/components/pages/CreationTrackMotion.vue'
import PagesSettings from '~/components/pages/Settings.vue'
import PagesPricing from '~/components/pages/Pricing.vue'
import PagesBilling from '~/components/pages/Billing.vue'
import PagesAdminStatistics from '~/components/pages/AdminStatistics.vue'
import PagesVitriniDrive from '~/components/pages/VitriniDrive.vue'
import PagesVideoEditor from '~/components/pages/VideoEditor.vue'
import PagesShowVitrini from '~/components/pages/ShowVitrini.vue'
import PagesStudioManequin from '~/components/pages/StudioManequin.vue'
import PagesVitriniTemplate from '~/components/pages/VitriniTemplate.vue'
import PagesFaceSwap from '~/components/pages/FaceSwap.vue'
import PagesMakeup from '~/components/pages/CreationMakeup.vue'
import PagesTikTokTips from '~/components/pages/TikTokTips.vue'

// Autenticação
const { isAuthenticated, loading: authLoading, checkAuth } = useAuth()

// Verificar autenticação
onMounted(async () => {
  await checkAuth()
  if (!isAuthenticated.value) {
    await navigateTo('/login')
  }
})

// Watch para redirecionar se desautenticar
watch(isAuthenticated, (authenticated) => {
  if (!authenticated) {
    navigateTo('/login')
  }
})

// Estado do menu ativo - ler da query string ou usar padrão
const route = useRoute()
const activeMenu = useState('activeMenu', () => {
  const menuFromQuery = route.query.menu
  return (menuFromQuery && typeof menuFromQuery === 'string' ? menuFromQuery : null) || 'vitrini-drive'
})

// Estado do sidebar (minimizado/maximizado) para ajustar o margin do main
const isMinimized = useState('sidebarMinimized', () => false)

// Atualizar menu quando a query mudar
watch(() => route.query.menu, (newMenu) => {
  if (newMenu && typeof newMenu === 'string') {
    activeMenu.value = newMenu
  }
})

// Mapeamento de menus para componentes
const menuComponents = {
  dashboard: PagesDashboard,
  'tiktok-tips': PagesTikTokTips,
  pricing: PagesPricing,
  billing: PagesBilling,
  'vitrini-drive': PagesVitriniDrive,
  'vitrini-template': PagesVitriniTemplate,
  'model-mannequin': PagesModelMannequin,
  'studio-mannequin': PagesStudioManequin,
  'product-presentation': PagesProductPresentation,
  'video-creation': PagesVideoCreation,
  'track-motion': PagesTrackMotion,
  'video-editor': PagesVideoEditor,
  'face-swap': PagesFaceSwap,
  'makeup': PagesMakeup,
  settings: PagesSettings,
  'admin-statistics': PagesAdminStatistics,
  'show-vitrini': PagesShowVitrini,
}

// Componente atual baseado no menu ativo
const currentComponent = computed(() => {
  return menuComponents[activeMenu.value] || menuComponents['vitrini-drive']
})

// Handler para mudança de menu
const handleMenuChange = (menu) => {
  activeMenu.value = menu
  // Atualizar a URL sem recarregar a página
  navigateTo({ path: '/app', query: { menu } }, { replace: true })
}

definePageMeta({
  layout: false,
  middleware: 'auth'
})
</script>
