<template>
  <div class="w-full pb-8 relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-pink-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-rose-300 rounded-full blur-3xl opacity-15"></div>
    </div>

    <!-- Header -->
    <div class="mb-3 sm:mb-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div class="backdrop-blur-sm bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'palette']" class="text-pink-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-pink-700 to-rose-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Makeup</span>
              <span class="text-xs font-normal text-pink-700 bg-pink-400/20 backdrop-blur-sm border border-pink-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                Beauty Editor
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-pink-500 text-xs flex-shrink-0" />
              <span class="truncate">Adjust skin tone, enlarge eyes, mouth, nose, shorten hair and more</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            v-if="!hasSourceImage"
            @click="sourcePanelRef?.scrollIntoView?.({ behavior: 'smooth' })"
            class="w-full sm:w-auto backdrop-blur-sm bg-gradient-to-r from-pink-500/30 to-rose-600/30 border border-pink-400/40 text-pink-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-pink-500/40 hover:to-rose-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'image']" />
            <span class="hidden sm:inline">Select Image</span>
            <span class="sm:hidden">Select</span>
          </button>
          <button
            v-if="hasSourceImage"
            @click="resetImage"
            class="w-full sm:w-auto backdrop-blur-sm bg-gradient-to-r from-gray-500/30 to-gray-600/30 border border-gray-400/40 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-gray-500/40 hover:to-gray-600/40 transition-all duration-300 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'sync-alt']" />
            <span class="hidden sm:inline">New Image</span>
            <span class="sm:hidden">Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-3 sm:px-6 lg:px-8 relative z-10">
      <!-- Source selection panel (when no image yet) -->
      <div ref="sourcePanelRef" v-if="!hasSourceImage" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <font-awesome-icon :icon="['fas', 'image']" class="text-pink-500" />
          <span>Select Image Source</span>
        </h2>
        <p class="text-sm text-gray-700 mb-4">Choose a mannequin, product thumb, or Face Swap from your project, or upload an image.</p>

        <!-- Source Type -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Image source</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              @click="imageSourceType = 'mannequin'"
              :class="['px-3 py-2.5 rounded-xl border-2 transition-all font-medium text-sm', imageSourceType === 'mannequin' ? 'border-pink-400 bg-pink-500/20 text-pink-700' : 'border-gray-200 hover:border-pink-300 text-gray-700']"
            >
              <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
              Mannequin
            </button>
            <button
              @click="imageSourceType = 'presentation'"
              :class="['px-3 py-2.5 rounded-xl border-2 transition-all font-medium text-sm', imageSourceType === 'presentation' ? 'border-pink-400 bg-pink-500/20 text-pink-700' : 'border-gray-200 hover:border-pink-300 text-gray-700']"
            >
              <font-awesome-icon :icon="['fas', 'tshirt']" class="mr-2" />
              Product Thumb
            </button>
            <button
              @click="imageSourceType = 'face-swap'"
              :class="['px-3 py-2.5 rounded-xl border-2 transition-all font-medium text-sm', imageSourceType === 'face-swap' ? 'border-pink-400 bg-pink-500/20 text-pink-700' : 'border-gray-200 hover:border-pink-300 text-gray-700']"
            >
              <font-awesome-icon :icon="['fas', 'user-friends']" class="mr-2" />
              Face Swap
            </button>
            <button
              v-if="isCustomRole"
              @click="openImageUpload"
              :class="['px-3 py-2.5 rounded-xl border-2 border-dashed transition-all font-medium text-sm', customImageFile ? 'border-pink-400 bg-pink-500/20 text-pink-700' : 'border-gray-300 hover:border-pink-300 text-gray-700']"
            >
              <font-awesome-icon :icon="['fas', 'upload']" class="mr-2" />
              Upload image
            </button>
          </div>
        </div>

        <!-- Custom upload area (custom role) -->
        <div v-if="isCustomRole" class="mb-4">
          <label class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" :class="{ 'border-pink-500 bg-pink-50': customImageFile }">
            <div v-if="!customImageFile" class="flex flex-col items-center justify-center p-4">
              <font-awesome-icon :icon="['fas', 'upload']" class="text-gray-400 text-2xl mb-2" />
              <span class="text-sm text-gray-500">Click to upload or select below</span>
              <span class="text-xs text-gray-400 mt-1">JPG, PNG (max 10MB)</span>
            </div>
            <div v-else class="relative w-full h-full p-2">
              <img :src="customImagePreview" class="w-full h-full object-contain rounded-lg" alt="Upload" />
              <button type="button" @click.stop="removeCustomImage" class="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
              </button>
            </div>
            <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/jpg,image/png" @change="handleImageUpload" />
          </label>
          <p class="text-xs text-gray-500 mt-2 text-center">Or select from your project below</p>
        </div>

        <!-- Mannequins grid -->
        <div v-if="imageSourceType === 'mannequin' && (!isCustomRole || !customImageFile)" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Mannequins</label>
          <div v-if="availableMannequins.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            <div
              v-for="m in availableMannequins"
              :key="m.id"
              @click="selectMannequin(m)"
              class="relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all"
              :class="selectedMannequin?.id === m.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'"
            >
              <img v-if="m.fullBodyImage" :src="m.fullBodyImage" class="w-full h-24 sm:h-28 object-cover" alt="" />
              <div v-else class="w-full h-24 sm:h-28 flex items-center justify-center bg-gray-100 text-3xl opacity-50">👤</div>
              <div class="p-2 bg-white">
                <p class="text-xs font-medium text-gray-900 truncate">{{ m.name || 'Untitled' }}</p>
              </div>
              <div v-if="selectedMannequin?.id === m.id" class="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1">
                <font-awesome-icon :icon="['fas', 'check']" class="text-xs" />
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 py-4 text-center">No mannequins yet. Create one in Creation → Mannequin.</p>
        </div>

        <!-- Product thumbs grid -->
        <div v-if="imageSourceType === 'presentation' && (!isCustomRole || !customImageFile)" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Product thumbs</label>
          <div v-if="availablePresentations.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            <div
              v-for="p in availablePresentations"
              :key="p.id"
              @click="selectPresentation(p)"
              class="rounded-xl border-2 overflow-hidden cursor-pointer transition-all relative"
              :class="selectedPresentation?.id === p.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'"
            >
              <img v-if="p.generatedImage" :src="p.generatedImage" class="w-full h-24 sm:h-28 object-cover" alt="" />
              <div v-else class="w-full h-24 sm:h-28 flex items-center justify-center bg-gray-100 text-3xl opacity-50">🖼️</div>
              <div class="p-2 bg-white">
                <p class="text-xs font-medium text-gray-900 truncate">{{ p.productName || 'Untitled' }}</p>
              </div>
              <div v-if="selectedPresentation?.id === p.id" class="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1">
                <font-awesome-icon :icon="['fas', 'check']" class="text-xs" />
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 py-4 text-center">No product thumbs yet. Create one in Creation → Thumbnail.</p>
        </div>

        <!-- Face Swap grid -->
        <div v-if="imageSourceType === 'face-swap' && (!isCustomRole || !customImageFile)" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Face Swap results</label>
          <div v-if="availableFaceSwaps.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            <div
              v-for="f in availableFaceSwaps"
              :key="f.id"
              @click="selectFaceSwap(f)"
              class="rounded-xl border-2 overflow-hidden cursor-pointer transition-all relative"
              :class="selectedFaceSwap?.id === f.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'"
            >
              <img v-if="f.resultImageUrl" :src="f.resultImageUrl" class="w-full h-24 sm:h-28 object-cover" alt="" />
              <div v-else class="w-full h-24 sm:h-28 flex items-center justify-center bg-gray-100 text-3xl opacity-50">👤</div>
              <div class="p-2 bg-white">
                <p class="text-xs font-medium text-gray-900 truncate">Face Swap {{ formatFaceSwapDate(f.createdAt) }}</p>
              </div>
              <div v-if="selectedFaceSwap?.id === f.id" class="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1">
                <font-awesome-icon :icon="['fas', 'check']" class="text-xs" />
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 py-4 text-center">No Face Swap results yet. Create one in Creation → Face Swap.</p>
        </div>

        <!-- Empty state when nothing selected and no custom -->
        <div v-if="!hasSourceImage && !isCustomRole && availableMannequins.length === 0 && availablePresentations.length === 0 && availableFaceSwaps.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">Create a mannequin, product thumb, or Face Swap in Creation first, or upload an image (custom accounts).</p>
        </div>
        <div v-else-if="!hasSourceImage" class="text-center py-4 text-gray-500">
          <p class="text-sm">Select a source above to start.</p>
        </div>
      </div>

      <!-- Editor Interface (when image is selected) -->
      <div v-if="hasSourceImage" class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Image Preview -->
        <div class="lg:col-span-2 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <div class="sticky top-4">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'image']" class="text-pink-500" />
              <span>Preview</span>
            </h2>
            <div class="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                :src="processedImage || sourceImage"
                alt="Processed"
                class="w-full h-auto max-h-[70vh] object-contain"
                :style="!processedImage ? { filter: getImageFilter(), transform: getImageTransform() } : {}"
              />
              <div v-if="isProcessing" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-pink-600 mx-auto mb-3"></div>
                  <p class="text-white font-medium">Processing...</p>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <button
                @click="generateWithAI"
                :disabled="isProcessing"
                class="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all font-medium text-sm disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'magic']" />
                Generate with AI
              </button>
              <button
                @click="downloadImage"
                :disabled="isProcessing"
                class="flex-1 sm:flex-none px-4 py-2 bg-pink-500/30 border border-pink-400/40 text-pink-700 rounded-lg hover:bg-pink-500/40 transition-all font-medium text-sm disabled:opacity-50"
              >
                <font-awesome-icon :icon="['fas', 'download']" class="mr-2" />
                Download
              </button>
              <button
                @click="resetAdjustments"
                :disabled="isProcessing"
                class="flex-1 sm:flex-none px-4 py-2 bg-gray-500/30 border border-gray-400/40 text-gray-700 rounded-lg hover:bg-gray-500/40 transition-all font-medium text-sm disabled:opacity-50"
              >
                <font-awesome-icon :icon="['fas', 'sync-alt']" class="mr-2" />
                Reset adjustments
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">Preview above is instant. Use &quot;Generate with AI&quot; to create a new image with these corrections applied.</p>
          </div>
        </div>

        <!-- Controls Panel -->
        <div class="lg:col-span-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <font-awesome-icon :icon="['fas', 'edit']" class="text-pink-500" />
            <span>Controls</span>
          </h2>

          <div class="space-y-6">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'magic']" class="text-pink-500" />
                <span>Skin tone</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Intensity: {{ makeupSettings.skinTone }}%</label>
                  <input v-model.number="makeupSettings.skinTone" type="range" min="0" max="100" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
                <p class="text-xs text-gray-600">Match skin tone to face</p>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'eye']" class="text-pink-500" />
                <span>Eyes</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Size: {{ makeupSettings.eyesSize }}%</label>
                  <input v-model.number="makeupSettings.eyesSize" type="range" min="80" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Brightness: {{ makeupSettings.eyesBrightness }}%</label>
                  <input v-model.number="makeupSettings.eyesBrightness" type="range" min="0" max="100" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'heart']" class="text-pink-500" />
                <span>Mouth</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Size: {{ makeupSettings.mouthSize }}%</label>
                  <input v-model.number="makeupSettings.mouthSize" type="range" min="80" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Lip color: {{ makeupSettings.lipColor }}%</label>
                  <input v-model.number="makeupSettings.lipColor" type="range" min="0" max="100" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'user']" class="text-pink-500" />
                <span>Nose</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Size: {{ makeupSettings.noseSize }}%</label>
                  <input v-model.number="makeupSettings.noseSize" type="range" min="80" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'user']" class="text-pink-500" />
                <span>Hair</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Length: {{ makeupSettings.hairLength }}%</label>
                  <input v-model.number="makeupSettings.hairLength" type="range" min="50" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                  <p class="text-xs text-gray-600 mt-1">Lower values shorten hair</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Shine: {{ makeupSettings.hairShine }}%</label>
                  <input v-model.number="makeupSettings.hairShine" type="range" min="0" max="100" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'user-circle']" class="text-pink-500" />
                <span>Face shape</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Adjust: {{ makeupSettings.faceShape }}%</label>
                  <input v-model.number="makeupSettings.faceShape" type="range" min="80" max="120" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'magic']" class="text-pink-500" />
                <span>General</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Brightness: {{ makeupSettings.brightness }}%</label>
                  <input v-model.number="makeupSettings.brightness" type="range" min="0" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Contrast: {{ makeupSettings.contrast }}%</label>
                  <input v-model.number="makeupSettings.contrast" type="range" min="0" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
                <div>
                  <label class="block text-xs text-gray-700 mb-2">Saturation: {{ makeupSettings.saturation }}%</label>
                  <input v-model.number="makeupSettings.saturation" type="range" min="0" max="150" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500" @input="applyMakeup" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Toast
      :show="showToast"
      :type="toastType"
      :title="toastTitle"
      :message="toastMessage"
      :progress="toastProgress"
      :closable="toastType !== 'loading'"
      @close="showToast = false"
    />
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useBackendStorage } from '~/composables/useBackendStorage'

