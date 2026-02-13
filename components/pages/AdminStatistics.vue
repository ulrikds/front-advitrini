<template>
  <div class="w-full pb-8 relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-red-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl opacity-15"></div>
    </div>

    <!-- Header -->
    <div class="mb-4 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex-shrink-0 relative z-10">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <div class="flex items-center space-x-4">
          <div class="backdrop-blur-sm bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-400/40 p-3 rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-red-600 text-xl" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 via-red-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center space-x-3">
              <span>Admin Statistics</span>
            </h1>
            <p class="text-sm text-gray-700 font-medium flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-red-500 text-xs" />
              <span>System administrative statistics</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Period Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Period:</label>
            <select
              v-model="selectedPeriod"
              @change="loadStatistics"
              :disabled="isLoading"
              class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="all">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button
            @click="refreshStatistics"
            :disabled="isLoading"
            class="backdrop-blur-sm bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-400/40 text-red-700 px-4 py-2 rounded-xl hover:from-red-500/40 hover:to-red-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 font-semibold text-sm disabled:opacity-50"
          >
            <font-awesome-icon :icon="['fas', 'sync-alt']" :class="{ 'animate-spin': isLoading }" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Status da plataforma (só quando já carregou ou há erro) -->
    <div v-if="!isLoading || platformStatusLoaded" class="mb-4 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 relative z-10">
      <h2 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <font-awesome-icon :icon="['fas', 'power-off']" class="text-amber-500" />
        Status da plataforma
      </h2>
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Modo</label>
          <select
            v-model="platformStatus.app"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-amber-500"
          >
            <option value="enable">Habilitado (todos podem usar)</option>
            <option value="disable">Fora do ar (manutenção)</option>
            <option value="launch">Lançamento (contador, só admin entra)</option>
          </select>
        </div>
        <div v-if="platformStatus.app === 'launch'" class="flex items-center gap-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data do lançamento</label>
            <input
              v-model="platformStatus.launchDateInput"
              type="datetime-local"
              class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mensagem (opcional)</label>
          <input
            v-model="platformStatus.message"
            type="text"
            placeholder="Ex: Volte em breve!"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          @click="savePlatformStatus"
          :disabled="savingPlatformStatus"
          class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
        >
          {{ savingPlatformStatus ? 'Salvando...' : 'Salvar status' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        <strong>enable:</strong> qualquer usuário pode logar e usar o backend.
        <strong>disable:</strong> ninguém acessa; redireciona para &quot;Fora do ar&quot;.
        <strong>launch:</strong> página de contador; apenas admin acessa a plataforma.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-red-500 mx-auto mb-4"></div>
        <p class="text-gray-800 font-medium">Loading statistics...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl shadow-2xl p-6 mb-4">
      <div class="flex items-center space-x-3">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-600 text-xl" />
        <div>
          <h3 class="text-lg font-semibold text-red-800">Error loading statistics</h3>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Statistics Content -->
    <div v-else-if="statistics" class="px-8 relative z-10 space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Total Users -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-3 rounded-xl">
              <font-awesome-icon :icon="['fas', 'users']" class="text-blue-600 text-xl" />
            </div>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
          <p class="text-3xl font-bold text-gray-900">{{ statistics.totalUsers }}</p>
        </div>

        <!-- Total Mannequins -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 p-3 rounded-xl">
              <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-purple-600 text-xl" />
            </div>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Mannequins</h3>
          <p class="text-3xl font-bold text-gray-900">{{ statistics.totalMannequins }}</p>
        </div>

        <!-- Total Presentations -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="backdrop-blur-sm bg-green-500/20 border border-green-400/30 p-3 rounded-xl">
              <font-awesome-icon :icon="['fas', 'tshirt']" class="text-green-600 text-xl" />
            </div>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Presentations</h3>
          <p class="text-3xl font-bold text-gray-900">{{ statistics.totalPresentations }}</p>
        </div>

        <!-- Total Videos -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="backdrop-blur-sm bg-red-500/20 border border-red-400/30 p-3 rounded-xl">
              <font-awesome-icon :icon="['fas', 'video']" class="text-red-600 text-xl" />
            </div>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Videos</h3>
          <p class="text-3xl font-bold text-gray-900">{{ statistics.totalVideos + statistics.totalControlMotionVideos }}</p>
        </div>

        <!-- Total Credits Spent -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="backdrop-blur-sm bg-emerald-500/20 border border-emerald-400/30 p-3 rounded-xl">
              <font-awesome-icon :icon="['fas', 'coins']" class="text-emerald-600 text-xl" />
            </div>
          </div>
          <h3 class="text-sm font-medium text-gray-600 mb-1">Credits Spent</h3>
          <p class="text-3xl font-bold text-gray-900">{{ (statistics.totalCreditsSpent || 0).toLocaleString('en-US') }}</p>
        </div>
      </div>

      <!-- Users by Role -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <font-awesome-icon :icon="['fas', 'users-cog']" class="text-red-500" />
          <span>Users by Plan</span>
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p class="text-2xl font-bold text-blue-700">{{ statistics.usersByRole.free }}</p>
            <p class="text-sm text-gray-600 mt-1">Free</p>
          </div>
          <div class="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p class="text-2xl font-bold text-amber-700">{{ statistics.usersByRole.gold }}</p>
            <p class="text-sm text-gray-600 mt-1">Gold</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p class="text-2xl font-bold text-purple-700">{{ statistics.usersByRole.diamond }}</p>
            <p class="text-sm text-gray-600 mt-1">Diamond</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p class="text-2xl font-bold text-gray-700">{{ statistics.usersByRole.custom }}</p>
            <p class="text-sm text-gray-600 mt-1">Custom</p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-xl border border-red-200">
            <p class="text-2xl font-bold text-red-700">{{ statistics.usersByRole.admin }}</p>
            <p class="text-sm text-gray-600 mt-1">Admin</p>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <font-awesome-icon :icon="['fas', 'user-friends']" class="text-red-500" />
          <span>Users and Credits</span>
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Daily Credits</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-4 text-sm text-gray-900 font-medium">{{ user.name }}</td>
                <td class="py-3 px-4 text-sm text-gray-700">{{ user.email }}</td>
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': user.role === 'free',
                      'bg-amber-100 text-amber-800': user.role === 'gold',
                      'bg-purple-100 text-purple-800': user.role === 'diamond',
                      'bg-gray-100 text-gray-800': user.role === 'custom',
                      'bg-red-100 text-red-800': user.role === 'admin',
                    }"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right text-sm font-semibold text-gray-900">{{ user.credits.toLocaleString('pt-BR') }}</td>
                <td class="py-3 px-4 text-right text-sm text-gray-700">{{ user.dailyCredits.toLocaleString('pt-BR') }}</td>
                <td class="py-3 px-4 text-sm text-gray-600">{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Users Pagination -->
        <div v-if="usersTotalPages > 1" class="mt-4 flex items-center justify-center gap-2">
          <button
            @click="goToUsersPage(usersCurrentPage - 1)"
            :disabled="usersCurrentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <span class="px-4 py-2 text-sm text-gray-700">
            Page {{ usersCurrentPage }} of {{ usersTotalPages }} ({{ users.length }} total users)
          </span>
          <button
            @click="goToUsersPage(usersCurrentPage + 1)"
            :disabled="usersCurrentPage === usersTotalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>

      <!-- Creations Table -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <font-awesome-icon :icon="['fas', 'layer-group']" class="text-red-500" />
          <span>Creations ({{ statistics.totalCreations }})</span>
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">User Email</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">URL</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created At</th>
                <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="creation in paginatedCreations"
                :key="creation.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-purple-100 text-purple-800': creation.type === 'mannequin',
                      'bg-green-100 text-green-800': creation.type === 'presentation',
                      'bg-red-100 text-red-800': creation.type === 'video',
                      'bg-emerald-100 text-emerald-800': creation.type === 'control_motion',
                    }"
                  >
                    {{ getTypeLabel(creation.type) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-900 font-medium">{{ creation.title }}</td>
                <td class="py-3 px-4 text-sm text-gray-700">{{ creation.userName }}</td>
                <td class="py-3 px-4 text-sm text-gray-600">{{ creation.userEmail }}</td>
                <td class="py-3 px-4 text-right text-sm font-semibold text-emerald-700">{{ (creation.credits || 0).toLocaleString('en-US') }}</td>
                <td class="py-3 px-4 text-sm">
                  <a
                    v-if="creation.imageUrl || creation.videoUrl"
                    :href="creation.imageUrl || creation.videoUrl"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs"
                  >
                    {{ (creation.imageUrl || creation.videoUrl).substring(0, 50) }}...
                  </a>
                  <span v-else class="text-gray-400">N/A</span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">{{ formatDate(creation.createdAt) }}</td>
                <td class="py-3 px-4 text-center">
                  <button
                    v-if="creation.imageUrl || creation.videoUrl"
                    @click="openUrl(creation.imageUrl || creation.videoUrl)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open URL"
                  >
                    <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Creations Pagination -->
        <div v-if="creationsTotalPages > 1" class="mt-4 flex items-center justify-center gap-2">
          <button
            @click="goToCreationsPage(creationsCurrentPage - 1)"
            :disabled="creationsCurrentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <span class="px-4 py-2 text-sm text-gray-700">
            Page {{ creationsCurrentPage }} of {{ creationsTotalPages }} ({{ creations.length }} total creations)
          </span>
          <button
            @click="goToCreationsPage(creationsCurrentPage + 1)"
            :disabled="creationsCurrentPage === creationsTotalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// State
const statistics = ref(null)
const users = ref([])
const creations = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedPeriod = ref('all')

// Pagination
const usersCurrentPage = ref(1)
const usersPerPage = 10
const creationsCurrentPage = ref(1)
const creationsPerPage = 25

// Status da plataforma (PlataformaOnline)
const platformStatusLoaded = ref(false)
const savingPlatformStatus = ref(false)
const platformStatus = ref({
  app: 'enable',
  launchDate: null,
  launchDateInput: '',
  message: '',
})

// Verificar se o usuário é admin
const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

// Watch para verificar se o usuário é admin
watch(isAdmin, (admin) => {
  if (!admin && user.value) {
    // Se não for admin, redirecionar
    navigateTo('/app?menu=dashboard')
  }
})

// Verificar autenticação e role ao montar
onMounted(async () => {
  if (!user.value) {
    await navigateTo('/login')
    return
  }
  
  if (!isAdmin.value) {
    navigateTo('/app?menu=dashboard')
    return
  }
  
  await loadStatistics()
  await loadPlatformStatus()
})

const loadPlatformStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/platform-status`, { credentials: 'include' })
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        platformStatus.value.app = data.app || 'enable'
        platformStatus.value.launchDate = data.launchDate
        platformStatus.value.message = data.message || ''
        if (data.launchDate) {
          const d = new Date(data.launchDate)
          const pad = (n) => String(n).padStart(2, '0')
          platformStatus.value.launchDateInput = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        } else {
          platformStatus.value.launchDateInput = ''
        }
      }
    }
  } catch (e) {
    console.error('Erro ao carregar status da plataforma:', e)
  } finally {
    platformStatusLoaded.value = true
  }
}

const savePlatformStatus = async () => {
  savingPlatformStatus.value = true
  try {
    const body = {
      app: platformStatus.value.app,
      message: platformStatus.value.message || '',
    }
    if (platformStatus.value.app === 'launch' && platformStatus.value.launchDateInput) {
      body.launchDate = new Date(platformStatus.value.launchDateInput).toISOString()
    }
    const response = await fetch(`${API_URL}/admin/platform-status`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    if (data.success) {
      platformStatus.value.launchDate = data.launchDate || null
      if (process.client) window.alert('Status da plataforma atualizado.')
    } else {
      if (process.client) window.alert(data.message || 'Erro ao salvar.')
    }
  } catch (e) {
    console.error('Erro ao salvar status da plataforma:', e)
    if (process.client) window.alert('Erro ao salvar status.')
  } finally {
    savingPlatformStatus.value = false
  }
}

// Load statistics
const loadStatistics = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const periodParam = selectedPeriod.value !== 'all' ? `?period=${selectedPeriod.value}` : ''
    const response = await fetch(`${API_URL}/admin/statistics${periodParam}`, {
      credentials: 'include',
    })
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. Only administrators can access this page.')
      }
      throw new Error(`Error loading statistics: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      statistics.value = data.statistics
      // Sort users by creation date (newest first)
      users.value = (data.users || []).sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      // Sort creations by creation date (newest first)
      creations.value = (data.creations || []).sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
      // Reset pagination when loading new data
      usersCurrentPage.value = 1
      creationsCurrentPage.value = 1
    } else {
      throw new Error(data.message || 'Error loading statistics')
    }
  } catch (err) {
    console.error('Error loading statistics:', err)
    error.value = err.message || 'Error loading statistics'
  } finally {
    isLoading.value = false
  }
}

