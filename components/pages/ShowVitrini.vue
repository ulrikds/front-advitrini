<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-4 sm:mb-6 lg:mb-8">
      <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-red-700 to-slate-700 bg-clip-text text-transparent mb-2">
            Show Vitrini
          </h1>
          <p class="text-sm sm:text-base text-slate-600 font-medium">Aprovar criações para a Vitrini</p>
        </div>
        <button
          @click="loadCreations"
          :disabled="loading"
          class="px-3 sm:px-4 py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 text-blue-700 font-medium"
        >
          <font-awesome-icon
            :icon="['fas', 'sync-alt']"
            :class="['text-sm sm:text-base', loading ? 'animate-spin' : '']"
          />
          <span class="ml-2 hidden sm:inline">Atualizar</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-red-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="creations.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      <div class="p-4 sm:p-6 rounded-full backdrop-blur-sm bg-slate-500/10 border border-slate-400/20 mb-3 sm:mb-4">
        <font-awesome-icon :icon="['fas', 'images']" class="text-3xl sm:text-4xl text-slate-400" />
      </div>
      <p class="text-base sm:text-lg font-semibold text-slate-700 mb-2">Nenhuma criação encontrada</p>
      <p class="text-xs sm:text-sm text-slate-600">
        As criações aparecerão aqui para aprovação
      </p>
    </div>

    <!-- Creations Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="creation in creations"
        :key="creation.id"
        class="group relative rounded-xl overflow-hidden backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:shadow-lg"
        :class="creation.approvedForVitrini ? 'ring-2 ring-green-400/50' : ''"
      >
        <!-- Image/Video Thumbnail -->
        <div class="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50">
          <!-- Video -->
          <div v-if="creation.type === 'video' && creation.videoUrl" class="w-full h-full relative">
            <video
              :src="creation.videoUrl"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              muted
              preload="metadata"
              @loadedmetadata="handleVideoLoaded"
            ></video>
            <!-- Play icon overlay -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="backdrop-blur-sm bg-black/40 rounded-full p-3 sm:p-4 border border-white/40 transition-all duration-300 group-hover:bg-black/60 group-hover:scale-110">
                <font-awesome-icon :icon="['fas', 'play-circle']" class="text-3xl sm:text-4xl text-white" />
              </div>
            </div>
          </div>
          <!-- Image -->
          <img
            v-else-if="creation.imageUrl"
            :src="creation.imageUrl"
            :alt="creation.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            @error="handleImageError($event)"
          />
          <!-- Fallback -->
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="backdrop-blur-sm bg-white/30 rounded-full p-6 border border-white/40">
              <font-awesome-icon 
                :icon="creation.type === 'video' ? ['fas', 'video'] : creation.type === 'mannequin' ? ['fas', 'user'] : ['fas', 'image']" 
                class="text-4xl text-slate-400" 
              />
            </div>
          </div>
          <!-- Type badge -->
          <div class="absolute top-2 right-2">
            <span
              :class="[
                'px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border',
                creation.type === 'video' 
                  ? 'bg-purple-500/20 text-purple-700 border-purple-400/30'
                  : creation.type === 'mannequin'
                  ? 'bg-blue-500/20 text-blue-700 border-blue-400/30'
                  : creation.type === 'control-motion'
                  ? 'bg-emerald-500/20 text-emerald-700 border-emerald-400/30'
                  : 'bg-slate-500/20 text-slate-700 border-slate-400/30'
              ]"
            >
              {{ creation.type === 'video' ? 'Product Clip' : creation.type === 'mannequin' ? 'Mannequin' : creation.type === 'control-motion' ? 'Control Motion' : 'Product Thumb' }}
            </span>
          </div>
          <!-- Approved badge -->
          <div v-if="creation.approvedForVitrini" class="absolute top-2 left-2">
            <span class="px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm bg-green-500/20 text-green-700 border border-green-400/30">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-1" />
              Approved
            </span>
          </div>
        </div>
        <!-- Creation info -->
        <div class="p-3 sm:p-4">
          <p class="font-semibold text-slate-800 text-sm sm:text-base truncate mb-1" :title="creation.title">
            {{ creation.title }}
          </p>
          <p class="text-xs sm:text-sm text-slate-600 truncate mb-3" :title="creation.creatorName">
            By: {{ creation.creatorName }}
          </p>
          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="!creation.approvedForVitrini"
              @click="openApproveModal(creation)"
              :disabled="approving"
              class="flex-1 px-3 py-2 backdrop-blur-sm bg-green-500/20 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-green-700 font-medium text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'check']" class="mr-1" />
              Approve
            </button>
            <button
              v-else
              @click="rejectCreation(creation)"
              :disabled="approving"
              class="flex-1 px-3 py-2 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 text-red-700 font-medium text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="mr-1" />
              Reject
            </button>
            <button
              @click="viewCreation(creation)"
              class="px-3 py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-blue-700"
              title="View"
            >
              <font-awesome-icon :icon="['fas', 'eye']" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 sm:mt-8 flex items-center justify-center gap-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 sm:px-4 py-2 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <span class="px-4 py-2 text-sm sm:text-base text-slate-700">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 sm:px-4 py-2 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>

    <!-- View Modal -->
    <div
      v-if="viewingCreation"
      @click.self="viewingCreation = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="p-4 sm:p-6 border-b border-white/20 flex items-center justify-between">
          <h3 class="text-base sm:text-xl font-bold text-slate-800 truncate pr-2">{{ viewingCreation.title }}</h3>
          <button
            @click="viewingCreation = null"
            class="p-2 hover:bg-white/40 rounded-lg transition-all duration-300 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-slate-600" />
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <div v-if="viewingCreation.type === 'video' && viewingCreation.videoUrl" class="w-full">
            <video
              :src="viewingCreation.videoUrl"
              controls
              class="w-full rounded-xl shadow-lg"
            ></video>
          </div>
          <div v-else-if="viewingCreation.imageUrl" class="w-full">
            <img
              :src="viewingCreation.imageUrl"
              :alt="viewingCreation.title"
              class="w-full rounded-xl shadow-lg"
            />
          </div>
          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <p><strong>Creator:</strong> {{ viewingCreation.creatorName }}</p>
            <p><strong>Type:</strong> {{ viewingCreation.type === 'video' ? 'Product Clip' : viewingCreation.type === 'mannequin' ? 'Mannequin' : viewingCreation.type === 'control-motion' ? 'Control Motion' : 'Product Thumb' }}</p>
            <p><strong>Status:</strong> {{ viewingCreation.approvedForVitrini ? 'Approved' : 'Pending' }}</p>
            <p v-if="viewingCreation.createdAt"><strong>Created at:</strong> {{ formatDate(viewingCreation.createdAt) }}</p>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              v-if="!viewingCreation.approvedForVitrini"
              @click="openApproveModal(viewingCreation)"
              :disabled="approving"
              class="px-4 py-2 backdrop-blur-sm bg-green-500/20 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-green-700 font-medium"
            >
              <font-awesome-icon :icon="['fas', 'check']" class="mr-2" />
              Approve
            </button>
            <button
              v-else
              @click="rejectCreation(viewingCreation); viewingCreation = null"
              :disabled="approving"
              class="px-4 py-2 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 text-red-700 font-medium"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation modal: Approve creation -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      @click.self="closeApproveModal"
    >
      <div class="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-2xl text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800">Approve creation</h3>
              <p class="text-sm text-slate-600">This action will approve the item for Vitrini.</p>
            </div>
          </div>
          <div v-if="creationToApprove" class="rounded-lg bg-slate-50 border border-slate-200 p-4 mb-6">
            <p class="font-semibold text-slate-800 truncate" :title="creationToApprove.title">{{ creationToApprove.title }}</p>
            <p class="text-xs text-slate-600 mt-1">
              {{ creationToApprove.type === 'video' ? 'Product Clip' : creationToApprove.type === 'mannequin' ? 'Mannequin' : creationToApprove.type === 'control-motion' ? 'Control Motion' : 'Product Thumb' }}
              <span v-if="creationToApprove.creatorName"> · {{ creationToApprove.creatorName }}</span>
            </p>
          </div>
          <div class="flex gap-3 justify-end">
            <button
              type="button"
              @click="closeApproveModal"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmApprove"
              :disabled="approving"
              class="px-4 py-2 rounded-lg bg-green-600 border border-green-700 text-white font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="approving">Approving...</span>
              <span v-else>Approve</span>
            </button>
          </div>
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