const { user } = useAuth()
const { fetchMannequins, fetchPresentations, fetchFaceSwapResults } = useBackendStorage()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

const isCustomRole = computed(() => user.value?.role === 'custom')

// Source: mannequin, presentation, face-swap, or custom upload
const imageSourceType = ref('mannequin')
const selectedMannequin = ref(null)
const selectedPresentation = ref(null)
const selectedFaceSwap = ref(null)
const customImageFile = ref(null)
const customImagePreview = ref(null)
const fileInput = ref(null)
const sourcePanelRef = ref(null)

const availableMannequins = ref([])
const availablePresentations = ref([])
const availableFaceSwaps = ref([])

const sourceImage = computed(() => {
  if (customImageFile.value && customImagePreview.value) return customImagePreview.value
  if (imageSourceType.value === 'mannequin' && selectedMannequin.value?.fullBodyImage) return selectedMannequin.value.fullBodyImage
  if (imageSourceType.value === 'presentation' && selectedPresentation.value?.generatedImage) return selectedPresentation.value.generatedImage
  if (imageSourceType.value === 'face-swap' && selectedFaceSwap.value?.resultImageUrl) return selectedFaceSwap.value.resultImageUrl
  return null
})

const hasSourceImage = computed(() => !!sourceImage.value)

const processedImage = ref(null)
const isProcessing = ref(false)

