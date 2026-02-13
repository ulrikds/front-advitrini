<template>
  <div class="h-[calc(100vh-3rem)] overflow-hidden flex flex-col relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-pink-300 rounded-full blur-3xl opacity-15"></div>
    </div>

    <!-- Header -->
    <div class="mb-3 sm:mb-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div class="backdrop-blur-sm bg-gradient-to-br from-purple-500/30 to-pink-600/30 border border-purple-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'user-friends']" class="text-purple-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Face Swap</span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-purple-500 text-xs flex-shrink-0" />
              <span class="truncate">Swap a mannequin's face and hair with a model's face and hair</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        <!-- Left Panel: Inputs -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Select Mannequin -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'user']" class="text-purple-600 mr-2" />
              Select Mannequin
            </h2>
            <div v-if="mannequins.length === 0" class="backdrop-blur-sm bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
              <p class="text-amber-700 text-sm font-medium">
                <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
                No mannequins available. Please create a mannequin first.
              </p>
            </div>
            <div v-else>
              <button
                @click="showMannequinSelector = true"
                type="button"
                class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-400/60 hover:bg-white/40 transition-all text-left flex items-center justify-between"
              >
                <span class="text-gray-800 font-medium">
                  <span v-if="selectedMannequin">
                    {{ selectedMannequin.name }}
                  </span>
                  <span v-else class="text-slate-500">Click to select a mannequin</span>
                </span>
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-slate-500" />
              </button>
              <div v-if="selectedMannequin" class="mt-3">
                <img
                  :src="selectedMannequin.fullBodyImageUrl || selectedMannequin.generatedImage"
                  alt="Selected mannequin"
                  class="w-full h-48 rounded-lg object-cover border-2 border-purple-500"
                />
              </div>
            </div>
          </div>

          <!-- Select Model Face -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'user-circle']" class="text-pink-600 mr-2" />
              Select Model Face & Hair
            </h2>
            <div class="space-y-4">
              <!-- Upload Face Image -->
              <div class="relative">
                <input
                  type="file"
                  ref="faceInput"
                  @change="handleFaceUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  @click="faceInput?.click()"
                  type="button"
                  class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-pink-400/60 hover:bg-white/40 transition-all text-center"
                >
                  <font-awesome-icon :icon="['fas', 'upload']" class="text-pink-500 text-xl mb-2" />
                  <p class="text-gray-800 font-medium">Upload face and hair image</p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </button>
              </div>
              <!-- Preview Face Image -->
              <div v-if="faceImagePreview" class="mt-3">
                <img
                  :src="faceImagePreview"
                  alt="Face preview"
                  class="w-full h-48 rounded-lg object-cover border-2 border-pink-500"
                />
                <button
                  @click="removeFaceImage"
                  class="mt-2 w-full px-3 py-2 bg-red-500/10 border border-red-400/30 text-red-700 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                  Remove image
                </button>
              </div>
            </div>
          </div>

          <!-- AI Model -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'robot']" class="text-purple-600 mr-2" />
              AI Model
            </h2>
            <div class="space-y-4">
              <div class="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  @click="aiProvider = 'gemini'"
                  class="flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all"
                  :class="aiProvider === 'gemini' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                >
                  Google Gemini
                </button>
                <button
                  type="button"
                  @click="aiProvider = 'kie'"
                  class="flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all"
                  :class="aiProvider === 'kie' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                >
                  Kie.ai (Flux)
                </button>
              </div>
              <template v-if="aiProvider === 'kie'">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Aspect ratio</label>
                    <select
                      v-model="kieAspectRatio"
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900"
                    >
                      <option value="4:3">4:3</option>
                      <option value="16:9">16:9</option>
                      <option value="1:1">1:1</option>
                      <option value="3:4">3:4</option>
                      <option value="9:16">9:16</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Resolution</label>
                    <select
                      v-model="kieResolution"
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900"
                    >
                      <option value="1K">1K</option>
                      <option value="2K">2K</option>
                    </select>
                  </div>
                </div>
                <div v-if="isCustomRole" class="pt-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Kie.ai API Key <span class="text-red-500">*</span></label>
                  <input
                    v-model="kieApiKey"
                    type="password"
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Enter your Kie.ai API key"
                  />
                </div>
              </template>
            </div>
          </div>

          <!-- Generate Button -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <button
              @click="performFaceSwap"
              :disabled="!canGenerate || isGenerating"
              class="w-full backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-pink-600/30 border border-purple-400/40 text-purple-700 px-4 py-3 rounded-xl hover:from-purple-500/40 hover:to-pink-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <font-awesome-icon 
                :icon="['fas', isGenerating ? 'spinner' : 'magic']" 
                :class="['text-lg', isGenerating ? 'animate-spin' : '']"
              />
              <span>{{ isGenerating ? 'Processing...' : 'Swap Face & Hair' }}</span>
            </button>
          </div>
        </div>

        <!-- Right Panel: Result -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'image']" class="text-purple-600 mr-2" />
              Result
            </h2>
            <div v-if="!resultImage" class="backdrop-blur-sm bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <font-awesome-icon :icon="['fas', 'image']" class="text-gray-400 text-4xl mb-3" />
              <p class="text-gray-500 font-medium">The result will appear here</p>
            </div>
            <div v-else class="space-y-4">
              <img
                :src="resultImage"
                alt="Face swap result"
                class="w-full rounded-lg object-cover border-2 border-purple-500"
              />
              <div class="flex flex-wrap gap-2">
                <button
                  @click="openResultModal"
                  class="flex-1 min-w-[140px] backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-pink-600/30 border border-purple-400/40 text-purple-700 px-4 py-3 rounded-xl hover:from-purple-500/40 hover:to-pink-600/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                >
                  <font-awesome-icon :icon="['fas', 'expand']" />
                  <span>Open</span>
                </button>
                <button
                  @click="downloadResult"
                  class="flex-1 min-w-[140px] backdrop-blur-sm bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 text-emerald-700 px-4 py-3 rounded-xl hover:from-emerald-500/40 hover:to-emerald-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 font-semibold"
                >
                  <font-awesome-icon :icon="['fas', 'download']" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result modal (opens after generation; image is already in storage) -->
    <div
      v-if="showResultModal && resultImage"
      class="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4"
      @click.self="showResultModal = false"
    >
      <div class="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 class="text-lg font-bold text-gray-900">Face Swap Result</h2>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Saved to storage</span>
            <button
              @click="downloadResult"
              class="px-3 py-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 rounded-lg hover:bg-emerald-500/30 text-sm font-medium flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'download']" />
              Download
            </button>
            <button
              @click="goToVitriniDrive"
              class="px-3 py-2 bg-blue-500/20 border border-blue-400/40 text-blue-700 rounded-lg hover:bg-blue-500/30 text-sm font-medium flex items-center gap-2"
            >
              <font-awesome-icon :icon="['fas', 'folder-open']" />
              Open in Drive
            </button>
            <button
              @click="showResultModal = false"
              class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[300px] bg-gray-100">
          <img
            :src="resultImage"
            alt="Face swap result"
            class="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>

    <!-- Mannequin Selector Modal -->
    <div
      v-if="showMannequinSelector"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="showMannequinSelector = false"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Select Mannequin</h2>
          <button
            @click="showMannequinSelector = false"
            class="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <div v-if="loadingMannequins" class="flex items-center justify-center py-12">
            <font-awesome-icon :icon="['fas', 'spinner']" class="text-purple-500 text-3xl animate-spin" />
            <span class="ml-3 text-gray-600">Loading mannequins...</span>
          </div>
          <div v-else-if="mannequins.length === 0" class="text-center py-12">
            <p class="text-gray-500">No mannequins available</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="mannequin in mannequins"
              :key="mannequin.id"
              @click="selectMannequin(mannequin)"
              class="cursor-pointer bg-white border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg"
              :class="selectedMannequin?.id === mannequin.id ? 'border-purple-500' : 'border-gray-200 hover:border-purple-300'"
            >
              <img
                :src="mannequin.fullBodyImageUrl || mannequin.generatedImage"
                :alt="mannequin.name"
                class="w-full h-48 object-cover"
              />
              <div class="p-3">
                <h3 class="font-semibold text-gray-900 truncate">{{ mannequin.name }}</h3>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(mannequin.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed top-4 right-4 z-[100] max-w-md w-full sm:w-auto"
      >
        <div
          class="backdrop-blur-xl bg-white/90 border-2 rounded-xl shadow-2xl p-4"
          :class="{
            'border-green-400/60': toastType === 'success',
            'border-red-400/60 bg-red-50/90': toastType === 'error',
            'border-blue-400/60': toastType === 'loading',
          }"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <font-awesome-icon
                v-if="toastType === 'success'"
                :icon="['fas', 'check-circle']"
                class="text-green-600 text-xl"
              />
              <font-awesome-icon
                v-else-if="toastType === 'error'"
                :icon="['fas', 'exclamation-triangle']"
                class="text-red-600 text-xl"
              />
              <font-awesome-icon
                v-else
                :icon="['fas', 'spinner']"
                class="text-blue-600 text-xl animate-spin"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 
                class="font-bold mb-1"
                :class="toastType === 'error' ? 'text-red-800' : 'text-gray-900'"
              >
                {{ toastTitle }}
              </h3>
              <p 
                class="text-sm"
                :class="toastType === 'error' ? 'text-red-700' : 'text-gray-700'"
              >
                {{ toastMessage }}
              </p>
              <div v-if="toastProgress !== null" class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${toastProgress}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <button
              @click="showToast = false"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const API_URL = useRuntimeConfig().public.apiUrl || 'http://localhost:3000'
