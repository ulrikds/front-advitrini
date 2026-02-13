<template>
  <div class="min-h-screen">
    <!-- Cards de Crédito -->
    <div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <!-- Total de Créditos -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-2 sm:p-4 lg:p-6 xl:p-8 transform hover:scale-105 hover:bg-white/40 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-400/20 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:bg-blue-400/30 transition-all"></div>
        <div class="flex items-center justify-between mb-2 sm:mb-4 lg:mb-6 relative z-10">
          <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-1 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'chart-line']" class="text-blue-600 text-sm sm:text-lg lg:text-xl xl:text-2xl" />
          </div>
          <span class="text-[8px] sm:text-xs font-semibold text-blue-700 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">TOTAL</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-slate-600 text-[10px] sm:text-xs lg:text-sm font-medium mb-0.5 sm:mb-1 lg:mb-2 leading-tight">Daily Credit Limit</h3>
          <p class="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-0.5 sm:mb-1 lg:mb-2 leading-tight">{{ dailyCreditLimit.toLocaleString('en-US') }}</p>
          <p class="text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-tight hidden sm:block">Daily credits available for your plan</p>
        </div>
      </div>

      <!-- Créditos Consumidos -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-2 sm:p-4 lg:p-6 xl:p-8 transform hover:scale-105 hover:bg-white/40 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-amber-400/20 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:bg-amber-400/30 transition-all"></div>
        <div class="flex items-center justify-between mb-2 sm:mb-4 lg:mb-6 relative z-10">
          <div class="backdrop-blur-sm bg-amber-500/20 border border-amber-400/30 p-1 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'fire']" class="text-amber-600 text-sm sm:text-lg lg:text-xl xl:text-2xl" />
          </div>
          <span class="text-[8px] sm:text-xs font-semibold text-amber-700 bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">CONSUMED</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-slate-600 text-[10px] sm:text-xs lg:text-sm font-medium mb-0.5 sm:mb-1 lg:mb-2 leading-tight">Credits Consumed</h3>
          <p class="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 to-amber-600 bg-clip-text text-transparent mb-0.5 sm:mb-1 lg:mb-2 leading-tight">{{ consumedCredits.toLocaleString('en-US') }}</p>
          <p class="text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-tight hidden sm:block">{{ consumptionPercentage }}% of total used</p>
        </div>
      </div>

      <!-- Créditos Restantes -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-2 sm:p-4 lg:p-6 xl:p-8 transform hover:scale-105 hover:bg-white/40 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-emerald-400/20 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:bg-emerald-400/30 transition-all"></div>
        <div class="flex items-center justify-between mb-2 sm:mb-4 lg:mb-6 relative z-10">
          <div class="backdrop-blur-sm bg-emerald-500/20 border border-emerald-400/30 p-1 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'star']" class="text-emerald-600 text-sm sm:text-lg lg:text-xl xl:text-2xl" />
          </div>
          <span class="text-[8px] sm:text-xs font-semibold text-emerald-700 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">AVAILABLE</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-slate-600 text-[10px] sm:text-xs lg:text-sm font-medium mb-0.5 sm:mb-1 lg:mb-2 leading-tight">Remaining Credits</h3>
          <p class="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent mb-0.5 sm:mb-1 lg:mb-2 leading-tight">{{ (remainingCredits || user?.credits || 0).toLocaleString('en-US') }}</p>
          <p class="text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-tight hidden sm:block">Ready to use</p>
        </div>
      </div>

      <!-- Storage Limit -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-2 sm:p-4 lg:p-6 xl:p-8 transform hover:scale-105 hover:bg-white/40 transition-all duration-300 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
        <div class="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-purple-400/20 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:bg-purple-400/30 transition-all"></div>
        <div class="flex items-center justify-between mb-2 sm:mb-4 lg:mb-6 relative z-10">
          <div class="backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 p-1 sm:p-2 lg:p-3 xl:p-4 rounded-lg sm:rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'hard-drive']" class="text-purple-600 text-sm sm:text-lg lg:text-xl xl:text-2xl" />
          </div>
          <span class="text-[8px] sm:text-xs font-semibold text-purple-700 bg-purple-400/20 backdrop-blur-sm border border-purple-400/30 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">STORAGE</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-slate-600 text-[10px] sm:text-xs lg:text-sm font-medium mb-0.5 sm:mb-1 lg:mb-2 leading-tight">Drive Storage Limit</h3>
          <p class="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-0.5 sm:mb-1 lg:mb-2 leading-tight">{{ getStorageLimit(user?.role) }}</p>
          <p class="text-[9px] sm:text-xs lg:text-sm text-slate-600 leading-tight hidden sm:block">Maximum storage for your plan</p>
        </div>
      </div>
    </div>

    <!-- Barra de Progresso -->
    <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
        <div>
          <h2 class="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-1">Consumption Progress</h2>
          <p class="text-xs sm:text-sm text-slate-600 font-medium">Track your credit usage</p>
        </div>
        <div class="text-left sm:text-right backdrop-blur-sm bg-amber-500/10 border border-amber-400/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
          <p class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">{{ consumptionPercentage }}%</p>
          <p class="text-xs sm:text-sm text-slate-600">Used</p>
        </div>
      </div>
      <div class="relative w-full backdrop-blur-sm bg-slate-200/40 border border-slate-300/30 rounded-full h-6 sm:h-8 overflow-hidden shadow-inner">
        <div
          class="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-1.5 sm:pr-2 shadow-lg relative"
          :style="{ width: `${consumptionPercentage}%` }"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div class="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg border-2 border-amber-300 relative z-10"></div>
        </div>
      </div>
      <div class="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium">
        <span>0 credits</span>
        <span>{{ dailyCreditLimit.toLocaleString('en-US') }} credits</span>
      </div>
    </div>

    <!-- Estatísticas e Atividades -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Últimas Atividades -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden order-2 lg:order-1">
        <div class="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16 sm:-mr-20 sm:-mt-20"></div>
        <div class="flex items-center justify-between mb-4 sm:mb-6 relative z-10 flex-wrap gap-2">
          <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">Recent Activities</h3>
          <div class="flex items-center space-x-2 sm:space-x-3">
            <button
              @click="isActivitiesExpanded = !isActivitiesExpanded"
              class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-blue-500/30 transition-all duration-300"
              :title="isActivitiesExpanded ? 'Minimize' : 'Expand'"
            >
              <font-awesome-icon 
                :icon="isActivitiesExpanded ? ['fas', 'compress'] : ['fas', 'expand']" 
                class="text-blue-600 text-lg sm:text-xl" 
              />
            </button>
            <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-2 sm:p-3 rounded-lg sm:rounded-xl">
              <font-awesome-icon :icon="['fas', 'credit-card']" class="text-blue-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
        <div v-if="loadingActivities" class="flex items-center justify-center py-6 sm:py-8 relative z-10">
          <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-slate-300 border-t-amber-500"></div>
        </div>
        <div v-else-if="recentActivities.length === 0" class="text-center py-6 sm:py-8 text-slate-600 relative z-10">
          <p class="text-sm sm:text-base">No activities yet. Start creating mannequins, products, or videos!</p>
        </div>
        <div v-else class="relative z-10">
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="activity in displayedActivities"
              :key="activity.id"
              class="flex items-center justify-between p-3 sm:p-4 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg sm:rounded-xl hover:bg-white/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div class="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                <div class="p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm border shadow-lg transition-all group-hover:scale-110 flex-shrink-0" 
                     :class="{
                       'bg-blue-500/20 border-blue-400/30': activity.type === 'mannequin',
                       'bg-emerald-500/20 border-emerald-400/30': activity.type === 'product',
                       'bg-purple-500/20 border-purple-400/30': activity.type === 'video'
                     }">
                  <font-awesome-icon 
                    :icon="activity.type === 'mannequin' ? ['fas', 'user'] : activity.type === 'product' ? ['fas', 'shopping-bag'] : ['fas', 'video']" 
                    class="text-base sm:text-lg"
                    :class="{
                      'text-blue-600': activity.type === 'mannequin',
                      'text-emerald-600': activity.type === 'product',
                      'text-purple-600': activity.type === 'video'
                    }"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-xs sm:text-sm lg:text-base text-slate-800 truncate">{{ activity.title }}</p>
                  <p class="text-xs font-medium text-slate-500 mt-0.5 sm:mt-1">{{ getCreationType(activity) }}</p>
                  <p class="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">{{ activity.timeAgo || activity.time }}</p>
                </div>
              </div>
              <div class="text-right backdrop-blur-sm bg-amber-500/10 border border-amber-400/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 ml-2 sm:ml-4 flex-shrink-0">
                <p class="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">-{{ activity.credits }}</p>
                <p class="text-xs text-slate-600">credits</p>
              </div>
            </div>
          </div>
          
          <!-- Paginação quando expandido -->
          <div v-if="isActivitiesExpanded && totalPages > 1" class="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20 gap-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-blue-600 text-sm sm:text-base" />
            </button>
            <span class="text-xs sm:text-sm font-medium text-slate-700 text-center flex-1">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-blue-600 text-sm sm:text-base" />
            </button>
          </div>
          
          <!-- Botão para ver mais quando minimizado -->
          <div v-if="!isActivitiesExpanded && recentActivities.length > 7" class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20 text-center">
            <button
              @click="isActivitiesExpanded = true"
              class="px-4 sm:px-6 py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-blue-700 font-medium text-sm sm:text-base"
            >
              View All ({{ recentActivities.length }} activities)
            </button>
          </div>
        </div>
      </div>

      <!-- Resumo do Mês -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden order-1 lg:order-2">
        <div class="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-slate-400/10 rounded-full blur-3xl -mr-16 -mt-16 sm:-mr-20 sm:-mt-20"></div>
        <div class="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
          <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">Monthly Summary</h3>
          <div class="backdrop-blur-sm bg-slate-500/20 border border-slate-400/30 p-2 sm:p-3 rounded-lg sm:rounded-xl">
            <font-awesome-icon :icon="['fas', 'chart-line']" class="text-slate-600 text-lg sm:text-xl" />
          </div>
        </div>
        <div class="space-y-4 sm:space-y-6 relative z-10">
          <div class="flex items-center justify-between p-3 sm:p-4 backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-lg sm:rounded-xl hover:bg-blue-500/15 transition-all duration-300 group">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 p-2 sm:p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'chart-line']" class="text-blue-600 text-sm sm:text-base" />
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm text-slate-600 font-medium">Credits used this month</p>
                <p class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">{{ monthlyConsumption.toLocaleString('en-US') }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 sm:p-4 backdrop-blur-sm bg-emerald-500/10 border border-emerald-400/20 rounded-lg sm:rounded-xl hover:bg-emerald-500/15 transition-all duration-300 group">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 p-2 sm:p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'chart-line']" class="text-emerald-600 text-sm sm:text-base" />
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm text-slate-600 font-medium">Daily average</p>
                <p class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent">{{ dailyAverage.toLocaleString('en-US') }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 sm:p-4 backdrop-blur-sm bg-purple-500/10 border border-purple-400/20 rounded-lg sm:rounded-xl hover:bg-purple-500/15 transition-all duration-300 group">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="backdrop-blur-sm bg-purple-500/30 border border-purple-400/40 p-2 sm:p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'chart-line']" class="text-purple-600 text-sm sm:text-base" />
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm text-slate-600 font-medium">Monthly projection</p>
                <p class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">{{ monthlyProjection.toLocaleString('en-US') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// Estado