/** Builds a text description of the makeup settings for the AI to generate an image with these corrections. */
function buildMakeupPromptForAI(settings) {
  const parts = []
  if (settings.skinTone !== 50) {
    const level = settings.skinTone < 50 ? 'lighter, more even' : 'warmer, more even'
    parts.push(`Apply skin tone correction: make the skin look ${level} and natural.`)
  }
  if (settings.eyesSize !== 100) {
    const dir = settings.eyesSize > 100 ? 'slightly larger' : 'slightly smaller'
    parts.push(`Make the eyes look ${dir} while keeping a natural proportion.`)
  }
  if (settings.eyesBrightness !== 50) {
    const level = settings.eyesBrightness > 50 ? 'brighter and more awake' : 'softer'
    parts.push(`Eyes: ${level}.`)
  }
  if (settings.mouthSize !== 100) {
    const dir = settings.mouthSize > 100 ? 'slightly fuller' : 'slightly smaller'
    parts.push(`Mouth/lips: ${dir}.`)
  }
  if (settings.lipColor !== 50) {
    const level = settings.lipColor > 50 ? 'more color and definition' : 'more natural'
    parts.push(`Lips: ${level}.`)
  }
  if (settings.noseSize !== 100) {
    const dir = settings.noseSize > 100 ? 'slightly larger' : 'slightly smaller'
    parts.push(`Nose: ${dir}, keeping natural look.`)
  }
  if (settings.hairLength !== 100) {
    const dir = settings.hairLength < 100 ? 'shorter' : 'longer'
    parts.push(`Hair: make it look ${dir}.`)
  }
  if (settings.hairShine !== 50) {
    const level = settings.hairShine > 50 ? 'more shine and healthy' : 'more matte'
    parts.push(`Hair: ${level}.`)
  }
  if (settings.faceShape !== 100) {
    const dir = settings.faceShape > 100 ? 'slightly more defined' : 'slightly softer'
    parts.push(`Face shape: ${dir}.`)
  }
  if (settings.brightness !== 100 || settings.contrast !== 100 || settings.saturation !== 100) {
    const adj = []
    if (settings.brightness !== 100) adj.push(settings.brightness > 100 ? 'brighter' : 'darker')
    if (settings.contrast !== 100) adj.push(settings.contrast > 100 ? 'more contrast' : 'softer contrast')
    if (settings.saturation !== 100) adj.push(settings.saturation > 100 ? 'more saturated colors' : 'less saturated')
    parts.push(`Overall image: ${adj.join(', ')}.`)
  }
  if (parts.length === 0) return 'Apply very subtle, natural beauty enhancement while keeping the person and scene identical.'
  return parts.join(' ')
}