const { user } = useAuth()

// State
const mannequins = ref([])
const selectedMannequin = ref(null)
const showMannequinSelector = ref(false)
const loadingMannequins = ref(false)
const faceImageFile = ref(null)
const faceImagePreview = ref(null)
const resultImage = ref(null)
const isGenerating = ref(false)
const showResultModal = ref(false)

// AI model
const aiProvider = ref('gemini') // 'gemini' | 'kie'
const kieAspectRatio = ref('4:3')
const kieResolution = ref('1K')
const kieApiKey = ref('')
const isCustomRole = computed(() => (user.value?.role || '').toLowerCase() === 'custom')

// Toast
const showToast = ref(false)
const toastType = ref('info')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Computed
const canGenerate = computed(() => {
  if (!selectedMannequin.value || !faceImagePreview.value || isGenerating.value) return false
  if (aiProvider.value === 'kie' && isCustomRole.value && !kieApiKey.value?.trim()) return false
  return true
})

// Load mannequins
const loadMannequins = async () => {
  loadingMannequins.value = true
  try {
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          query {
            mannequins {
              id
              name
              generatedImage
              fullBodyImageUrl
              createdAt
            }
          }
        `,
      }),
    })

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Failed to load mannequins')
    }

    mannequins.value = response.data?.mannequins || []
  } catch (error) {
    console.error('Error loading mannequins:', error)
    showToastMessage('error', 'Error', 'Failed to load mannequins: ' + error.message)
  } finally {
    loadingMannequins.value = false
  }
}

// Select mannequin
const selectMannequin = (mannequin) => {
  selectedMannequin.value = mannequin
  showMannequinSelector.value = false
}

// Handle face upload
const handleFaceUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToastMessage('error', 'Error', 'Please select an image file')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showToastMessage('error', 'Error', 'The image must be at most 10MB')
    return
  }

  faceImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    faceImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Remove face image
const faceInput = ref(null)
const removeFaceImage = () => {
  faceImageFile.value = null
  faceImagePreview.value = null
  if (faceInput.value) {
    faceInput.value.value = ''
  }
}

// Show toast message
const showToastMessage = (type, title, message, progress = null) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  toastProgress.value = progress
  showToast.value = true
}

// Perform face swap
const performFaceSwap = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
    const providerLabel = aiProvider.value === 'kie' ? 'Kie.ai' : 'Gemini'
    showToastMessage('loading', 'Processing Face & Hair Swap', `Using ${providerLabel}. Please wait...`, 10)

  try {
    // Convert images to base64
    toastProgress.value = 20

    // Get mannequin image
    let mannequinImageBase64
    const mannequinImageUrl = selectedMannequin.value.fullBodyImageUrl || selectedMannequin.value.generatedImage
    
    if (mannequinImageUrl.startsWith('http://') || mannequinImageUrl.startsWith('https://')) {
      try {
        const response = await fetch(`${API_URL}/api/download-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ url: mannequinImageUrl }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to download mannequin image')
        }
        
        const data = await response.json()
        mannequinImageBase64 = data.base64
      } catch (error) {
        console.error('Error downloading mannequin image:', error)
        throw new Error(`Failed to download mannequin image: ${error.message}`)
      }
    } else if (mannequinImageUrl.includes('data:')) {
      mannequinImageBase64 = mannequinImageUrl.split(',')[1]
    } else {
      mannequinImageBase64 = mannequinImageUrl
    }

    // Get face image base64
    toastProgress.value = 40
    let faceImageBase64
    if (faceImageFile.value) {
      faceImageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(faceImageFile.value)
      })
    } else {
      throw new Error('No face image available')
    }

    // Call backend API for face swap
    toastProgress.value = 60
    const provider = aiProvider.value
    const variables = {
      mannequinImage: mannequinImageBase64,
      faceImage: faceImageBase64,
      provider,
    }
    if (provider === 'kie') {
      variables.aspectRatio = kieAspectRatio.value
      variables.resolution = kieResolution.value
      if (isCustomRole.value && kieApiKey.value?.trim()) {
        variables.kieApiKey = kieApiKey.value.trim()
      }
    }
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation FaceSwap($mannequinImage: String!, $faceImage: String!, $provider: String, $kieApiKey: String, $aspectRatio: String, $resolution: String) {
            faceSwap(mannequinImage: $mannequinImage, faceImage: $faceImage, provider: $provider, kieApiKey: $kieApiKey, aspectRatio: $aspectRatio, resolution: $resolution) {
              success
              resultImage
              error
            }
          }
        `,
        variables,
      }),
    })

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Face swap failed')
    }

    const result = response.data?.faceSwap
    if (!result?.success) {
      throw new Error(result?.error || 'Face swap failed')
    }

    toastProgress.value = 90
    resultImage.value = result.resultImage

    toastProgress.value = 100
    showToastMessage('success', 'Success!', 'Image saved to storage and ready to view.')
    setTimeout(() => { showToast.value = false }, 5000)

    // Open result modal for the user (image is already in storage from backend)
    showResultModal.value = true
  } catch (error) {
    console.error('Error performing face swap:', error)
    
    // Check if error is related to safety/content filtering
    const errorMessage = error.message || 'Failed to perform face swap. Please try again.'
    let toastTitle = 'Error'
    let toastMsg = errorMessage
    
    // Detect safety/content filtering errors
    if (errorMessage.includes('bloqueada pelos filtros de segurança') || 
        errorMessage.includes('safety filters') ||
        errorMessage.includes('IMAGE_SAFETY') ||
        errorMessage.includes('conteúdo considerado inadequado') ||
        errorMessage.includes('possível conteúdo sexual') ||
        errorMessage.includes('blocked by safety filters') ||
        errorMessage.includes('inappropriate content') ||
        errorMessage.includes('possible sexual content')) {
      toastTitle = 'Content Blocked'
      toastMsg = 'The image was blocked by safety filters. This may occur if the images contain inappropriate content, including possible sexual, violent, or offensive content. Please try with other images.'
    }
    
    showToastMessage('error', toastTitle, toastMsg)
    setTimeout(() => {
      showToast.value = false
    }, 8000) // Show longer for important messages
  } finally {
    isGenerating.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-US')
  } catch {
    return dateString
  }
}

// Open result in modal
const openResultModal = () => {
  if (resultImage.value) showResultModal.value = true
}

// Go to Vitrini Drive
const goToVitriniDrive = () => {
  showResultModal.value = false
  navigateTo({ path: '/app', query: { menu: 'vitrini-drive' } })
}

// Download result
const downloadResult = () => {
  if (!resultImage.value) return

  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = `face-swap-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Load mannequins on mount
onMounted(() => {
  loadMannequins()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