// Estado
const loading = ref(false)
const approving = ref(false)
const creations = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const viewingCreation = ref(null)
const showApproveModal = ref(false)
const creationToApprove = ref(null)

// Verificar se o usuário é admin
const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

// Watch para verificar se o usuário é admin
watch(isAdmin, (admin) => {
  if (!admin && user.value) {
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
  
  await loadCreations()
})

// Carregar criações
const loadCreations = async (page = 1) => {
  loading.value = true
  try {
    const query = `query AllCreationsForApproval($page: Int, $limit: Int) {
      allCreationsForApproval(page: $page, limit: $limit) {
        creations {
          id
          type
          title
          creatorName
          creatorId
          imageUrl
          videoUrl
          approvedForVitrini
          createdAt
        }
        total
        page
        limit
        totalPages
      }
    }`
    
    const variables = {
      page,
      limit: 20
    }

    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query, variables }),
    })

    if (response.errors) {
      console.error('GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    const data = response.data?.allCreationsForApproval
    if (data) {
      creations.value = data.creations || []
      currentPage.value = data.page || 1
      totalPages.value = data.totalPages || 1
    }
  } catch (error) {
    console.error('Error loading creations:', error)
    alert('Erro ao carregar criações. Por favor, tente novamente.')
  } finally {
    loading.value = false
  }
}