/** Configuration sent to the AI: settings + prompt built from corrections. */
const makeupConfiguration = computed(() => {
  const settings = { ...makeupSettings.value }
  const promptForAI = buildMakeupPromptForAI(settings)
  return { settings, promptForAI }
})

const makeupSettings = ref({
  skinTone: 50,
  eyesSize: 100,
  eyesBrightness: 50,
  mouthSize: 100,
  lipColor: 50,
  noseSize: 100,
  hairLength: 100,
  hairShine: 50,
  faceShape: 100,
  brightness: 100,
  contrast: 100,
  saturation: 100,
})

const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

async function loadMannequins() {
  try {
    const loaded = await fetchMannequins()
    availableMannequins.value = loaded.map((m) => ({
      ...m,
      fullBodyImage: m.fullBodyImageUrl || m.generatedImage,
    }))
  } catch (e) {
    console.error('Load mannequins:', e)
  }
}

async function loadPresentations() {
  try {
    const loaded = await fetchPresentations()
    availablePresentations.value = loaded.map((p) => ({
      ...p,
      generatedImage: p.generatedImageUrl || p.generatedImage,
    }))
  } catch (e) {
    console.error('Load presentations:', e)
  }
}

async function loadFaceSwaps() {
  try {
    const loaded = await fetchFaceSwapResults()
    availableFaceSwaps.value = loaded || []
  } catch (e) {
    console.error('Load face swaps:', e)
  }
}

