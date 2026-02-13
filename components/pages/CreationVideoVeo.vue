<template>
  <div class="w-full pb-8 relative">
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
          <div class="backdrop-blur-sm bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'video']" class="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Product Clip</span>
              <span class="text-xs font-normal text-blue-700 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {{ videos.length }} {{ videos.length === 1 ? 'clip' : 'clips' }}
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-blue-500 text-xs flex-shrink-0" />
              <span class="truncate">Create professional product clips from your thumbs using AI</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            v-if="!selectedPresentation"
            @click="createNewVideoPresentation"
            class="w-full sm:w-auto backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-blue-500/40 hover:to-blue-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span class="hidden sm:inline">New Clip</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-3 sm:px-6 lg:px-8 relative z-10">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-12">
        <div class="text-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-blue-500 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-800 font-medium text-sm sm:text-base">Loading...</p>
        </div>
      </div>

      <!-- Video Creation Modal -->
      <div
        v-if="showSelectionCard || selectedPresentation"
        class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto transition-opacity duration-300"
        @click.self="closeVideoCreationModal"
      >
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative my-4 sm:my-8 transform transition-all duration-300">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          </div>
          
          <!-- Close Button -->
          <button
            @click="closeVideoCreationModal"
            class="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 z-10"
            title="Close"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
          </button>

          <!-- Video Creation Interface -->
          <div class="space-y-4 sm:space-y-6 p-3 sm:p-6 relative z-10">
            <!-- Step Indicator -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-0">
            <!-- Step 1 -->
            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 w-full md:w-auto">
              <div
                :class="[
                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all backdrop-blur-sm border-2 shadow-lg text-sm sm:text-base',
                  currentStep >= 1
                    ? 'bg-blue-500/30 border-blue-400/40 text-blue-700'
                    : 'bg-slate-200/40 border-slate-300/40 text-slate-500'
                ]"
              >
                <span v-if="currentStep > 1">✓</span>
                <span v-else>1</span>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'font-medium text-xs sm:text-sm',
                    currentStep >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-700'
                  ]"
                >
                  Select Presentation
                </p>
                <p class="text-[10px] sm:text-xs text-gray-700">Choose a product thumb</p>
              </div>
            </div>
            
            <!-- Connector -->
            <div
              :class="[
                'hidden md:block h-0.5 flex-1 mx-2 sm:mx-4 rounded-full backdrop-blur-sm',
                currentStep >= 2 ? 'bg-blue-500/40 border border-blue-400/30' : 'bg-slate-200/40 border border-slate-300/30'
              ]"
            ></div>
            
            <!-- Step 2 -->
            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 w-full md:w-auto">
              <div
                :class="[
                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all backdrop-blur-sm border-2 shadow-lg text-sm sm:text-base',
                  currentStep >= 2
                    ? 'bg-blue-500/30 border-blue-400/40 text-blue-700'
                    : 'bg-slate-200/40 border-slate-300/40 text-slate-500'
                ]"
              >
                <span v-if="currentStep > 2">✓</span>
                <span v-else>2</span>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'font-medium text-xs sm:text-sm',
                    currentStep >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-700'
                  ]"
                >
                  Video Prompt
                </p>
                <p class="text-[10px] sm:text-xs text-gray-700">Configure video description</p>
              </div>
            </div>
            
            <!-- Connector -->
            <div
              :class="[
                'hidden md:block h-0.5 flex-1 mx-2 sm:mx-4 rounded-full backdrop-blur-sm',
                currentStep >= 3 ? 'bg-blue-500/40 border border-blue-400/30' : 'bg-slate-200/40 border border-slate-300/30'
              ]"
            ></div>
            
            <!-- Step 3 -->
            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 w-full md:w-auto">
              <div
                :class="[
                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all backdrop-blur-sm border-2 shadow-lg text-sm sm:text-base',
                  currentStep >= 3
                    ? 'bg-blue-500/30 border-blue-400/40 text-blue-700'
                    : 'bg-slate-200/40 border-slate-300/40 text-slate-500'
                ]"
              >
                3
              </div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'font-medium text-xs sm:text-sm',
                    currentStep >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-700'
                  ]"
                >
                  Video Settings
                </p>
                <p class="text-[10px] sm:text-xs text-gray-700">Configure video parameters</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Select a Product Presentation -->
        <div v-if="currentStep === 1" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'images']" class="text-blue-500 text-lg sm:text-xl" />
              <span>Step 1: Select a Product Thumb</span>
            </h2>
            <button
              @click="closeVideoCreationModal"
              class="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
          
          <p class="text-gray-700 text-xs sm:text-sm mb-4 sm:mb-6 font-medium">Choose a product thumb image to create a clip from</p>
          
          <!-- Presentations Grid -->
          <div v-if="presentations.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div
              v-for="presentation in presentations"
              :key="presentation.id"
              @click="selectPresentation(presentation)"
              class="group relative bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:scale-105 rounded-xl"
              :style="presentation.isVertical ? 'aspect-ratio: 1 / 2;' : 'aspect-ratio: 1 / 1;'"
            >
              <div class="w-full h-full relative overflow-hidden">
                <img
                  v-if="presentation.generatedImage"
                  :src="presentation.generatedImage"
                  alt="Product presentation"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-8xl opacity-30">🛍️</div>
                
                <!-- Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 class="text-lg font-bold text-white mb-1">{{ presentation.productName || 'Untitled Product' }}</h3>
                    <p class="text-gray-200 text-xs line-clamp-2">{{ presentation.productDescription || 'No description' }}</p>
                    <button class="mt-3 px-4 py-2 bg-blue-500 border border-blue-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm font-medium">
                      Select for Clip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-8 sm:py-12">
            <div class="bg-gray-200 border border-gray-300 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <font-awesome-icon :icon="['fas', 'images']" class="text-gray-500 text-3xl sm:text-5xl" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Product Thumbs Available</h3>
            <p class="text-sm sm:text-base text-gray-700 mb-4 font-medium px-4">Create a product thumb first to generate clips from it.</p>
          </div>
        </div>

        <!-- Step 2: Video Prompt Configuration -->
        <div v-if="currentStep === 2 && selectedPresentation" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'edit']" class="text-blue-500 text-lg sm:text-xl" />
              <span class="hidden sm:inline">Step 2: Video Prompt Configuration</span>
              <span class="sm:hidden">Step 2: Prompt</span>
            </h2>
          </div>
          
          <!-- Selected Presentation Preview -->
          <div class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div class="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div class="backdrop-blur-sm bg-slate-200/40 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 w-20 h-20 sm:w-[120px] sm:h-[120px]">
                <img
                  :src="selectedPresentation.generatedImage"
                  alt="Selected presentation"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">{{ selectedPresentation.productName || 'Untitled Product' }}</h3>
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-2">{{ selectedPresentation.productDescription || 'No description' }}</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- Video Title -->
            <div class="mb-3 sm:mb-4">
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <span>Video Title <span class="text-red-500">*</span></span>
                <button
                  @click="fillRecommendedTitle"
                  :disabled="isGenerating"
                  type="button"
                  class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                  title="Fill with recommended value"
                >
                  <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                </button>
              </label>
              <input
                v-model="videoTitle"
                :disabled="isGenerating"
                type="text"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 font-medium text-sm sm:text-base"
                placeholder="Enter a title for this video (e.g., 'Summer Collection Promo')"
              />
              <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">This title will appear in your Dashboard activities</p>
            </div>

            <!-- Scene -->
            <div class="mb-3 sm:mb-4">
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <span>Scene Description <span class="text-red-500">*</span></span>
                <button
                  @click="fillRecommendedScene"
                  :disabled="isGenerating"
                  type="button"
                  class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                  title="Fill with recommended value"
                >
                  <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                </button>
              </label>
              <textarea
                v-model="promptData.scene"
                :disabled="isGenerating"
                rows="3"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 resize-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                placeholder="Describe the scene. Example: 'A young woman holds a bottle of GlowRadiance Radiant Glow Vitamin-C Serum up to camera and smiles naturally.'"
              ></textarea>
            </div>

            <!-- Dialogue -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Dialogue Lines
              </label>
              <div v-for="(line, index) in promptData.dialogue" :key="index" class="flex items-center space-x-2 mb-2">
                <input
                  v-model="promptData.dialogue[index]"
                  :disabled="isGenerating"
                  type="text"
                  class="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  :placeholder="`Dialogue line ${index + 1}`"
                />
                <button
                  v-if="promptData.dialogue.length > 1"
                  @click="promptData.dialogue.splice(index, 1)"
                  :disabled="isGenerating"
                  class="p-1.5 sm:p-2 text-red-600 hover:bg-red-500/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-red-400/30 disabled:opacity-50"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                </button>
              </div>
              <button
                @click="promptData.dialogue.push('')"
                :disabled="isGenerating"
                class="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center space-x-1 disabled:opacity-50 transition-colors"
              >
                <font-awesome-icon :icon="['fas', 'plus']" />
                <span>Add Dialogue Line</span>
              </button>
            </div>

            <!-- Advanced Settings Toggle (shown before advanced fields) -->
            <div v-if="!showAdvancedSettings" class="border-t border-gray-200 pt-3 sm:pt-4 mb-3 sm:mb-4">
              <div class="flex items-center justify-between">
                <label class="block text-xs sm:text-sm font-medium text-gray-800">
                  Advanced Settings
                </label>
                <button
                  @click="showAdvancedSettings = !showAdvancedSettings"
                  :disabled="isGenerating"
                  type="button"
                  class="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium disabled:opacity-50 transition-colors"
                >
                  Show
                </button>
              </div>
            </div>

            <!-- Advanced Fields (shown only when showAdvancedSettings is true) -->
            <template v-if="showAdvancedSettings">
              <!-- Product Info -->
              <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <span>Product Brand</span>
                    <button
                      @click="fillRecommendedBrand"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.product.brand"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., GlowRadiance"
                  />
                </div>
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800 mb-2">
                    <span>Product Name</span>
                    <button
                      @click="fillRecommendedProductName"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.product.name"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., Radiant Glow Vitamin-C Serum"
                  />
                </div>
              </div>

              <!-- Style -->
              <div class="mb-3 sm:mb-4">
                <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <span>Style</span>
                  <button
                    @click="fillRecommendedStyle"
                    :disabled="isGenerating"
                    type="button"
                    class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                    title="Fill with recommended value"
                  >
                    <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                  </button>
                </label>
                <input
                  v-model="promptData.style"
                  :disabled="isGenerating"
                  type="text"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="e.g., UGC-style, casual, authentic influencer vibe"
                />
              </div>

              <!-- Camera Settings -->
              <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Camera Shot
                  </label>
                  <select
                    v-model="promptData.camera.shot"
                    :disabled="isGenerating"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 text-sm sm:text-base"
                  >
                    <option value="">Select shot type</option>
                    <option value="close-up">Close-up</option>
                    <option value="medium close-up">Medium Close-up</option>
                    <option value="medium shot">Medium Shot</option>
                    <option value="wide shot">Wide Shot</option>
                    <option value="extreme close-up">Extreme Close-up</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Camera Movement
                  </label>
                  <select
                    v-model="promptData.camera.movement"
                    :disabled="isGenerating"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 text-sm sm:text-base"
                  >
                    <option value="">Select movement</option>
                    <option value="static">Static</option>
                    <option value="slight push in">Slight Push In</option>
                    <option value="push in">Push In</option>
                    <option value="pull out">Pull Out</option>
                    <option value="pan left">Pan Left</option>
                    <option value="pan right">Pan Right</option>
                    <option value="tilt up">Tilt Up</option>
                    <option value="tilt down">Tilt Down</option>
                    <option value="orbit around">Orbit Around</option>
                  </select>
                </div>
              </div>

              <!-- Lighting & Environment -->
              <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <span>Lighting</span>
                    <button
                      @click="fillRecommendedLighting"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.lighting"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., soft natural window light with warm tone"
                  />
                </div>
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800 mb-2">
                    <span>Environment</span>
                    <button
                      @click="fillRecommendedEnvironment"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.environment"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., same as original image"
                  />
                </div>
              </div>

              <!-- Audio Settings -->
              <div v-if="videoSettings.generateAudio" class="mb-3 sm:mb-4 space-y-3">
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <span>Voice Description</span>
                    <button
                      @click="fillRecommendedVoice"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.audio.voice"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., clear, friendly female voice, conversational tone"
                  />
                </div>
                <div>
                  <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800 mb-2">
                    <span>Soundtrack Description</span>
                    <button
                      @click="fillRecommendedSoundtrack"
                      :disabled="isGenerating"
                      type="button"
                      class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all duration-200 disabled:opacity-50"
                      title="Fill with recommended value"
                    >
                      <font-awesome-icon :icon="['fas', 'magic']" class="text-xs" />
                    </button>
                  </label>
                  <input
                    v-model="promptData.audio.soundtrack"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="e.g., very subtle ambient upbeat tune under voice"
                  />
                </div>
              </div>

              <!-- Advanced Settings -->
              <div class="border-t border-gray-200 pt-3 sm:pt-4">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-xs sm:text-sm font-medium text-gray-800">
                    Advanced Settings
                  </label>
                  <button
                    @click="showAdvancedSettings = !showAdvancedSettings"
                    :disabled="isGenerating"
                    type="button"
                    class="text-xs sm:text-sm text-blue-700 hover:text-blue-800 font-medium disabled:opacity-50 transition-colors"
                  >
                    Hide
                  </button>
                </div>
                
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                      Negative Prompt
                    </label>
                    <textarea
                      v-model="promptData.config.negativePrompt"
                      :disabled="isGenerating"
                      rows="2"
                      class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 resize-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      placeholder="e.g., overly dramatic cinematic lighting, heavy effects, unrealistic skin"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                      Seed (optional)
                    </label>
                    <input
                      v-model.number="promptData.config.seed"
                      :disabled="isGenerating"
                      type="number"
                      class="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                      placeholder="e.g., 12345"
                    />
                  </div>
                </div>
              </div>

              <!-- Consistency Context -->
              <div class="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                  <label class="block text-xs sm:text-sm font-medium text-gray-800">
                    Consistency Context
                    <span class="text-[10px] sm:text-xs font-normal text-gray-700 ml-1 sm:ml-2">Helps maintain face and clothing details</span>
                  </label>
                  <button
                    @click="enableConsistencyContext = !enableConsistencyContext"
                    :disabled="isGenerating"
                    type="button"
                    class="relative inline-flex h-5 w-9 sm:h-6 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    :class="enableConsistencyContext ? 'bg-blue-600' : 'bg-gray-200'"
                    role="switch"
                    :aria-checked="enableConsistencyContext"
                  >
                    <span
                      class="pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="enableConsistencyContext ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
                
                <div v-if="enableConsistencyContext" class="space-y-3">
                  <textarea
                    v-model="consistencyContext"
                    :disabled="isGenerating"
                    rows="3"
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all disabled:opacity-50 resize-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="Add additional specific details to maintain (optional). Basic consistency instructions are automatically included."
                  ></textarea>
                  <div class="space-y-1">
                    <p class="text-[10px] sm:text-xs text-gray-700 font-medium">
                      <font-awesome-icon :icon="['fas', 'check-circle']" class="text-emerald-500 mr-1" />
                      <span class="font-semibold">Automatically included:</span> Maintain the model's exact facial features, keep clothing details (colors, buttons, patterns), preserve hairstyle and accessories throughout all movements.
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Navigation Buttons -->
          <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              @click="currentStep = 1"
              :disabled="isGenerating"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border border-gray-200 text-gray-800 rounded-lg sm:rounded-xl hover:bg-white/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              <span>Previous</span>
            </button>
            <button
              @click="currentStep = 3"
              :disabled="isGenerating || !promptData.scene.trim() || !videoTitle.trim()"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span class="hidden sm:inline">Next: Video Settings</span>
              <span class="sm:hidden">Next</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
          </div>
        </div>

        <!-- Step 3: Video Settings -->
        <div v-if="currentStep === 3" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'cog']" class="text-blue-500 text-lg sm:text-xl" />
              <span class="hidden sm:inline">Step 3: Video Settings</span>
              <span class="sm:hidden">Step 3: Settings</span>
            </h2>
          </div>
          
          <div class="space-y-4 sm:space-y-6">
            <!-- AI Model Type (First) -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">AI Model Type</label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  v-for="type in [{ value: 'fast', label: 'Veo 3.1 Fast', description: 'Faster generation' }, { value: 'normal', label: 'Veo 3.1', description: 'Higher quality' }]"
                  :key="type.value"
                  @click="videoSettings.modelType = type.value"
                  :class="[
                    'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium text-xs sm:text-sm backdrop-blur-sm',
                    videoSettings.modelType === type.value
                      ? 'border-blue-400/40 bg-blue-500/20 text-blue-700'
                      : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-0.5 sm:space-y-1">
                    <span class="font-semibold text-xs sm:text-sm">{{ type.label }}</span>
                    <span class="text-[10px] sm:text-xs opacity-75">{{ type.description }}</span>
                  </div>
                </button>
              </div>
              <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">Choose the AI model for video generation</p>
            </div>

            <!-- Duration -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div class="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  v-for="dur in [4, 6, 8]"
                  :key="dur"
                  @click="videoSettings.duration = dur"
                  :class="[
                    'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium backdrop-blur-sm text-xs sm:text-sm',
                    videoSettings.duration === dur
                      ? 'border-blue-400/40 bg-blue-500/20 text-blue-700'
                      : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                  ]"
                >
                  {{ dur }}s
                </button>
              </div>
            </div>

            <!-- Resolution -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <div class="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  v-for="res in ['720p', '1080p', '4k']"
                  :key="res"
                  @click="videoSettings.resolution = res"
                  :class="[
                    'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium backdrop-blur-sm text-xs sm:text-sm',
                    videoSettings.resolution === res
                      ? 'border-blue-400/40 bg-blue-500/20 text-blue-700'
                      : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                  ]"
                >
                  {{ res }}
                </button>
              </div>
            </div>

            <!-- Aspect Ratio -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  v-for="orientation in [
                    { value: 'vertical', label: 'Vertical', icon: 'mobile' },
                    { value: 'horizontal', label: 'Horizontal', icon: 'desktop' }
                  ]"
                  :key="orientation.value"
                  @click="videoSettings.aspectRatio = orientation.value === 'vertical' ? '9:16' : '16:9'"
                  :class="[
                    'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium flex flex-col items-center space-y-1 sm:space-y-2 backdrop-blur-sm text-xs sm:text-sm',
                    (videoSettings.aspectRatio === '9:16' && orientation.value === 'vertical') || 
                    (videoSettings.aspectRatio === '16:9' && orientation.value === 'horizontal')
                      ? 'border-blue-400/40 bg-blue-500/20 text-blue-700'
                      : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                  ]"
                >
                  <font-awesome-icon :icon="['fas', orientation.icon]" class="text-lg sm:text-xl" />
                  <span>{{ orientation.label }}</span>
                </button>
              </div>
              <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">
                Vertical: 9:16 (mobile/portrait) | Horizontal: 16:9 (desktop/landscape)
              </p>
            </div>

            <!-- Generate Audio -->
            <div class="mb-3 sm:mb-4">
              <label class="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-3 sm:p-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  v-model="videoSettings.generateAudio"
                  :disabled="isGenerating"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-white border border-gray-200 rounded focus:ring-blue-500/50 disabled:opacity-50 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <span class="text-xs sm:text-sm font-semibold text-gray-800">Generate Audio</span>
                  <p class="text-[10px] sm:text-xs text-gray-600 mt-1">Include audio generation in the video (increases cost)</p>
                </div>
              </label>
            </div>

            <!-- Project ID -->
            <div class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Google Cloud Project ID <span class="text-red-500">*</span>
                <span v-if="!isCustomRole && googleProjectId" class="text-[10px] sm:text-xs text-blue-600 font-normal ml-1 sm:ml-2">(Auto-filled from system)</span>
              </label>
              <input
                v-model="googleProjectId"
                :disabled="!isCustomRole && googleProjectId"
                type="text"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                placeholder="Enter your Google Cloud Project ID"
              />
              <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">Your Google Cloud Project ID where Vertex AI is enabled</p>
              <p v-if="!isCustomRole && googleProjectId" class="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium flex items-center space-x-1">
                <font-awesome-icon :icon="['fas', 'info-circle']" />
                <span>Project ID is automatically managed by the system for your plan</span>
              </p>
            </div>

            <!-- API Key (only for custom role) -->
            <div v-if="isCustomRole" class="mb-3 sm:mb-4">
              <label class="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                Google API Key / Access Token <span class="text-red-500">*</span>
              </label>
              <input
                v-model="googleApiKey"
                type="password"
                class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                placeholder="Enter your Google API key or OAuth token"
              />
              <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">OAuth token (via gcloud auth) or API key. Note: Vertex AI typically requires OAuth token.</p>
              <p class="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium flex items-center space-x-1">
                <font-awesome-icon :icon="['fas', 'info-circle']" />
                <span>You can also configure this in Settings</span>
              </p>
            </div>
            <!-- Info for free users -->
            <div v-else class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <font-awesome-icon :icon="['fas', 'info-circle']" class="text-blue-600 text-xl mt-0.5" />
                <div>
                  <p class="text-sm text-blue-800 font-medium">
                    API key is automatically managed by the system for your plan.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Navigation Buttons and Generate Button -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                @click="currentStep = 2"
                :disabled="isGenerating"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border border-gray-200 text-gray-800 rounded-lg sm:rounded-xl hover:bg-white/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
              >
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
                <span>Previous</span>
              </button>
              
              <div class="flex flex-col items-center space-y-2 w-full sm:w-auto">
                <button
                  @click="generateVideo"
                  :disabled="isGenerating || !canGenerate"
                  class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <font-awesome-icon v-if="!isGenerating" :icon="['fas', 'video']" />
                  <span v-if="isGenerating" class="animate-spin">⏳</span>
                  <span class="text-xs sm:text-base">{{ isGenerating ? 'Generating Clip...' : `Generate Clip` }}</span>
                </button>
                <div class="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg w-full sm:w-auto">
                  <p class="text-[10px] sm:text-xs text-gray-800 text-center font-medium">
                    <span class="font-semibold">Estimated Cost: ${{ calculateVideoCost.totalPrice.toFixed(2) }}</span>
                    <span class="text-gray-700"> ({{ videoSettings.duration }}s × ${{ calculateVideoCost.pricePerSecond.toFixed(2) }}/s)</span>
                  </p>
                  <p class="text-[10px] sm:text-xs text-gray-700 text-center mt-1 font-medium">
                    Model: {{ videoSettings.modelType === 'fast' ? 'Veo 3.1 Fast' : 'Veo 3.1' }} | 
                    {{ videoSettings.generateAudio ? 'With Audio' : 'Video Only' }} | 
                    {{ videoSettings.resolution }}
                  </p>
                  <p class="text-[10px] sm:text-xs text-emerald-700 text-center mt-1 font-semibold">
                    Credits: {{ calculateVideoCost.credits }} ({{ calculateVideoCost.creditsPerSecond }}/s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      <!-- Videos Grid (Thumbnails) -->
      <div v-if="videos.length > 0 && !selectedPresentation && !showSelectionCard" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" style="grid-auto-rows: 1fr;">
          <div
            v-for="video in paginatedVideos"
            :key="video.id"
          class="group relative bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 rounded-xl shadow-lg hover:shadow-xl"
          :style="video.aspectRatio === '9:16' ? 'aspect-ratio: 9 / 16;' : 'aspect-ratio: 16 / 9;'"
        >
          <!-- Video Thumbnail -->
          <div class="w-full h-full relative overflow-hidden">
            <video
              v-if="video.generatedVideo"
              :src="video.generatedVideo"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              muted
              preload="metadata"
            ></video>
            <div v-else class="w-full h-full flex items-center justify-center text-6xl opacity-30">🎬</div>
            
            <!-- Play Icon (centered, always visible) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="bg-black/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group-hover:bg-black/60 group-hover:scale-110">
                <font-awesome-icon :icon="['fas', 'play']" class="text-white text-2xl ml-1" />
              </div>
            </div>
            
            <!-- Badge -->
            <div
              class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Video
            </div>
          </div>

          <!-- Overlay with Info (shown on hover) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 class="text-sm font-bold text-white mb-1 line-clamp-2">{{ video.title || video.prompt || 'Untitled Video' }}</h3>
              <div class="flex items-center justify-between pt-2 border-t border-white/20">
                <div class="flex items-center space-x-1 text-xs text-gray-300">
                  <font-awesome-icon :icon="['fas', 'clock']" class="text-xs" />
                  <span>{{ video.duration }}s • {{ video.resolution }}</span>
                </div>
                <div class="flex space-x-1">
                  <button 
                    @click.stop="viewFullVideo(video)" 
                    class="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm" 
                    title="View Details"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" class="text-xs" />
                  </button>
                  <button 
                    @click.stop="downloadVideo(video)" 
                    class="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm" 
                    title="Download"
                  >
                    <font-awesome-icon :icon="['fas', 'download']" class="text-xs" />
                  </button>
                  <button 
                    @click.stop="deleteVideo(video.id)" 
                    class="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors" 
                    title="Delete"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalVideoPages > 1" class="flex items-center justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-6 flex-wrap gap-2">
          <button
            @click="previousVideoPage"
            :disabled="currentVideoPage === 1"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center space-x-1 sm:space-x-2 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
            <span>Previous</span>
          </button>
          
          <div class="flex items-center space-x-1 sm:space-x-2">
            <button
              v-for="page in visibleVideoPages"
              :key="page"
              @click="goToVideoPage(page)"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300"
              :class="currentVideoPage === page 
                ? 'bg-blue-500/30 border-2 border-blue-400/40 text-blue-700 shadow-lg' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-400/40'"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="nextVideoPage"
            :disabled="currentVideoPage === totalVideoPages"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center space-x-1 sm:space-x-2 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <span>Next</span>
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>

        <!-- Page Info -->
        <div v-if="totalVideoPages > 1" class="text-center text-xs sm:text-sm text-gray-600 font-medium px-2">
          Showing {{ (currentVideoPage - 1) * videosPerPage + 1 }} - {{ Math.min(currentVideoPage * videosPerPage, videos.length) }} of {{ videos.length }} videos
        </div>
      </div>

      <!-- Empty State Message -->
      <div v-if="videos.length === 0 && !selectedPresentation && !showSelectionCard" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-12 text-center">
        <div class="backdrop-blur-sm bg-slate-200/40 border border-slate-300/40 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <font-awesome-icon :icon="['fas', 'video']" class="text-slate-500 text-3xl sm:text-5xl" />
        </div>
        <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">No Product Clip created</h3>
        <p class="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-medium px-4">Start by creating your first product clip. It's quick and easy!</p>
        <button
          @click="createNewVideoPresentation"
          class="backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 mx-auto text-sm sm:text-base"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Create First Clip</span>
        </button>
      </div>
    </div>

    <!-- Video Modal for Full View -->
    <div
      v-if="showVideoModal && selectedVideo"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="closeVideoModal"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 backdrop-blur-sm bg-white/40 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-t-xl sm:rounded-t-2xl z-10 relative">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent truncate">{{ selectedVideo.title || selectedVideo.prompt || 'Untitled Video' }}</h3>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
              {{ selectedVideo.duration }}s • {{ selectedVideo.resolution }} • {{ formatAspectRatio(selectedVideo.aspectRatio) }}
            </p>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <button
              @click="downloadVideo(selectedVideo)"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'download']" />
              <span>Download</span>
            </button>
            <button
              @click="closeVideoModal"
              class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-3 sm:p-6 relative z-10">
          <!-- Video Player -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-4">Video</h4>
            <div class="backdrop-blur-sm bg-slate-900/80 rounded-lg overflow-hidden border border-white/20">
              <video
                v-if="selectedVideo.generatedVideo"
                :src="selectedVideo.generatedVideo"
                controls
                class="w-full h-auto max-h-[70vh]"
                autoplay
              >
                Your browser does not support the video tag.
              </video>
              <div v-else class="h-96 flex items-center justify-center text-gray-400">
                <font-awesome-icon :icon="['fas', 'video']" class="text-6xl" />
              </div>
            </div>
          </div>

          <!-- Video Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Duration</p>
              <p class="text-sm font-semibold text-gray-900">{{ selectedVideo.duration }}s</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Resolution</p>
              <p class="text-sm font-semibold text-gray-900">{{ selectedVideo.resolution }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Orientation</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatAspectRatio(selectedVideo.aspectRatio) }}</p>
            </div>
          </div>

          <!-- Prompt/Description -->
          <div v-if="selectedVideo.prompt || selectedVideo.structuredPrompt" class="mt-6">
            <h4 class="text-lg font-semibold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-3">Video Prompt</h4>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div v-if="selectedVideo.structuredPrompt" class="mb-4">
                <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Structured Prompt (JSON)</p>
                <pre class="text-xs text-gray-800 bg-white p-3 rounded border border-gray-200 overflow-auto max-h-64">{{ selectedVideo.structuredPrompt }}</pre>
              </div>
              <div v-if="selectedVideo.prompt">
                <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Formatted Prompt</p>
                <p class="text-gray-800 leading-relaxed">{{ selectedVideo.prompt }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
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
import { useLocalStorage } from '~/composables/useLocalStorage'
import { useBackendStorage } from '~/composables/useBackendStorage'
import { useAuth } from '~/composables/useAuth'

const storage = useLocalStorage()
const backendStorage = useBackendStorage()
const { user } = useAuth()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// State
const selectedPresentation = ref(null)
const presentations = ref([])
const videos = ref([])

// Pagination state for videos
const currentVideoPage = ref(1)
const videosPerPage = 8 // 8 videos per page (2 rows of 4)

// Computed for paginated videos
const paginatedVideos = computed(() => {
  const start = (currentVideoPage.value - 1) * videosPerPage
  const end = start + videosPerPage
  return videos.value.slice(start, end)
})

const totalVideoPages = computed(() => {
  return Math.ceil(videos.value.length / videosPerPage)
})

const visibleVideoPages = computed(() => {
  const pages = []
  const total = totalVideoPages.value
  const current = currentVideoPage.value
  
  // Show max 5 page numbers
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  // Adjust if we're near the start
  if (current < 3) {
    end = Math.min(total, 5)
  }
  
  // Adjust if we're near the end
  if (current > total - 2) {
    start = Math.max(1, total - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Pagination functions for videos
const nextVideoPage = () => {
  if (currentVideoPage.value < totalVideoPages.value) {
    currentVideoPage.value++
  }
}

const previousVideoPage = () => {
  if (currentVideoPage.value > 1) {
    currentVideoPage.value--
  }
}

const goToVideoPage = (page) => {
  if (page >= 1 && page <= totalVideoPages.value) {
    currentVideoPage.value = page
  }
}
const videoPrompt = ref('') // Legacy - will be generated from promptData
const enableConsistencyContext = ref(false) // Toggle to enable/disable consistency context
const consistencyContext = ref('')
const isGenerating = ref(false)
const googleApiKey = ref('')
const googleProjectId = ref('')
const showSelectionCard = ref(false) // Control when to show selection card
const isLoading = ref(true) // Track initial loading state
const showVideoModal = ref(false) // Control video modal visibility
const selectedVideo = ref(null) // Selected video for modal view
const showAdvancedSettings = ref(false) // Control advanced settings visibility
const currentStep = ref(1) // Current step in the creation process (1, 2, or 3)
const videoTitle = ref('') // Video title for Dashboard display

// Toast state
const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Structured prompt data
const promptData = ref({
  scene: '',
  dialogue: [''],
  product: {
    brand: '',
    name: '',
  },
  style: '',
  camera: {
    shot: '',
    movement: '',
    aspectRatio: '9:16', // Will be synced with videoSettings
  },
  lighting: '',
  environment: '',
  audio: {
    voice: '',
    soundtrack: '',
  },
  config: {
    negativePrompt: '',
    seed: null,
  },
})

// Video settings
const videoSettings = ref({
  duration: 4,
  resolution: '720p', // Default to 720p
  aspectRatio: '9:16', // Default to vertical (9:16)
  modelType: 'fast', // Default to Veo 3.1 Fast
  generateAudio: false, // Default: no audio
})

// Pricing configuration from backend
const pricingConfig = ref(null)
const isLoadingPricing = ref(false)

// Load pricing configuration from backend
const loadPricingConfig = async () => {
  try {
    isLoadingPricing.value = true
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          query Pricing {
            pricing {
              veoVideo {
                fast {
                  base {
                    pricePerSecond
                    creditsPerSecond
                  }
                  withAudio {
                    pricePerSecond
                    creditsPerSecond
                  }
                  p4k {
                    base {
                      pricePerSecond
                      creditsPerSecond
                    }
                    withAudio {
                      pricePerSecond
                      creditsPerSecond
                    }
                  }
                }
                normal {
                  p720 {
                    base {
                      pricePerSecond
                      creditsPerSecond
                    }
                    withAudio {
                      pricePerSecond
                      creditsPerSecond
                    }
                  }
                  p1080 {
                    base {
                      pricePerSecond
                      creditsPerSecond
                    }
                    withAudio {
                      pricePerSecond
                      creditsPerSecond
                    }
                  }
                  p4k {
                    base {
                      pricePerSecond
                      creditsPerSecond
                    }
                    withAudio {
                      pricePerSecond
                      creditsPerSecond
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    })

    if (response.errors) {
      console.error('Error loading pricing:', response.errors)
      return
    }

    if (response.data && response.data.pricing) {
      pricingConfig.value = response.data.pricing
    }
  } catch (error) {
    console.error('Error fetching pricing configuration:', error)
  } finally {
    isLoadingPricing.value = false
  }
}

// Calculate video cost based on settings using backend pricing
const calculateVideoCost = computed(() => {
  if (!videoSettings.value.duration || videoSettings.value.duration <= 0) {
    return { perSecond: 0, total: 0, pricePerSecond: 0, totalPrice: 0 }
  }
  
  const { duration, modelType, resolution, generateAudio } = videoSettings.value
  const isFast = modelType === 'fast'
  const normalizedResolution = resolution.toLowerCase()
  
  let pricePerSecond = 0
  let creditsPerSecond = 0
  
  if (pricingConfig.value && pricingConfig.value.veoVideo) {
    if (isFast) {
      // Veo 3.1 Fast
      if (normalizedResolution === '4k') {
        const pricing = generateAudio 
          ? pricingConfig.value.veoVideo.fast.p4k?.withAudio 
          : pricingConfig.value.veoVideo.fast.p4k?.base
        if (pricing) {
          pricePerSecond = pricing.pricePerSecond || 0
          creditsPerSecond = pricing.creditsPerSecond || 0
        }
      } else {
        // 720p or 1080p
        const pricing = generateAudio 
          ? pricingConfig.value.veoVideo.fast.withAudio 
          : pricingConfig.value.veoVideo.fast.base
        if (pricing) {
          pricePerSecond = pricing.pricePerSecond || 0
          creditsPerSecond = pricing.creditsPerSecond || 0
        }
      }
    } else {
      // Veo 3.1 Normal
      const resolutionKey = normalizedResolution === '720p' ? 'p720' : normalizedResolution === '1080p' ? 'p1080' : 'p4k'
      const resolutionPricing = pricingConfig.value.veoVideo.normal[resolutionKey]
      if (resolutionPricing) {
        const pricing = generateAudio 
          ? resolutionPricing.withAudio 
          : resolutionPricing.base
        if (pricing) {
          pricePerSecond = pricing.pricePerSecond || 0
          creditsPerSecond = pricing.creditsPerSecond || 0
        }
      }
    }
  }
  
  // Fallback values if pricingConfig is not loaded or specific resolution is missing
  if (pricePerSecond === 0) {
    if (isFast) {
      if (normalizedResolution === '4k') {
        pricePerSecond = generateAudio ? 0.385 : 0.2695
        creditsPerSecond = generateAudio ? 39 : 27
      } else {
        pricePerSecond = generateAudio ? 0.165 : 0.1155
        creditsPerSecond = generateAudio ? 17 : 12
      }
    } else {
      if (normalizedResolution === '4k') {
        pricePerSecond = generateAudio ? 0.66 : 0.462
        creditsPerSecond = generateAudio ? 66 : 47
      } else if (normalizedResolution === '1080p') {
        pricePerSecond = generateAudio ? 0.44 : 0.308
        creditsPerSecond = generateAudio ? 44 : 31
      } else {
        // 720p
        pricePerSecond = generateAudio ? 0.44 : 0.308
        creditsPerSecond = generateAudio ? 44 : 31
      }
    }
  }
  
  const totalPrice = pricePerSecond * duration
  // Multiply credits by 10 (e.g., 68 -> 680)
  const totalCredits = Math.ceil(creditsPerSecond * duration * 10)
  const adjustedCreditsPerSecond = creditsPerSecond * 10
  
  return {
    perSecond: pricePerSecond,
    pricePerSecond: pricePerSecond,
    total: totalPrice,
    totalPrice: totalPrice,
    credits: totalCredits,
    creditsPerSecond: adjustedCreditsPerSecond,
    duration: duration,
  }
})

// Helper function to format aspect ratio for display
const formatAspectRatio = (aspectRatio) => {
  if (aspectRatio === '9:16') return 'Vertical'
  if (aspectRatio === '16:9') return 'Horizontal'
  return aspectRatio
}

// Computed
const canGenerate = computed(() => {
  // For custom role, API key and Project ID are required
  // For free, gold, and diamond, backend manages API keys automatically
  const hasApiKey = isCustomRole.value ? googleApiKey.value : true
  const hasProjectId = isCustomRole.value ? googleProjectId.value : true
  
  return selectedPresentation.value && 
         hasApiKey &&
         hasProjectId &&
         promptData.value.scene.trim().length > 0 &&
         videoTitle.value.trim().length > 0
})

// Sync aspect ratio from videoSettings to promptData
watch(() => videoSettings.value.aspectRatio, (newValue) => {
  promptData.value.camera.aspectRatio = newValue
})

// Load presentations from backend
const loadPresentations = async () => {
  try {
    const loaded = await backendStorage.fetchPresentations()
    
    // Process presentations and check if images are vertical
    const processed = await Promise.all(
      loaded.map(async (presentation) => {
        try {
          const generatedImage = presentation.generatedImageUrl || presentation.generatedImage
          
          // Check if image is vertical
          const isVertical = await new Promise((resolve) => {
            if (!generatedImage) {
              resolve(false)
              return
            }
            const img = new Image()
            img.onload = () => {
              resolve(img.height > img.width)
            }
            img.onerror = () => resolve(false)
            img.src = generatedImage
          })
          
          return {
            ...presentation,
            generatedImage,
            productImage: presentation.productImageUrl,
            isVertical,
          }
        } catch (e) {
          console.error(`Error processing presentation ${presentation.id}:`, e)
          return null
        }
      })
    )
    
    presentations.value = processed.filter(Boolean)
  } catch (error) {
    console.error('Error loading presentations:', error)
    // Fallback to localStorage if backend fails
    try {
      const presentationIds = storage.getAllPresentationIds()
      const loaded = await Promise.all(
        presentationIds.map(async (id) => {
          try {
            const data = storage.getPresentationData(id)
            if (data && data.presentationType) {
              const generatedImage = storage.getPresentationImage(id)
              const productImage = storage.getPresentationProduct(id)
              
              const isVertical = await new Promise((resolve) => {
                if (!generatedImage) {
                  resolve(false)
                  return
                }
                const img = new Image()
                img.onload = () => {
                  resolve(img.height > img.width)
                }
                img.onerror = () => resolve(false)
                img.src = generatedImage
              })
              
              return {
                ...data,
                id,
                generatedImage,
                productImage,
                isVertical,
              }
            }
          } catch (e) {
            console.error(`Error parsing presentation data for ${id}:`, e)
          }
          return null
        })
      )
      
      presentations.value = loaded.filter(Boolean)
    } catch (fallbackError) {
      console.error('Error loading presentations from localStorage:', fallbackError)
    }
  }
}

// Load videos from backend
const loadVideos = async () => {
  try {
    const loaded = await backendStorage.fetchVideos()
    
    videos.value = loaded.map(video => ({
      ...video,
      // Use GCS URL if available, otherwise fallback to base64
      generatedVideo: video.generatedVideoUrl || video.generatedVideo,
      generatedVideoUrl: video.generatedVideoUrl,
    }))
    // Reset to first page when loading new videos
    currentVideoPage.value = 1
  } catch (error) {
    console.error('Error loading videos:', error)
    // Fallback to localStorage if backend fails
    try {
      const videoIds = storage.getAllVideoIds()
      const loaded = videoIds.map(id => {
        try {
          const data = storage.getVideoData(id)
          if (data) {
            const generatedVideo = storage.getVideoFile(id)
            return {
              ...data,
              id,
              generatedVideo,
            }
          }
        } catch (e) {
          console.error(`Error parsing video data for ${id}:`, e)
        }
        return null
      }).filter(Boolean)
      
      videos.value = loaded
    } catch (fallbackError) {
      console.error('Error loading videos from localStorage:', fallbackError)
    }
  }
}

// Load on mount
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadPresentations(),
      loadVideos(),
      loadApiKeyFromStorage(),
      loadPricingConfig()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})

// Computed to check if user has custom role
const isCustomRole = computed(() => {
  return user.value?.role === 'custom'
})

// Load API key and Project ID based on user role
const loadApiKeyFromStorage = async () => {
  try {
    // Only load API key and Project ID for custom role users
    // Free, gold, diamond, and admin users use backend API keys automatically
    if (isCustomRole.value) {
      const savedKey = localStorage.getItem('google_api_key')
      if (savedKey) {
        googleApiKey.value = savedKey
      }
      const savedProjectId = localStorage.getItem('google_project_id')
      if (savedProjectId) {
        googleProjectId.value = savedProjectId
      }
    }
    // For free, gold, and diamond users, API key is managed by backend - no need to load
  } catch (error) {
    console.error('Error loading API credentials:', error)
  }
}

// Create new video presentation
const createNewVideoPresentation = () => {
  selectedPresentation.value = null
  videoPrompt.value = ''
  videoTitle.value = ''
  enableConsistencyContext.value = false
  consistencyContext.value = ''
  showSelectionCard.value = true // Show selection card when clicking "New Video Presentation"
  currentStep.value = 1 // Reset to step 1
  // Reset video settings to defaults (720p, no audio)
  videoSettings.value = {
    duration: 4,
    resolution: '720p',
    aspectRatio: '9:16',
    modelType: 'fast',
    generateAudio: false,
  }
  // Reset prompt data
  promptData.value = {
    scene: '',
    dialogue: [''],
    product: {
      brand: '',
      name: '',
    },
    style: '',
    camera: {
      shot: '',
      movement: '',
      aspectRatio: videoSettings.value.aspectRatio,
    },
    lighting: '',
    environment: '',
    audio: {
      voice: '',
      soundtrack: '',
    },
    config: {
      negativePrompt: '',
      seed: null,
    },
  }
  // Load pricing when modal opens
  loadPricingConfig()
}

// Select presentation
const selectPresentation = (presentation) => {
  selectedPresentation.value = presentation
  showSelectionCard.value = false // Hide selection card when presentation is selected
  currentStep.value = 2 // Go to step 2 (Video Prompt Configuration)
  
  // Pre-fill product information if available
  if (presentation.productName) {
    // Try to extract brand and name from productName
    const productNameParts = presentation.productName.split(' ')
    if (productNameParts.length > 1) {
      promptData.value.product.brand = productNameParts[0]
      promptData.value.product.name = productNameParts.slice(1).join(' ')
    } else {
      promptData.value.product.name = presentation.productName
    }
  }
  
  // Set aspect ratio based on presentation
  if (presentation.isVertical) {
    promptData.value.camera.aspectRatio = '9:16'
    videoSettings.value.aspectRatio = '9:16'
  } else {
    promptData.value.camera.aspectRatio = '16:9'
    videoSettings.value.aspectRatio = '16:9'
  }
}

// Close video creation modal
const closeVideoCreationModal = () => {
  selectedPresentation.value = null
  showSelectionCard.value = false
  videoTitle.value = ''
  currentStep.value = 1
  // Reset prompt data
  promptData.value = {
    scene: '',
    dialogue: [''],
    product: {
      brand: '',
      name: '',
    },
    style: '',
    camera: {
      shot: '',
      movement: '',
      aspectRatio: videoSettings.value.aspectRatio,
    },
    lighting: '',
    environment: '',
    audio: {
      voice: '',
      soundtrack: '',
    },
    config: {
      negativePrompt: '',
      seed: null,
    },
  }
}

// View full video
const viewFullVideo = (video) => {
  selectedVideo.value = video
  showVideoModal.value = true
}

// Close video modal
const closeVideoModal = () => {
  showVideoModal.value = false
  selectedVideo.value = null
}

// Download video
const downloadVideo = (video) => {
  if (!video.generatedVideo) {
    alert('No video available to download')
    return
  }

  try {
    const link = document.createElement('a')
    link.href = video.generatedVideo
    link.download = `${(video.title || video.prompt || 'video').replace(/\s+/g, '_')}_${video.resolution}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading video:', error)
    alert('Error downloading video. Please try again.')
  }
}

// Fill recommended values functions
const fillRecommendedTitle = () => {
  if (selectedPresentation.value?.productName) {
    videoTitle.value = `${selectedPresentation.value.productName} - Product Video`
  } else {
    videoTitle.value = 'Product Clip'
  }
}

const fillRecommendedScene = () => {
  const productName = selectedPresentation.value?.productName || 'the product'
  promptData.value.scene = `A young woman holds ${productName} up to camera and smiles naturally, showcasing the product in an authentic and engaging way.`
}

const fillRecommendedBrand = () => {
  if (selectedPresentation.value?.productName) {
    const parts = selectedPresentation.value.productName.split(' ')
    promptData.value.product.brand = parts[0] || 'GlowRadiance'
  } else {
    promptData.value.product.brand = 'GlowRadiance'
  }
}

const fillRecommendedProductName = () => {
  if (selectedPresentation.value?.productName) {
    const parts = selectedPresentation.value.productName.split(' ')
    if (parts.length > 1) {
      promptData.value.product.name = parts.slice(1).join(' ')
    } else {
      promptData.value.product.name = selectedPresentation.value.productName
    }
  } else {
    promptData.value.product.name = 'Radiant Glow Vitamin-C Serum'
  }
}

const fillRecommendedStyle = () => {
  promptData.value.style = 'UGC-style, casual, authentic influencer vibe'
}

const fillRecommendedLighting = () => {
  promptData.value.lighting = 'soft natural window light with warm tone'
}

const fillRecommendedEnvironment = () => {
  promptData.value.environment = 'same as original image'
}

const fillRecommendedVoice = () => {
  promptData.value.audio.voice = 'clear, friendly female voice, conversational tone'
}

const fillRecommendedSoundtrack = () => {
  promptData.value.audio.soundtrack = 'very subtle ambient upbeat tune under voice'
}

// Build structured prompt JSON and convert to formatted string
const buildPromptFromStructuredData = () => {
  const data = promptData.value
  
  // Filter out empty dialogue lines
  const dialogue = data.dialogue.filter(line => line.trim().length > 0)
  
  // Build the structured prompt object
  const promptStructure = {
    prompt: {
      scene: data.scene.trim(),
      ...(dialogue.length > 0 && { dialogue }),
      durationSeconds: videoSettings.value.duration,
      ...(data.product.brand || data.product.name ? {
        product: {
          ...(data.product.brand && { brand: data.product.brand.trim() }),
          ...(data.product.name && { name: data.product.name.trim() }),
        }
      } : {}),
      ...(data.style.trim() && { style: data.style.trim() }),
      camera: {
        ...(data.camera.shot && { shot: data.camera.shot }),
        ...(data.camera.movement && { movement: data.camera.movement }),
        aspectRatio: data.camera.aspectRatio || videoSettings.value.aspectRatio,
      },
      ...(data.lighting.trim() && { lighting: data.lighting.trim() }),
      ...(data.environment.trim() && { environment: data.environment.trim() }),
      ...(videoSettings.value.generateAudio && {
        audio: {
          ...(data.audio.voice.trim() && { voice: data.audio.voice.trim() }),
          ...(data.audio.soundtrack.trim() && { soundtrack: data.audio.soundtrack.trim() }),
        }
      }),
    },
    config: {
      model: videoSettings.value.modelType === 'fast' ? 'veo-3.1-fast.image_to_video' : 'veo-3.1.image_to_video',
      imageInput: 'reference_image_here',
      ...(data.config.negativePrompt.trim() && { negativePrompt: data.config.negativePrompt.trim() }),
      ...(data.config.seed && { seed: data.config.seed }),
    },
  }
  
  // Convert to formatted JSON string for the prompt
  return JSON.stringify(promptStructure, null, 2)
}

// Generate video
const generateVideo = async () => {
  if (!canGenerate.value) {
    const missingFields = []
    if (!selectedPresentation.value) missingFields.push('presentation')
    if (isCustomRole.value && !googleProjectId.value) missingFields.push('Project ID')
    if (isCustomRole.value && !googleApiKey.value) missingFields.push('API key')
    if (!promptData.value.scene.trim()) missingFields.push('scene description')
    if (!videoTitle.value.trim()) missingFields.push('video title')
    
    alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
    return
  }

  isGenerating.value = true
  
  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Product Clip'
  toastMessage.value = 'Please wait while we create your video with AI. This may take a few minutes...'
  toastProgress.value = 10

  try {
    // Build structured prompt from form data
    toastProgress.value = 20
    const prompt = buildPromptFromStructuredData()

    // Get presentation image
    const presentationImage = selectedPresentation.value.generatedImage
    if (!presentationImage) {
      throw new Error('Selected presentation has no image')
    }

    // Convert presentation image to base64
    // If it's a URL (GCS), download through backend to avoid CORS issues
    toastProgress.value = 30
    let imageBase64
    if (presentationImage.startsWith('http://') || presentationImage.startsWith('https://')) {
      // It's a URL, download through backend to avoid CORS
      try {
        const response = await fetch(`${API_URL}/api/download-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ url: presentationImage }),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to download presentation image: ${response.statusText}`)
        }
        
        const data = await response.json()
        imageBase64 = data.base64
      } catch (error) {
        console.error('Error downloading presentation image:', error)
        throw new Error(`Failed to download presentation image: ${error.message}`)
      }
    } else if (presentationImage.includes('data:')) {
      // It's already a data URL, extract base64 part
      imageBase64 = presentationImage.split(',')[1]
    } else {
      // Assume it's already base64 without prefix
      imageBase64 = presentationImage
    }

    // Call backend GraphQL API
    toastProgress.value = 50
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante: incluir cookies de autenticação
      body: JSON.stringify({
        query: `
          mutation CreateVideo($input: CreateVideoInput!) {
            createVideo(input: $input) {
              id
              userId
              presentationId
              title
              prompt
              structuredPrompt
              generatedVideo
              generatedVideoUrl
              duration
              resolution
              aspectRatio
              modelType
              generateAudio
              promptData
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: {
            presentationImage: imageBase64,
            prompt: prompt,
            title: videoTitle.value.trim(),
            consistencyContext: enableConsistencyContext.value ? (consistencyContext.value.trim() || '') : null,
            ...(isCustomRole.value && { 
              googleApiKey: googleApiKey.value,
              projectId: googleProjectId.value 
            }), // Only include if custom role
            duration: videoSettings.value.duration,
            resolution: videoSettings.value.resolution,
            aspectRatio: videoSettings.value.aspectRatio,
            modelType: videoSettings.value.modelType,
            generateAudio: videoSettings.value.generateAudio,
            presentationId: selectedPresentation.value.id,
            ...(selectedPresentation.value.mannequinId && { mannequinId: selectedPresentation.value.mannequinId }), // Pass mannequinId if available in presentation
          },
        },
      }),
    })

    if (response.errors) {
      console.error('[Video Creation] GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    console.log('[Video Creation] Response received from backend')
    toastProgress.value = 80
    const generatedData = response.data.createVideo
    console.log('[Video Creation] Generated data:', {
      id: generatedData.id,
      hasVideo: !!generatedData.generatedVideo,
      hasVideoUrl: !!generatedData.generatedVideoUrl,
      videoType: typeof generatedData.generatedVideo,
    })
    
    const videoId = generatedData.id

    // Video is already uploaded to GCS by backend - use GCS URL
    const video = {
      id: videoId,
      userId: generatedData.userId,
      presentationId: generatedData.presentationId,
      title: generatedData.title || videoTitle.value.trim(),
      prompt: generatedData.prompt,
      structuredPrompt: generatedData.structuredPrompt,
      generatedVideo: generatedData.generatedVideoUrl || generatedData.generatedVideo, // Use GCS URL if available
      generatedVideoUrl: generatedData.generatedVideoUrl,
      duration: generatedData.duration,
      resolution: generatedData.resolution,
      aspectRatio: generatedData.aspectRatio,
      modelType: generatedData.modelType,
      generateAudio: generatedData.generateAudio,
      promptData: generatedData.promptData,
      createdAt: generatedData.createdAt,
      updatedAt: generatedData.updatedAt,
    }
    
    // Add to list
    videos.value.unshift(video)
    // Reset to first page when new video is added
    currentVideoPage.value = 1
    
    // Reload from backend to ensure we have the latest data
    toastProgress.value = 90
    await loadVideos()

    // Save credentials to localStorage
    try {
      localStorage.setItem('google_api_key', googleApiKey.value)
      localStorage.setItem('google_project_id', googleProjectId.value)
    } catch (error) {
      console.error('Error saving credentials:', error)
    }

    const cost = calculateVideoCost.value.totalPrice
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Product Clip Created Successfully!'
    toastMessage.value = `Your video is ${video.duration} seconds long at ${video.resolution} resolution. Estimated cost: $${cost.toFixed(2)}.`
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
    
    // Reset form and return to videos list
    selectedPresentation.value = null
    videoPrompt.value = ''
    videoTitle.value = ''
    enableConsistencyContext.value = false
    consistencyContext.value = ''
    currentStep.value = 1 // Reset to step 1
    // Reset prompt data
    promptData.value = {
      scene: '',
      dialogue: [''],
      product: {
        brand: '',
        name: '',
      },
      style: '',
      camera: {
        shot: '',
        movement: '',
        aspectRatio: videoSettings.value.aspectRatio,
      },
      lighting: '',
      environment: '',
      audio: {
        voice: '',
        soundtrack: '',
      },
      config: {
        negativePrompt: '',
        seed: null,
      },
    }
  } catch (error) {
    console.error('Error creating video:', error)
    
    // Extract user-friendly error message
    let errorMessage = error.message || 'Unknown error occurred'
    
    // If error message contains GraphQL errors, extract the first one
    if (error.message && error.message.includes('Failed to generate video:')) {
      errorMessage = error.message.replace('Failed to generate video: ', '')
    }
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Creating Clip'
    toastMessage.value = errorMessage
    toastProgress.value = null
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } finally {
    isGenerating.value = false
  }
}

// Clear old videos to make space for new video
const clearOldVideosForNewVideo = async (newVideoId, requiredSpaceMB = 0, aggressive = false) => {
  try {
    // Get all videos sorted by creation date (oldest first)
    const allVideoIds = storage.getAllVideoIds()
    
    if (allVideoIds.length === 0) {
      return 0
    }
    
    // Get video sizes and dates
    const videosWithInfo = allVideoIds
      .filter(id => id !== newVideoId) // Don't delete the new video
      .map(id => {
        const data = storage.getVideoData(id)
        const videoFile = storage.getVideoFile(id)
        let sizeMB = 0
        
        // Calculate video size
        if (videoFile) {
          try {
            sizeMB = new Blob([videoFile]).size / (1024 * 1024)
          } catch (e) {
            // Estimate based on typical video size if can't calculate
            sizeMB = data?.duration ? data.duration * 0.5 : 2 // Rough estimate: 0.5MB per second
          }
        }
        
        return {
          id,
          createdAt: data?.createdAt ? new Date(data.createdAt).getTime() : parseInt(id) || 0,
          sizeMB,
        }
      })
      .sort((a, b) => a.createdAt - b.createdAt) // Oldest first
    
    if (videosWithInfo.length === 0) {
      return 0
    }
    
    // Calculate how much space we need
    const targetFreeSpaceMB = aggressive ? requiredSpaceMB * 2 : requiredSpaceMB * 1.5
    let freedSpaceMB = 0
    let deletedCount = 0
    const maxDeletions = aggressive ? Math.min(videosWithInfo.length, 20) : Math.min(videosWithInfo.length, 10)
    
    // Delete oldest videos until we have enough space
    for (let i = 0; i < maxDeletions; i++) {
      const video = videosWithInfo[i]
      try {
        // Delete this video
        storage.deleteVideo(video.id)
        videos.value = videos.value.filter(v => v.id !== video.id)
        deletedCount++
        freedSpaceMB += video.sizeMB
        
        // Check if we have enough space
        if (requiredSpaceMB > 0 && freedSpaceMB >= targetFreeSpaceMB) {
          console.log(`[Video Cleanup] Freed ${freedSpaceMB.toFixed(2)}MB (target: ${targetFreeSpaceMB.toFixed(2)}MB)`)
          break
        }
        
        // Also test if we have space now by trying to set a small item
        try {
          const testKey = `_test_space_${Date.now()}`
          localStorage.setItem(testKey, 'test')
          localStorage.removeItem(testKey)
          
          // If we have enough space and freed enough, break
          if (requiredSpaceMB === 0 || freedSpaceMB >= targetFreeSpaceMB) {
            console.log(`[Video Cleanup] Deleted ${deletedCount} video(s), space available now`)
            break
          }
        } catch (testError) {
          // Still no space, continue deleting
          console.log(`[Video Cleanup] Still no space after deleting ${deletedCount} video(s), continuing...`)
          continue
        }
      } catch (deleteError) {
        console.error('Error deleting video during cleanup:', deleteError)
        // Continue with next video
        continue
      }
    }
    
    console.log(`[Video Cleanup] Total deleted: ${deletedCount} video(s), freed: ${freedSpaceMB.toFixed(2)}MB`)
    return deletedCount
  } catch (error) {
    console.error('Error clearing old videos:', error)
    return 0
  }
}

// Delete video
const deleteVideo = async (id) => {
  if (confirm('Are you sure you want to delete this video?')) {
    try {
      await backendStorage.deleteVideo(id)
      videos.value = videos.value.filter(v => v.id !== id)
      // Adjust page if current page becomes empty
      if (currentVideoPage.value > totalVideoPages.value && totalVideoPages.value > 0) {
        currentVideoPage.value = totalVideoPages.value
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Error deleting video: ' + error.message)
      // Fallback to localStorage if backend fails
      try {
        storage.deleteVideo(id)
        videos.value = videos.value.filter(v => v.id !== id)
      } catch (fallbackError) {
        console.error('Error deleting video from localStorage:', fallbackError)
      }
    }
  }
}
</script>