const consumedCredits = ref(0)
const remainingCredits = ref(0)
const monthlyConsumption = ref(0)
const recentActivities = ref([])
const allActivities = ref([]) // Todas as atividades para paginação
const loadingActivities = ref(false)
const isActivitiesExpanded = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

// Computed - Get daily credit limit by role
const getDailyCreditsByRole = (role) => {
  const creditsByRole = {
    free: 200,
    gold: 5000,
    diamante: 25000,
    custom: 10000,
    admin: 0, // Admin users don't have daily credits limit
  }
  return creditsByRole[role] || creditsByRole.free
}

// Computed - Daily credit limit for current user
const dailyCreditLimit = computed(() => {
  if (!user.value) return 200
  return getDailyCreditsByRole(user.value.role)
})

// Helper function to get storage limit by plan
const getStorageLimit = (role) => {
  const limits = {
    free: '1GB',
    gold: '10GB',
    diamante: '100GB',
    diamond: '100GB', // backend may return 'diamond' or 'diamante'
    custom: '10GB', // Default for custom plans
    admin: 'Unlimited'
  }
  return limits[role] || limits.free
}

// Computed
const consumptionPercentage = computed(() => {
  // Always use dailyCreditLimit based on user role, not totalCredits from backend
  const limit = dailyCreditLimit.value
  if (limit === 0) return 0
  return Math.round((consumedCredits.value / limit) * 100)
})