function formatFaceSwapDate(createdAt) {
  if (!createdAt) return ''
  const d = new Date(createdAt)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  loadMannequins()
  loadPresentations()
  loadFaceSwaps()
})

watch(imageSourceType, () => {
  selectedMannequin.value = null
  selectedPresentation.value = null
  selectedFaceSwap.value = null
  customImageFile.value = null
  customImagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
})

function selectMannequin(m) {
  selectedMannequin.value = m
  selectedPresentation.value = null
  selectedFaceSwap.value = null
  customImageFile.value = null
  customImagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function selectPresentation(p) {
  selectedPresentation.value = p
  selectedMannequin.value = null
  selectedFaceSwap.value = null
  customImageFile.value = null
  customImagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function selectFaceSwap(f) {
  selectedFaceSwap.value = f
  selectedMannequin.value = null
  selectedPresentation.value = null
  customImageFile.value = null
  customImagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function openImageUpload() {
  fileInput.value?.click()
}

function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
    showToastMessage('error', 'Error', 'Please select a JPG or PNG image')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    showToastMessage('error', 'Error', 'Image must be under 10MB')
    return
  }
  customImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    customImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  selectedMannequin.value = null
  selectedPresentation.value = null
  selectedFaceSwap.value = null
}

function removeCustomImage() {
  customImageFile.value = null
  customImagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function resetImage() {
  selectedMannequin.value = null
  selectedPresentation.value = null
  selectedFaceSwap.value = null
  customImageFile.value = null
  customImagePreview.value = null
  processedImage.value = null
  resetAdjustments()
  if (fileInput.value) fileInput.value.value = ''
}

function resetAdjustments() {
  makeupSettings.value = {
    skinTone: 50,
    eyesSize: 100,
    eyesBrightness: 50,
    mouthSize: 100,
    lipColor: 50,
    noseSize: 100,
    hairLength: 100,
    hairShine: 50,
    faceShape: 100,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  }
  processedImage.value = null
}

function getImageFilter() {
  const b = makeupSettings.value.brightness / 100
  const c = makeupSettings.value.contrast / 100
  const s = makeupSettings.value.saturation / 100
  return `brightness(${b}) contrast(${c}) saturate(${s})`
}

function getImageTransform() {
  return 'scale(1)'
}

/** Convert source image (data URL or HTTP URL) to raw base64 for the API. */
async function getSourceImageAsBase64() {
  const src = sourceImage.value
  if (!src) return null
  if (src.startsWith('data:')) {
    const base = src.indexOf(',')
    return base >= 0 ? src.slice(base + 1) : null
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const res = await fetch(src, { mode: 'cors' })
    if (!res.ok) throw new Error('Failed to load image from URL')
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        const base = dataUrl.indexOf(',')
        resolve(base >= 0 ? dataUrl.slice(base + 1) : null)
      }
      reader.onerror = () => reject(new Error('Failed to read image'))
      reader.readAsDataURL(blob)
    })
  }
  return src
}