// Refresh statistics
const refreshStatistics = async () => {
  await loadStatistics()
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get type label
const getTypeLabel = (type) => {
  const labels = {
    mannequin: 'Mannequin',
    presentation: 'Presentation',
    video: 'Video',
    control_motion: 'Control Motion',
  }
  return labels[type] || type
}

// Get role label
const getRoleLabel = (role) => {
  const labels = {
    free: 'Free',
    gold: 'Gold',
    diamond: 'Diamond',
    custom: 'Custom',
    admin: 'Admin',
  }
  return labels[role] || role
}

// Open URL
const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

// Paginated users
const paginatedUsers = computed(() => {
  const start = (usersCurrentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return users.value.slice(start, end)
})

const usersTotalPages = computed(() => {
  return Math.ceil(users.value.length / usersPerPage)
})

// Paginated creations
const paginatedCreations = computed(() => {
  const start = (creationsCurrentPage.value - 1) * creationsPerPage
  const end = start + creationsPerPage
  return creations.value.slice(start, end)
})

const creationsTotalPages = computed(() => {
  return Math.ceil(creations.value.length / creationsPerPage)
})

// Pagination functions
const goToUsersPage = (page) => {
  if (page >= 1 && page <= usersTotalPages.value) {
    usersCurrentPage.value = page
  }
}

const goToCreationsPage = (page) => {
  if (page >= 1 && page <= creationsTotalPages.value) {
    creationsCurrentPage.value = page
  }
}
</script>