const dailyAverage = computed(() => {
  const daysInMonth = new Date().getDate()
  return daysInMonth > 0 ? Math.round(monthlyConsumption.value / daysInMonth) : 0
})

const monthlyProjection = computed(() => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  return dailyAverage.value * daysInMonth
})

// Computed para atividades exibidas
const displayedActivities = computed(() => {
  if (!isActivitiesExpanded.value) {
    // Modo minimizado: mostrar apenas os últimos 7
    return recentActivities.value.slice(0, 7)
  } else {
    // Modo maximizado: paginação de 10 em 10
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allActivities.value.slice(start, end)
  }
})

// Computed para total de páginas
const totalPages = computed(() => {
  return Math.ceil(allActivities.value.length / itemsPerPage)
})

// Função para obter o tipo de criação
const getCreationType = (activity) => {
  if (activity.type === 'mannequin') {
    return 'Model Mannequin com imagem'
  } else if (activity.type === 'product') {
    return 'Product Presentation Image'
  } else if (activity.type === 'video') {
    // Verificar se é control motion ou product presentation video
    if (activity.metadata?.type === 'control_motion') {
      return 'Motion Track'
    } else {
      return 'Product Presentation Video'
    }
  }
  return 'Unknown'
}

// Função para buscar atividades e estatísticas
const fetchActivities = async () => {
  if (!user.value) return

  loadingActivities.value = true
  try {
    const response = await fetch(`${API_URL}/auth/activities`, {
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        allActivities.value = data.activities || []
        recentActivities.value = data.activities || []
        monthlyConsumption.value = data.monthlyConsumption || 0
        consumedCredits.value = data.totalConsumption || 0
        // Don't use totalCredits from backend, use dailyCreditLimit based on user role instead
        // totalCredits.value = data.totalCredits || 0
        remainingCredits.value = data.remainingCredits || 0
        // Reset para primeira página quando expandir
        if (isActivitiesExpanded.value) {
          currentPage.value = 1
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
  } finally {
    loadingActivities.value = false
  }
}

// Atualizar dados do usuário quando disponível
watch(user, async (newUser) => {
  if (newUser) {
    // Always fetch activities when user is available
    await fetchActivities()
    // Update remaining credits from user data
    remainingCredits.value = newUser.credits || 0
  }
}, { immediate: true })

// Buscar atividades periodicamente (a cada 30 segundos)
onMounted(() => {
  if (user.value) {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    onUnmounted(() => clearInterval(interval))
  }
})
</script>