async function generateWithAI() {
  if (!sourceImage.value) return
  isProcessing.value = true
  const config = makeupConfiguration.value
  try {
    let imagePayload = await getSourceImageAsBase64().catch(() => null)
    if (!imagePayload && (sourceImage.value.startsWith('http://') || sourceImage.value.startsWith('https://'))) {
      imagePayload = sourceImage.value
    }
    if (!imagePayload) throw new Error('Could not get image data')
    showToastMessage('loading', 'Generating with AI', 'Creating new image with your corrections...', 30)
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query: `mutation ApplyMakeup($input: ApplyMakeupInput!) { applyMakeup(input: $input) { success resultImage error } }`,
        variables: {
          input: {
            image: imagePayload,
            settings: config.settings,
            promptForAI: config.promptForAI,
          },
        },
      }),
    })
    if (response.errors) throw new Error(response.errors[0]?.message || 'Failed to generate image')
    const result = response.data?.applyMakeup
    if (!result?.success) throw new Error(result?.error || 'Failed to generate image')
    if (result.resultImage) {
      processedImage.value = result.resultImage.startsWith('data:') ? result.resultImage : `data:image/png;base64,${result.resultImage}`
    } else {
      processedImage.value = sourceImage.value
    }
    showToastMessage('success', 'Done', 'New image generated with your corrections.')
    setTimeout(() => { showToast.value = false }, 3000)
  } catch (err) {
    console.error('Generate with AI:', err)
    processedImage.value = sourceImage.value
    showToastMessage('error', 'Generation failed', err?.message || 'AI generation failed. Try again or adjust settings.')
    setTimeout(() => { showToast.value = false }, 4000)
  } finally {
    isProcessing.value = false
  }
}

function downloadImage() {
  const img = processedImage.value || sourceImage.value
  if (!img) return
  try {
    const link = document.createElement('a')
    link.href = img
    link.download = `makeup_${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToastMessage('success', 'Download', 'Image downloaded.')
    setTimeout(() => { showToast.value = false }, 3000)
  } catch (e) {
    showToastMessage('error', 'Error', 'Download failed.')
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

function showToastMessage(type, title, message, progress = null) {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  toastProgress.value = progress
  showToast.value = true
}

</script>