// Abrir modal de confirmação de aprovação
const openApproveModal = (creation) => {
  creationToApprove.value = creation
  showApproveModal.value = true
}

const closeApproveModal = () => {
  showApproveModal.value = false
  creationToApprove.value = null
}

// Confirmar aprovação (chamado pelo botão do modal)
const confirmApprove = async () => {
  if (!creationToApprove.value) return
  const creation = creationToApprove.value
  closeApproveModal()
  viewingCreation.value = null
  await approveCreation(creation)
}

// Aprovar criação (chamada após confirmação no modal)
const approveCreation = async (creation) => {
  approving.value = true
  try {
    const mutation = `mutation ApproveCreation($creationType: String!, $creationId: ID!) {
      approveCreationForVitrini(creationType: $creationType, creationId: $creationId)
    }`
    
    const variables = {
      creationType: creation.type,
      creationId: creation.id
    }

    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query: mutation, variables }),
    })

    if (response.errors) {
      console.error('GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    if (response.data?.approveCreationForVitrini) {
      await loadCreations(currentPage.value)
      alert('Creation approved successfully!')
    }
  } catch (error) {
    console.error('Error approving creation:', error)
    alert('Error approving creation. Please try again.')
  } finally {
    approving.value = false
  }
}

// Reprovar criação
const rejectCreation = async (creation) => {
  if (!confirm(`Deseja reprovar "${creation.title}" da Vitrini?`)) {
    return
  }

  approving.value = true
  try {
    const mutation = `mutation RejectCreation($creationType: String!, $creationId: ID!) {
      rejectCreationForVitrini(creationType: $creationType, creationId: $creationId)
    }`
    
    const variables = {
      creationType: creation.type,
      creationId: creation.id
    }

    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ query: mutation, variables }),
    })

    if (response.errors) {
      console.error('GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    if (response.data?.rejectCreationForVitrini) {
      await loadCreations(currentPage.value)
      alert('Creation rejected successfully!')
    }
  } catch (error) {
    console.error('Error rejecting creation:', error)
    alert('Error rejecting creation. Please try again.')
  } finally {
    approving.value = false
  }
}

// Navegar para página
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadCreations(page)
  }
}

// Visualizar criação
const viewCreation = (creation) => {
  viewingCreation.value = creation
}

// Helpers
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleVideoLoaded = (event) => {
  if (event.target) {
    event.target.currentTime = 0.1
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
