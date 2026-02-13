<template>
  <div class="h-[calc(100vh-3rem)] overflow-hidden flex flex-col relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl opacity-15"></div>
    </div>

    <!-- Header -->
    <div class="mb-3 sm:mb-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div class="backdrop-blur-sm bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 border border-indigo-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'camera']" class="text-indigo-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Studio Manequin</span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-indigo-500 text-xs flex-shrink-0" />
              <span class="truncate">Customize mannequin poses, backgrounds, and camera angles</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        <!-- Left Panel: Controls -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Source type tabs: Mannequins | Product Thumbs -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-3">
            <div class="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                @click="sourceTab = 'mannequin'; clearSourceIfOther()"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all"
                :class="sourceTab === 'mannequin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'"
              >
                <font-awesome-icon :icon="['fas', 'user']" />
                <span>Mannequins</span>
              </button>
              <button
                type="button"
                @click="sourceTab = 'presentation'; clearSourceIfOther()"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all"
                :class="sourceTab === 'presentation'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'"
              >
                <font-awesome-icon :icon="['fas', 'tshirt']" />
                <span>Product Thumbs</span>
              </button>
            </div>
          </div>

          <!-- Select Source (Mannequin or Product Thumb) -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', sourceTab === 'mannequin' ? 'user' : 'tshirt']" class="text-indigo-600 mr-2" />
              {{ sourceTab === 'mannequin' ? 'Select Mannequin' : 'Select Product Thumb' }}
            </h2>
            <!-- Mannequins tab -->
            <template v-if="sourceTab === 'mannequin'">
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
                  class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400/60 hover:bg-white/40 transition-all text-left flex items-center justify-between"
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
                    :src="selectedMannequin.fullBodyImage || selectedMannequin.generatedImage"
                    alt="Selected mannequin"
                    class="w-full h-48 rounded-lg object-cover border-2 border-indigo-500"
                  />
                </div>
              </div>
            </template>
            <!-- Product Thumbs tab -->
            <template v-else>
              <div v-if="productThumbs.length === 0 && !loadingPresentations" class="backdrop-blur-sm bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
                <p class="text-amber-700 text-sm font-medium">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
                  No product thumbs available. Please create a product thumb first.
                </p>
              </div>
              <div v-else-if="loadingPresentations" class="flex items-center justify-center py-8">
                <font-awesome-icon :icon="['fas', 'spinner']" class="text-indigo-500 text-2xl animate-spin" />
                <span class="ml-2 text-gray-600">Loading product thumbs...</span>
              </div>
              <div v-else>
                <button
                  @click="openProductThumbSelector"
                  type="button"
                  class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400/60 hover:bg-white/40 transition-all text-left flex items-center justify-between"
                >
                  <span class="text-gray-800 font-medium">
                    <span v-if="selectedPresentation">
                      {{ selectedPresentation.productName || 'Product Thumb' }}
                    </span>
                    <span v-else class="text-slate-500">Click to select a product thumb</span>
                  </span>
                  <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-slate-500" />
                </button>
                <div v-if="selectedPresentation" class="mt-3">
                  <img
                    :src="selectedPresentation.generatedImageUrl || selectedPresentation.generatedImage"
                    alt="Selected product thumb"
                    class="w-full h-48 rounded-lg object-cover border-2 border-indigo-500"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- Background Reference -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'image']" class="text-indigo-600 mr-2" />
              Background Reference
            </h2>
            <div class="space-y-4">
              <div class="relative">
                <input
                  type="file"
                  ref="backgroundInput"
                  @change="handleBackgroundUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  @click="backgroundInput?.click()"
                  type="button"
                  class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400/60 hover:bg-white/40 transition-all text-center"
                >
                  <font-awesome-icon :icon="['fas', 'upload']" class="text-indigo-600 text-xl mb-2" />
                  <p class="text-gray-700 font-medium">Upload Background Image</p>
                  <p class="text-xs text-gray-500 mt-1">Click to select a reference image</p>
                </button>
              </div>
              <div v-if="backgroundPreview" class="mt-3">
                <img
                  :src="backgroundPreview"
                  alt="Background preview"
                  class="w-full h-48 rounded-lg object-cover border-2 border-indigo-500"
                />
                <button
                  @click="removeBackground"
                  class="mt-2 w-full px-3 py-2 bg-red-500/20 border border-red-400/40 text-red-700 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                  Remove Background
                </button>
              </div>
            </div>
          </div>

          <!-- Position Settings -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'user-friends']" class="text-indigo-600 mr-2" />
              Position
            </h2>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.position === 'standing'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.position"
                  type="radio"
                  value="standing"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Standing</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.position === 'sitting'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.position"
                  type="radio"
                  value="sitting"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'chair']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Sitting</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.position === 'streamer'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.position"
                  type="radio"
                  value="streamer"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'microphone']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Streamer</span>
              </label>
            </div>
          </div>

          <!-- Camera Focus -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'camera']" class="text-indigo-600 mr-2" />
              Camera Focus
            </h2>
            <div class="grid grid-cols-4 gap-2 sm:gap-3">
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'face'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="face"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'user-circle']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Face</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'hands'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="hands"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'hand-paper']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Hands</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'fps'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="fps"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'hand-rock']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">FPS</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'back'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="back"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'user-secret']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Back</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'full-body'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="full-body"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Full Body</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'upper-body'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="upper-body"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'tshirt']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Upper Body</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="settings.cameraFocus === 'lower-body'
                  ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                  : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
              >
                <input
                  v-model="settings.cameraFocus"
                  type="radio"
                  value="lower-body"
                  class="sr-only"
                />
                <div class="mb-1 sm:mb-2 text-xl sm:text-2xl">
                  <font-awesome-icon :icon="['fas', 'socks']" class="text-indigo-500" />
                </div>
                <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">Lower Body</span>
              </label>
            </div>
          </div>

          <!-- Camera Angle & Perspective -->
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'video']" class="text-indigo-600 mr-2" />
              Camera Angle & Perspective
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Angle</label>
                <div class="grid grid-cols-4 gap-2 sm:gap-3">
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'front'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="front"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'arrow-up']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Front</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'side'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="side"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Side</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'three-quarter'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="three-quarter"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'arrows-alt']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">3/4</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'low-angle'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="low-angle"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'arrow-up']" class="text-indigo-500 rotate-45" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Low</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'high-angle'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="high-angle"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'arrow-down']" class="text-indigo-500 rotate-45" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">High</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'bird-eye'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="bird-eye"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'eye']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Bird's Eye</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraAngle === 'worm-eye'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraAngle"
                      type="radio"
                      value="worm-eye"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'eye']" class="text-indigo-500 rotate-180" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Worm's Eye</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Distance</label>
                <div class="grid grid-cols-4 gap-2 sm:gap-3">
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraDistance === 'close-up'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraDistance"
                      type="radio"
                      value="close-up"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'search-plus']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Close-up</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraDistance === 'medium'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraDistance"
                      type="radio"
                      value="medium"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'expand']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Medium</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraDistance === 'full-body'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraDistance"
                      type="radio"
                      value="full-body"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'user']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Full Body</span>
                  </label>
                  <label
                    class="relative flex flex-col items-center justify-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                    :class="settings.cameraDistance === 'wide'
                      ? 'border-indigo-400/40 bg-indigo-500/20 shadow-lg'
                      : 'border-gray-200 bg-white/20 hover:border-indigo-300/60 hover:bg-indigo-50/30'"
                  >
                    <input
                      v-model="settings.cameraDistance"
                      type="radio"
                      value="wide"
                      class="sr-only"
                    />
                    <div class="mb-1 text-lg sm:text-xl">
                      <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" class="text-indigo-500" />
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-gray-900 text-center">Wide</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateImage"
            :disabled="!canGenerate || isGenerating"
            class="w-full px-4 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <font-awesome-icon
              :icon="isGenerating ? ['fas', 'spinner'] : ['fas', 'magic']"
              :class="{ 'animate-spin': isGenerating }"
            />
            <span>{{ isGenerating ? 'Generating...' : 'Generate New Image' }}</span>
          </button>
        </div>

        <!-- Right Panel: Preview -->
        <div class="space-y-4 sm:space-y-6">
          <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'eye']" class="text-indigo-600 mr-2" />
              Preview
            </h2>
            <div class="relative aspect-[3/4] bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200">
              <div v-if="!previewImage && !selectedSourceImage" class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-gray-400">
                  <font-awesome-icon :icon="['fas', 'image']" class="text-4xl sm:text-6xl mb-4" />
                  <p class="text-sm sm:text-base">Select a mannequin or product thumb to start</p>
                </div>
              </div>
              <div v-else-if="!previewImage && selectedSourceImage" class="absolute inset-0 flex items-center justify-center">
                <img
                  :src="selectedSourceImage"
                  alt="Source preview"
                  class="w-full h-full object-contain"
                />
              </div>
              <img
                v-else
                :src="previewImage"
                alt="Generated preview"
                class="w-full h-full object-contain"
              />
              <div v-if="isGenerating" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="text-center text-white">
                  <font-awesome-icon :icon="['fas', 'spinner']" class="text-4xl sm:text-6xl mb-4 animate-spin" />
                  <p class="text-sm sm:text-base">Generating image...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Generated Images Gallery -->
          <div v-if="generatedImages.length > 0" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
              <font-awesome-icon :icon="['fas', 'images']" class="text-indigo-600 mr-2" />
              Generated Images
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div
                v-for="(image, index) in generatedImages"
                :key="index"
                class="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-indigo-500 transition-all"
                @click="previewImage = image"
              >
                <img
                  :src="image"
                  alt="Generated image"
                  class="w-full h-full object-cover"
                />
                <button
                  @click.stop="downloadImage(image, index)"
                  class="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all"
                  title="Download"
                >
                  <font-awesome-icon :icon="['fas', 'download']" class="text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
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
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">Select Mannequin</h2>
          <button
            @click="showMannequinSelector = false"
            class="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <div v-if="mannequins.length === 0" class="text-center py-8">
            <p class="text-gray-500">No mannequins available</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="mannequin in mannequins"
              :key="mannequin.id"
              @click="selectMannequin(mannequin)"
              class="relative aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="selectedMannequin?.id === mannequin.id
                ? 'border-indigo-500 shadow-lg'
                : 'border-gray-200 hover:border-indigo-300'"
            >
              <img
                :src="mannequin.fullBodyImage || mannequin.generatedImage"
                alt="Mannequin"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs sm:text-sm font-medium">
                {{ mannequin.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Thumb Selector Modal -->
    <div
      v-if="showProductThumbSelector"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="showProductThumbSelector = false"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">Select Product Thumb</h2>
          <button
            @click="showProductThumbSelector = false"
            class="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <div v-if="productThumbs.length === 0" class="text-center py-8">
            <p class="text-gray-500">No product thumbs available</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              v-for="presentation in productThumbs"
              :key="presentation.id"
              @click="selectPresentation(presentation)"
              class="relative aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="selectedPresentation?.id === presentation.id
                ? 'border-indigo-500 shadow-lg'
                : 'border-gray-200 hover:border-indigo-300'"
            >
              <img
                :src="presentation.generatedImageUrl || presentation.generatedImage"
                alt="Product thumb"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs sm:text-sm font-medium truncate">
                {{ presentation.productName || 'Product Thumb' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 max-w-sm"
    >
      <div class="flex items-center space-x-3">
        <font-awesome-icon
          :icon="toastType === 'success' ? ['fas', 'check-circle'] : ['fas', 'exclamation-circle']"
          :class="toastType === 'success' ? 'text-green-500' : 'text-red-500'"
        />
        <p class="text-gray-900 font-medium">{{ toastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBackendStorage } from '~/composables/useBackendStorage'
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'
const backendStorage = useBackendStorage()
const { user } = useAuth()

// State
const sourceTab = ref('mannequin') // 'mannequin' | 'presentation'
const mannequins = ref([])
const selectedMannequin = ref(null)
const showMannequinSelector = ref(false)
const productThumbs = ref([])
const selectedPresentation = ref(null)
const showProductThumbSelector = ref(false)
const loadingPresentations = ref(false)
const backgroundPreview = ref(null)
const backgroundBase64 = ref(null)
const previewImage = ref(null)
const generatedImages = ref([])
const isGenerating = ref(false)
const toastMessage = ref(null)
const toastType = ref('success')
const backgroundInput = ref(null)

const settings = ref({
  position: 'standing', // 'standing', 'sitting', or 'streamer'
  cameraFocus: 'face', // 'face', 'hands', 'fps', 'back', 'full-body', 'upper-body', 'lower-body'
  cameraAngle: 'front', // 'front', 'side', 'three-quarter', 'low-angle', 'high-angle', 'bird-eye', 'worm-eye'
  cameraDistance: 'medium', // 'close-up', 'medium', 'full-body', 'wide'
})

// Computed
const selectedSourceImage = computed(() => {
  if (sourceTab.value === 'mannequin' && selectedMannequin.value) {
    return selectedMannequin.value.fullBodyImage || selectedMannequin.value.generatedImage
  }
  if (sourceTab.value === 'presentation' && selectedPresentation.value) {
    return selectedPresentation.value.generatedImageUrl || selectedPresentation.value.generatedImage
  }
  return null
})

const canGenerate = computed(() => {
  if (sourceTab.value === 'mannequin') return selectedMannequin.value !== null
  return selectedPresentation.value !== null
})

// Methods
const loadMannequins = async () => {
  try {
    const loaded = await backendStorage.fetchMannequins()
    mannequins.value = loaded.map(mannequin => ({
      ...mannequin,
      fullBodyImage: mannequin.fullBodyImageUrl || mannequin.generatedImage,
      faceThumbnail: mannequin.faceThumbnailUrl,
    }))
  } catch (error) {
    console.error('Error loading mannequins:', error)
    showToast('Error loading mannequins', 'error')
  }
}

const selectMannequin = (mannequin) => {
  selectedMannequin.value = mannequin
  showMannequinSelector.value = false
  previewImage.value = null
}

const clearSourceIfOther = () => {
  if (sourceTab.value === 'mannequin') {
    selectedPresentation.value = null
  } else {
    selectedMannequin.value = null
    if (productThumbs.value.length === 0 && !loadingPresentations.value) {
      loadPresentations()
    }
  }
  previewImage.value = null
}

const loadPresentations = async () => {
  loadingPresentations.value = true
  try {
    const loaded = await backendStorage.fetchPresentations()
    productThumbs.value = (loaded || []).filter(Boolean).map(p => ({
      ...p,
      generatedImage: p.generatedImageUrl || p.generatedImage,
    }))
  } catch (error) {
    console.error('Error loading product thumbs:', error)
    showToast('Error loading product thumbs', 'error')
  } finally {
    loadingPresentations.value = false
  }
}

const openProductThumbSelector = () => {
  showProductThumbSelector.value = true
  if (productThumbs.value.length === 0 && !loadingPresentations.value) {
    loadPresentations()
  }
}

const selectPresentation = (presentation) => {
  selectedPresentation.value = presentation
  showProductThumbSelector.value = false
  previewImage.value = null
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    backgroundBase64.value = e.target.result
    backgroundPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeBackground = () => {
  backgroundPreview.value = null
  backgroundBase64.value = null
  if (backgroundInput.value) {
    backgroundInput.value.value = ''
  }
}

// Helper function to convert image URL to base64
const convertImageUrlToBase64 = async (imageUrl) => {
  if (!imageUrl) return null
  
  // If it's already base64, return as is
  if (imageUrl.includes('data:')) {
    return imageUrl
  }
  
  // If it's a URL (GCS), download through backend to avoid CORS
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const response = await fetch(`${API_URL}/api/download-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url: imageUrl }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to download image: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.base64
    } catch (error) {
      console.error('Error downloading image:', error)
      throw new Error(`Failed to download image: ${error.message}`)
    }
  }
  
  // Assume it's already base64 without prefix
  return imageUrl
}

const generateImage = async () => {
  const hasMannequin = sourceTab.value === 'mannequin' && selectedMannequin.value
  const hasPresentation = sourceTab.value === 'presentation' && selectedPresentation.value
  if (!hasMannequin && !hasPresentation) {
    showToast('Please select a mannequin or product thumb first', 'error')
    return
  }

  isGenerating.value = true
  previewImage.value = null

  try {
    // Get source image (mannequin or product thumb) and convert to base64 if needed
    const sourceImageUrl = hasMannequin
      ? (selectedMannequin.value.fullBodyImage || selectedMannequin.value.generatedImage)
      : (selectedPresentation.value.generatedImageUrl || selectedPresentation.value.generatedImage)
    const mannequinImageBase64 = await convertImageUrlToBase64(sourceImageUrl)
    const sourceLabel = hasMannequin ? selectedMannequin.value.name : (selectedPresentation.value.productName || 'Product Thumb')
    const sourceMannequinId = hasMannequin ? selectedMannequin.value.id : (selectedPresentation.value.mannequinId || null)
    
    // Convert background to base64 if provided
    let backgroundImageBase64 = null
    if (backgroundBase64.value) {
      backgroundImageBase64 = await convertImageUrlToBase64(backgroundBase64.value)
    }
    
    // Build prompt with settings
    let prompt = `Generate a new professional image of this mannequin with the following specifications:\n`
    
    // Position instructions
    const positionDescriptions = {
      'standing': 'standing upright',
      'sitting': 'sitting down in a chair',
      'streamer': 'sitting behind a desk/table with a microphone in front, in a streamer/content creator setup. The model should be positioned behind a desk with a professional microphone visible, creating a streaming/recording studio atmosphere',
    }
    prompt += `- Position: ${positionDescriptions[settings.value.position] || positionDescriptions['standing']}\n`
    
    // Camera focus instructions
    const focusDescriptions = {
      'face': 'Close-up on the face, the face should be the main focus and clearly visible',
      'hands': 'Focus on the hands, hands should be prominently displayed and clearly visible',
      'fps': 'First-person perspective (FPS view): Show only the hands/arms from the model\'s own perspective, as if looking down at their own hands. The hands should be in the foreground with a frontal view, creating an immersive first-person shooter game perspective. The camera should be positioned as if it\'s the model\'s own eyes looking at their hands',
      'back': 'View from behind (back view), showing the back of the mannequin',
      'full-body': 'Full body view showing the complete mannequin from head to toe',
      'upper-body': 'Upper body view from waist up, focusing on torso, arms, and face',
      'lower-body': 'Lower body view from waist down, focusing on legs and lower torso',
    }
    prompt += `- Camera focus: ${focusDescriptions[settings.value.cameraFocus] || focusDescriptions['full-body']}\n`
    
    // Camera angle instructions
    const angleDescriptions = {
      'front': 'Front view, camera directly in front of the mannequin',
      'side': 'Side view, camera positioned to the side (profile view)',
      'three-quarter': 'Three-quarter view, camera at a 45-degree angle showing both front and side',
      'low-angle': 'Low angle view, camera positioned below looking up, creating a powerful perspective',
      'high-angle': 'High angle view, camera positioned above looking down, creating a more intimate perspective',
      'bird-eye': "Bird's eye view, camera positioned directly above looking straight down",
      'worm-eye': "Worm's eye view, camera positioned very low looking up dramatically",
    }
    prompt += `- Camera angle: ${angleDescriptions[settings.value.cameraAngle] || angleDescriptions['front']}\n`
    
    // Camera distance instructions
    const distanceDescriptions = {
      'close-up': 'Close-up shot, very close to the subject, focusing on details',
      'medium': 'Medium shot, showing the subject clearly with some surrounding space',
      'full-body': 'Full body shot, showing the complete subject from head to toe',
      'wide': 'Wide shot, showing the subject with plenty of surrounding environment',
    }
    prompt += `- Camera distance: ${distanceDescriptions[settings.value.cameraDistance] || distanceDescriptions['medium']}\n`
    
    if (backgroundImageBase64) {
      prompt += `- Use the provided background reference image as the background environment\n`
    } else {
      prompt += `- Use a clean, professional studio background\n`
    }
    
    prompt += `- Maintain the same face and appearance from the original mannequin image\n`
    prompt += `- The model must NOT hold any product or object in their hands; hands should be empty and natural\n`
    prompt += `- High quality, professional photography style\n`
    prompt += `- Suitable for e-commerce (model only, no product in hands)`

    // Prepare input - if no background, use mannequin image as both images
    // When no background, we want to modify only the mannequin position/angle
    const productImageBase64 = backgroundImageBase64 || mannequinImageBase64
    
    // Use 'wear-product' type when no background to focus on mannequin modification
    // Use 'presentation-product' when background is provided
    const presentationType = backgroundImageBase64 ? 'presentation-product' : 'wear-product'
    
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateProductPresentation($input: CreateProductPresentationInput!) {
            createProductPresentation(input: $input) {
              id
              generatedImage
              generatedImageUrl
            }
          }
        `,
        variables: {
          input: {
            mannequinImage: mannequinImageBase64,
            productImage: productImageBase64,
            presentationType: presentationType,
            productName: `Studio ${sourceLabel}`,
            productDescription: prompt,
            mannequinId: sourceMannequinId,
            modelPose: settings.value.position,
            handPosition: 'empty', // Studio Mannequin: never put products in model's hands
            expression: settings.value.cameraFocus === 'face' ? 'focused' : 'natural',
            environmentType: backgroundImageBase64 ? 'indoor' : 'studio',
            blurBackground: false,
            imageOrientation: 'vertical',
          },
        },
      }),
    })

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    if (result.data?.createProductPresentation) {
      const generatedData = result.data.createProductPresentation
      const imageUrl = generatedData.generatedImageUrl || generatedData.generatedImage
      previewImage.value = imageUrl
      generatedImages.value.unshift(imageUrl)
      showToast('Image generated successfully!', 'success')
    } else {
      throw new Error('No data returned from server')
    }
  } catch (error) {
    console.error('Error generating image:', error)
    showToast(`Error generating image: ${error.message}`, 'error')
  } finally {
    isGenerating.value = false
  }
}

const downloadImage = (imageUrl, index) => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `studio-mannequin-${Date.now()}-${index}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadMannequins()
})
</script>
