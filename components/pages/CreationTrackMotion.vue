<template>
  <div class="w-full pb-8 relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.15),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      <div class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-200 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl opacity-15"></div>
    </div>

    <!-- Header -->
    <div class="mb-3 sm:mb-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div class="backdrop-blur-sm bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'film']" class="text-emerald-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Control Motion</span>
              <span class="text-xs font-normal text-emerald-700 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {{ controlMotionVideos.length }} {{ controlMotionVideos.length === 1 ? 'video' : 'videos' }}
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-emerald-500 text-xs flex-shrink-0" />
              <span class="truncate">Copy motion from one video to another using KieAI</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            v-if="!selectedMannequin"
            @click="createNewTrackMotion"
            class="w-full sm:w-auto backdrop-blur-sm bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-emerald-500/40 hover:to-emerald-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span class="hidden sm:inline">New Control Motion</span>
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
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-emerald-500 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-800 font-medium text-sm sm:text-base">Loading...</p>
        </div>
      </div>

      <!-- Control Motion Creation Modal -->
      <div
        v-if="showCreationModal || selectedMannequin"
        class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto transition-opacity duration-300"
        @click.self="closeCreationModal"
      >
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative my-4 sm:my-8 transform transition-all duration-300">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          </div>
          
          <!-- Close Button -->
          <button
            @click="closeCreationModal"
            class="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 z-10"
            title="Close"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
          </button>

          <!-- Creation Interface -->
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
                        ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-700'
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
                      Select Image Source
                    </p>
                    <p class="text-[10px] sm:text-xs text-gray-700">Choose mannequin or product thumb and motion control video</p>
                  </div>
                </div>
                
                <!-- Connector -->
                <div
                  :class="[
                    'hidden md:block h-0.5 flex-1 mx-2 sm:mx-4 rounded-full backdrop-blur-sm',
                    currentStep >= 2 ? 'bg-emerald-500/40 border border-emerald-400/30' : 'bg-slate-200/40 border border-slate-300/30'
                  ]"
                ></div>
                
                <!-- Step 2 -->
                <div class="flex items-center space-x-2 sm:space-x-3 flex-1 w-full md:w-auto">
                  <div
                    :class="[
                      'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all backdrop-blur-sm border-2 shadow-lg text-sm sm:text-base',
                      currentStep >= 2
                        ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-700'
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
                      Video Settings
                    </p>
                    <p class="text-[10px] sm:text-xs text-gray-700">Configure video parameters</p>
                  </div>
                </div>
                
                <!-- Connector -->
                <div
                  :class="[
                    'hidden md:block h-0.5 flex-1 mx-2 sm:mx-4 rounded-full backdrop-blur-sm',
                    currentStep >= 3 ? 'bg-emerald-500/40 border border-emerald-400/30' : 'bg-slate-200/40 border border-slate-300/30'
                  ]"
                ></div>
                
                <!-- Step 3 -->
                <div class="flex items-center space-x-2 sm:space-x-3 flex-1 w-full md:w-auto">
                  <div
                    :class="[
                      'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all backdrop-blur-sm border-2 shadow-lg text-sm sm:text-base',
                      currentStep >= 3
                        ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-700'
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
                      API Configuration
                    </p>
                    <p class="text-[10px] sm:text-xs text-gray-700">Configure KieAI API</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 1: Select Mannequin or Product Thumb -->
            <div v-if="currentStep === 1" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-emerald-500 text-lg sm:text-xl" />
                  <span>Step 1: Select Image Source</span>
                </h2>
                <button
                  @click="closeCreationModal"
                  class="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
              
              <p class="text-gray-700 text-xs sm:text-sm mb-4 sm:mb-6 font-medium">Select a mannequin image or product thumb and the motion control video to copy</p>
              
              <!-- Source Type Selection -->
              <div class="mb-4 sm:mb-6">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Image Source Type
                </label>
                <div class="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    @click="imageSourceType = 'mannequin'"
                    :class="[
                      'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium backdrop-blur-sm text-xs sm:text-sm',
                      imageSourceType === 'mannequin'
                        ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-700'
                        : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
                    Mannequin
                  </button>
                  <button
                    @click="imageSourceType = 'presentation'"
                    :class="[
                      'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium backdrop-blur-sm text-xs sm:text-sm',
                      imageSourceType === 'presentation'
                        ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-700'
                        : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'tshirt']" class="mr-2" />
                    Product Thumb
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Mannequin Selection -->
                <div v-if="imageSourceType === 'mannequin'">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Mannequin Image <span class="text-red-500">*</span>
                  </label>
                  
                  <!-- Custom Role: Upload Image Option -->
                  <div v-if="isCustomRole" class="mb-3 sm:mb-4">
                    <label class="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      :class="{ 'border-emerald-500 bg-emerald-50': customMannequinImageFile }">
                      <div v-if="!customMannequinImageFile" class="flex flex-col items-center justify-center p-4 sm:p-6">
                        <font-awesome-icon :icon="['fas', 'upload']" class="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
                        <p class="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                          <span class="font-semibold">Upload Mannequin Image</span>
                        </p>
                        <p class="text-[10px] sm:text-xs text-gray-500">JPG, PNG (MAX. 10MB)</p>
                      </div>
                      <div v-else class="relative w-full h-full">
                        <img :src="customMannequinImagePreview" class="w-full h-full object-cover rounded-lg sm:rounded-xl" alt="Custom Mannequin" />
                        <button
                          @click.stop="removeCustomMannequinImage"
                          class="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                        </button>
                      </div>
                      <input
                        ref="customMannequinImageInput"
                        type="file"
                        class="hidden"
                        accept="image/jpeg,image/jpg,image/png"
                        @change="handleCustomMannequinImageUpload"
                      />
                    </label>
                    <p class="text-[10px] sm:text-xs text-gray-600 mt-2 text-center">Or select from your mannequins below</p>
                  </div>
                  
                  <!-- Mannequins Grid -->
                  <div v-if="availableMannequins.length > 0 && (!isCustomRole || !customMannequinImageFile)" class="grid grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto">
                    <div
                      v-for="mannequin in availableMannequins"
                      :key="mannequin.id"
                      @click="selectMannequin(mannequin)"
                      class="group relative bg-white border-2 overflow-hidden cursor-pointer transition-all duration-300 rounded-lg"
                      :class="selectedMannequin?.id === mannequin.id ? 'border-emerald-500' : 'border-gray-200 hover:border-emerald-300'"
                    >
                      <img
                        v-if="mannequin.fullBodyImage"
                        :src="mannequin.fullBodyImage"
                        class="w-full h-20 sm:h-24 object-cover"
                        alt="Mannequin"
                      />
                      <div v-else class="w-full h-20 sm:h-24 flex items-center justify-center text-3xl sm:text-4xl opacity-30">👤</div>
                      <div
                        v-if="selectedMannequin?.id === mannequin.id"
                        class="absolute top-1 right-1 bg-emerald-500 text-white p-1 rounded-full"
                      >
                        <font-awesome-icon :icon="['fas', 'check']" class="text-[10px] sm:text-xs" />
                      </div>
                      <div class="p-1.5 sm:p-2">
                        <p class="text-[10px] sm:text-xs font-medium text-gray-900 line-clamp-1">{{ mannequin.name || 'Untitled' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="!isCustomRole || (!customMannequinImageFile && availableMannequins.length === 0)" class="text-center py-6 sm:py-8 text-gray-500">
                    <p class="text-xs sm:text-sm px-2">No mannequins available. Please create a mannequin first.</p>
                  </div>

                  <!-- Selected Mannequin Preview -->
                  <div v-if="selectedMannequin && !customMannequinImageFile" class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <img
                        v-if="selectedMannequin.fullBodyImage"
                        :src="selectedMannequin.fullBodyImage"
                        class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                        alt="Selected Mannequin"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ selectedMannequin.name || 'Selected Mannequin' }}</p>
                        <p class="text-[10px] sm:text-xs text-gray-600">{{ selectedMannequin.type || 'N/A' }}</p>
                      </div>
                      <button
                        @click="selectedMannequin = null"
                        class="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Custom Image Preview -->
                  <div v-if="customMannequinImageFile" class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <img
                        :src="customMannequinImagePreview"
                        class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                        alt="Custom Mannequin Image"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-gray-900">Custom Uploaded Image</p>
                        <p class="text-[10px] sm:text-xs text-gray-600">Ready to use</p>
                      </div>
                      <button
                        @click="removeCustomMannequinImage"
                        class="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Product Thumb Selection -->
                <div v-if="imageSourceType === 'presentation'">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Product Thumb <span class="text-red-500">*</span>
                  </label>
                  
                  <!-- Custom Role: Upload Image Option -->
                  <div v-if="isCustomRole" class="mb-3 sm:mb-4">
                    <label class="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      :class="{ 'border-emerald-500 bg-emerald-50': customMannequinImageFile }">
                      <div v-if="!customMannequinImageFile" class="flex flex-col items-center justify-center p-4 sm:p-6">
                        <font-awesome-icon :icon="['fas', 'upload']" class="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
                        <p class="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                          <span class="font-semibold">Upload Product Thumb Image</span>
                        </p>
                        <p class="text-[10px] sm:text-xs text-gray-500">JPG, PNG (MAX. 10MB)</p>
                      </div>
                      <div v-else class="relative w-full h-full">
                        <img :src="customMannequinImagePreview" class="w-full h-full object-cover rounded-lg sm:rounded-xl" alt="Custom Product Thumb" />
                        <button
                          @click.stop="removeCustomMannequinImage"
                          class="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                        </button>
                      </div>
                      <input
                        ref="customMannequinImageInput"
                        type="file"
                        class="hidden"
                        accept="image/jpeg,image/jpg,image/png"
                        @change="handleCustomMannequinImageUpload"
                      />
                    </label>
                    <p class="text-[10px] sm:text-xs text-gray-600 mt-2 text-center">Or select from your product thumbs below</p>
                  </div>
                  
                  <!-- Presentations Grid -->
                  <div v-if="availablePresentations.length > 0 && (!isCustomRole || !customMannequinImageFile)" class="grid grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto">
                    <div
                      v-for="presentation in availablePresentations"
                      :key="presentation.id"
                      @click="selectPresentation(presentation)"
                      class="group relative bg-white border-2 overflow-hidden cursor-pointer transition-all duration-300 rounded-lg"
                      :class="selectedPresentation?.id === presentation.id ? 'border-emerald-500' : 'border-gray-200 hover:border-emerald-300'"
                    >
                      <img
                        v-if="presentation.generatedImage"
                        :src="presentation.generatedImage"
                        class="w-full h-20 sm:h-24 object-cover"
                        alt="Product Thumb"
                      />
                      <div v-else class="w-full h-20 sm:h-24 flex items-center justify-center text-3xl sm:text-4xl opacity-30">🖼️</div>
                      <div
                        v-if="selectedPresentation?.id === presentation.id"
                        class="absolute top-1 right-1 bg-emerald-500 text-white p-1 rounded-full"
                      >
                        <font-awesome-icon :icon="['fas', 'check']" class="text-[10px] sm:text-xs" />
                      </div>
                      <div class="p-1.5 sm:p-2">
                        <p class="text-[10px] sm:text-xs font-medium text-gray-900 line-clamp-1">{{ presentation.productName || 'Untitled' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="!isCustomRole || (!customMannequinImageFile && availablePresentations.length === 0)" class="text-center py-6 sm:py-8 text-gray-500">
                    <p class="text-xs sm:text-sm px-2">No product thumbs available. Please create a product thumb first.</p>
                  </div>

                  <!-- Selected Presentation Preview -->
                  <div v-if="selectedPresentation && !customMannequinImageFile" class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <img
                        v-if="selectedPresentation.generatedImage"
                        :src="selectedPresentation.generatedImage"
                        class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                        alt="Selected Product Thumb"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ selectedPresentation.productName || 'Selected Product Thumb' }}</p>
                        <p class="text-[10px] sm:text-xs text-gray-600">{{ selectedPresentation.presentationType || 'N/A' }}</p>
                      </div>
                      <button
                        @click="selectedPresentation = null"
                        class="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Custom Image Preview -->
                  <div v-if="customMannequinImageFile && imageSourceType === 'presentation'" class="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <img
                        :src="customMannequinImagePreview"
                        class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                        alt="Custom Product Thumb Image"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs sm:text-sm font-medium text-gray-900">Custom Uploaded Image</p>
                        <p class="text-[10px] sm:text-xs text-gray-600">Ready to use</p>
                      </div>
                      <button
                        @click="removeCustomMannequinImage"
                        class="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Motion Control Video -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Motion Control Video <span class="text-red-500">*</span>
                  </label>
                  <p class="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">The motion from this video will be copied to the product video</p>
                  
                  <!-- Upload Motion Control Video -->
                  <div class="mb-3 sm:mb-4">
                    <label class="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      :class="{ 'border-emerald-500 bg-emerald-50': motionVideoFile }">
                      <div v-if="!motionVideoFile" class="flex flex-col items-center justify-center p-4 sm:p-6">
                        <font-awesome-icon :icon="['fas', 'upload']" class="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
                        <p class="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                          <span class="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-[10px] sm:text-xs text-gray-500">MP4, MOV, AVI (MAX. 100MB)</p>
                      </div>
                      <div v-else class="relative w-full h-full">
                        <video :src="motionVideoPreview" class="w-full h-full object-cover rounded-lg sm:rounded-xl" controls></video>
                        <button
                          @click.stop="removeMotionVideo"
                          class="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <font-awesome-icon :icon="['fas', 'times']" class="text-xs sm:text-sm" />
                        </button>
                      </div>
                      <input
                        ref="motionVideoInput"
                        type="file"
                        class="hidden"
                        accept="video/mp4,video/mov,video/avi"
                        @change="handleMotionVideoUpload"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  @click="currentStep = 2"
                  :disabled="!canProceedToStep2 || !motionVideoFile"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span class="hidden sm:inline">Next: Video Settings</span>
                  <span class="sm:hidden">Next</span>
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </button>
              </div>
            </div>

            <!-- Step 2: Video Settings -->
            <div v-if="currentStep === 2 && canProceedToStep2 && motionVideoFile" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <font-awesome-icon :icon="['fas', 'cog']" class="text-emerald-500 text-lg sm:text-xl" />
                  <span class="hidden sm:inline">Step 2: Video Settings</span>
                  <span class="sm:hidden">Step 2: Settings</span>
                </h2>
              </div>
              
              <!-- Selected Image and Video Preview -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    {{ imageSourceType === 'mannequin' ? 'Mannequin Image' : 'Product Thumb' }}
                  </h3>
                  <img
                    v-if="customMannequinImagePreview"
                    :src="customMannequinImagePreview"
                    class="w-full h-24 sm:h-32 object-cover rounded"
                    :alt="imageSourceType === 'mannequin' ? 'Custom Mannequin' : 'Custom Product Thumb'"
                  />
                  <img
                    v-else-if="imageSourceType === 'mannequin' && selectedMannequin?.fullBodyImage"
                    :src="selectedMannequin.fullBodyImage"
                    class="w-full h-24 sm:h-32 object-cover rounded"
                    alt="Mannequin"
                  />
                  <img
                    v-else-if="imageSourceType === 'presentation' && selectedPresentation?.generatedImage"
                    :src="selectedPresentation.generatedImage"
                    class="w-full h-24 sm:h-32 object-cover rounded"
                    alt="Product Thumb"
                  />
                  <p class="text-[10px] sm:text-xs text-gray-600 mt-2 truncate">
                    <span v-if="customMannequinImageFile">Custom Uploaded Image</span>
                    <span v-else-if="imageSourceType === 'mannequin'">{{ selectedMannequin?.name || 'Selected Mannequin' }}</span>
                    <span v-else-if="imageSourceType === 'presentation'">{{ selectedPresentation?.productName || 'Selected Product Thumb' }}</span>
                  </p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Motion Control Video</h3>
                  <video
                    v-if="motionVideoPreview"
                    :src="motionVideoPreview"
                    class="w-full h-24 sm:h-32 object-cover rounded"
                    muted
                    preload="metadata"
                  ></video>
                  <p class="text-[10px] sm:text-xs text-gray-600 mt-2">Motion will be copied from this video</p>
                  <p v-if="motionVideoDuration > 0" class="text-[10px] sm:text-xs font-medium mt-1" :class="motionVideoDuration > 30 ? 'text-red-600' : 'text-gray-700'">
                    Duration: {{ motionVideoDuration }}s
                    <span v-if="motionVideoDuration > 30" class="block text-red-600 font-semibold mt-1">
                      ⚠️ Máximo de 30 segundos permitido
                    </span>
                  </p>
                </div>
              </div>
              
              <!-- Warning if video exceeds 30 seconds -->
              <div v-if="motionVideoDuration > 30" class="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div class="flex items-start space-x-2 sm:space-x-3">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-red-600 text-lg sm:text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="text-xs sm:text-sm text-red-800 font-semibold mb-1">
                      Vídeo muito longo
                    </p>
                    <p class="text-[10px] sm:text-xs text-red-700">
                      O vídeo de motion control deve ter no máximo 30 segundos. O vídeo selecionado tem {{ motionVideoDuration }} segundos. Por favor, selecione um vídeo mais curto.
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4 sm:space-y-6">
                <!-- Video Title -->
                <div class="mb-3 sm:mb-4">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Video Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="videoTitle"
                    :disabled="isGenerating"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50 text-gray-900 placeholder-gray-500 font-medium text-sm sm:text-base"
                    placeholder="Enter a title for this video (e.g., 'Summer Collection Control Motion')"
                  />
                  <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">This title will appear in your Dashboard activities</p>
                </div>

                <!-- Resolution -->
                <div class="mb-3 sm:mb-4">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Resolution</label>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      v-for="res in ['720p', '1080p']"
                      :key="res"
                      @click="videoSettings.resolution = res"
                      :class="[
                        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all font-medium backdrop-blur-sm text-xs sm:text-sm',
                        videoSettings.resolution === res
                          ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-700'
                          : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30 text-gray-800'
                      ]"
                    >
                      {{ res }}
                    </button>
                  </div>
                </div>

                <!-- Cost Information -->
                <div v-if="motionVideoDuration > 0" class="mb-3 sm:mb-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs sm:text-sm font-medium text-blue-800">Estimated Cost</span>
                    <span class="text-base sm:text-lg font-bold text-blue-900">{{ calculateVideoCost.credits }} credits</span>
                  </div>
                  <div class="text-[10px] sm:text-xs text-blue-700 space-y-1">
                    <p>Duration: {{ motionVideoDuration }}s</p>
                    <p>Resolution: {{ videoSettings.resolution }}</p>
                    <p>Rate: {{ calculateVideoCost.perSecond }} credits/second (${{ calculateVideoCost.pricePerSecond.toFixed(3) }}/s)</p>
                    <p class="font-medium mt-2">Total: {{ calculateVideoCost.credits }} credits (${{ calculateVideoCost.totalPrice.toFixed(2) }})</p>
                  </div>
                </div>
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
                  :disabled="isGenerating || !videoTitle.trim()"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span class="hidden sm:inline">Next: API Configuration</span>
                  <span class="sm:hidden">Next</span>
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </button>
              </div>
            </div>

            <!-- Step 3: API Configuration -->
            <div v-if="currentStep === 3" class="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6">
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <font-awesome-icon :icon="['fas', 'key']" class="text-emerald-500 text-lg sm:text-xl" />
                  <span class="hidden sm:inline">Step 3: KieAI API Configuration</span>
                  <span class="sm:hidden">Step 3: API</span>
                </h2>
              </div>
              
              <div class="space-y-4 sm:space-y-6">
                <!-- KieAI API Key -->
                <div v-if="isCustomRole" class="mb-3 sm:mb-4">
                  <label class="block text-xs sm:text-sm font-medium text-gray-800 mb-2">
                    KieAI API Key <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="kieApiKey"
                    type="password"
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    placeholder="Enter your KieAI API key"
                  />
                  <p class="text-[10px] sm:text-xs text-gray-700 mt-1 font-medium">Your KieAI API key will be used to generate the control motion video</p>
                  <p class="text-[10px] sm:text-xs text-emerald-600 mt-1 font-medium flex items-center space-x-1">
                    <font-awesome-icon :icon="['fas', 'info-circle']" />
                    <span>Enter your KieAI API key for this generation</span>
                  </p>
                </div>
                <!-- Info for free users -->
                <div v-else class="space-y-3">
                  <div class="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div class="flex items-start space-x-2 sm:space-x-3">
                      <font-awesome-icon :icon="['fas', 'info-circle']" class="text-blue-600 text-lg sm:text-xl mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="text-xs sm:text-sm text-blue-800 font-medium">
                          KieAI API key is automatically managed by the system for your plan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div class="flex items-start space-x-2 sm:space-x-3">
                      <font-awesome-icon :icon="['fas', 'image']" class="text-amber-600 text-lg sm:text-xl mt-0.5 flex-shrink-0" />
                      <div>
                        <p class="text-xs sm:text-sm text-amber-800 font-medium">
                          Free plans: the video will be saved with the ADVITRINI logo in the center left corner and made available in your storage..
                        </p>
                      </div>
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
                      @click="generateTrackMotion"
                      :disabled="isGenerating || !canGenerate"
                      class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <font-awesome-icon v-if="!isGenerating" :icon="['fas', 'film']" />
                      <span v-if="isGenerating" class="animate-spin">⏳</span>
                      <span class="text-xs sm:text-base">{{ isGenerating ? 'Generating Video...' : 'Generate Control Motion' }}</span>
                    </button>
                    <div class="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg space-y-1 w-full sm:w-auto">
                      <p class="text-[10px] sm:text-xs text-gray-800 text-center font-medium">
                        <span class="font-semibold">Resolution:</span> {{ videoSettings.resolution }}
                      </p>
                      <p v-if="motionVideoDuration > 0" class="text-[10px] sm:text-xs text-blue-700 text-center font-semibold">
                        <span class="font-semibold">Cost:</span> {{ calculateVideoCost.credits }} credits
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
      <div v-if="controlMotionVideos.length > 0 && !selectedMannequin && !showCreationModal" class="space-y-6 sm:space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          <div
            v-for="video in paginatedVideos"
            :key="video.id"
            class="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-xl hover:border-emerald-200/60 shadow-sm"
          >
            <!-- Video Thumbnail (16:9) -->
            <div class="relative aspect-video overflow-hidden bg-gray-100">
              <video
                v-if="video.generatedVideo"
                :src="video.generatedVideo"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                muted
                preload="metadata"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-6xl sm:text-7xl opacity-40">
                <font-awesome-icon :icon="['fas', 'film']" class="text-gray-400" />
              </div>
              <!-- Badge -->
              <span class="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-500/90 text-white shadow-md">
                Control Motion
              </span>
              <!-- Play icon on hover -->
              <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-emerald-600">
                  <font-awesome-icon :icon="['fas', 'play']" class="text-lg ml-0.5" />
                </span>
              </div>
              <!-- Overlay actions (hover) -->
              <div class="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="flex items-center justify-end gap-1.5 sm:gap-2">
                  <button
                    @click.stop="viewFullVideo(video)"
                    class="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg transition-colors shadow-sm"
                    title="View Details"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" class="text-sm" />
                  </button>
                  <button
                    @click.stop="downloadVideo(video)"
                    class="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg transition-colors shadow-sm"
                    title="Download"
                  >
                    <font-awesome-icon :icon="['fas', 'download']" class="text-sm" />
                  </button>
                  <button
                    @click.stop="deleteVideo(video.id)"
                    class="p-2 sm:p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                    title="Delete"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" class="text-sm" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Info bar (always visible) -->
            <div class="p-3 sm:p-4 border-t border-gray-100">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1.5">{{ video.title || 'Untitled Video' }}</h3>
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <font-awesome-icon :icon="['fas', 'video']" class="text-[10px]" />
                  {{ video.resolution || '—' }}
                </span>
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
                ? 'bg-emerald-500/30 border-2 border-emerald-400/40 text-emerald-700 shadow-lg' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-400/40'"
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
          Showing {{ (currentVideoPage - 1) * videosPerPage + 1 }} - {{ Math.min(currentVideoPage * videosPerPage, controlMotionVideos.length) }} of {{ controlMotionVideos.length }} videos
        </div>
      </div>

      <!-- Empty State Message -->
      <div v-if="controlMotionVideos.length === 0 && !selectedMannequin && !showCreationModal" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-12 text-center">
        <div class="backdrop-blur-sm bg-slate-200/40 border border-slate-300/40 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <font-awesome-icon :icon="['fas', 'film']" class="text-slate-500 text-3xl sm:text-5xl" />
        </div>
        <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-2">No Control Motion Video created</h3>
        <p class="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-medium px-4">Start by creating your first control motion video. It's quick and easy!</p>
        <button
          @click="createNewTrackMotion"
          class="backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 mx-auto text-sm sm:text-base"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Create First Control Motion Video</span>
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
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 backdrop-blur-sm bg-white/40 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-t-xl sm:rounded-t-2xl z-10 relative">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent truncate">{{ selectedVideo.title || 'Untitled Video' }}</h3>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
              {{ selectedVideo.resolution }}
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
            <h4 class="text-lg font-semibold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-4">Video</h4>
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
                <font-awesome-icon :icon="['fas', 'film']" class="text-6xl" />
              </div>
            </div>
          </div>

          <!-- Video Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <p class="text-xs text-gray-700 mb-2 uppercase tracking-wide font-medium">Resolution</p>
              <p class="text-sm font-semibold text-gray-900">{{ selectedVideo.resolution }}</p>
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
const controlMotionVideos = ref([])
const isGenerating = ref(false)
const kieApiKey = ref('')
const showCreationModal = ref(false)
const isLoading = ref(true)
const showVideoModal = ref(false)
const selectedVideo = ref(null)
const currentStep = ref(1)
const videoTitle = ref('')

// Pagination state for control motion videos
const currentVideoPage = ref(1)
const videosPerPage = 6 // 6 videos per page (2 rows × 3 videos)

// Computed for paginated videos
const paginatedVideos = computed(() => {
  const start = (currentVideoPage.value - 1) * videosPerPage
  const end = start + videosPerPage
  return controlMotionVideos.value.slice(start, end)
})

const totalVideoPages = computed(() => {
  return Math.ceil(controlMotionVideos.value.length / videosPerPage)
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

// Mannequin and video selection state
const selectedMannequin = ref(null)
const availableMannequins = ref([])
const selectedPresentation = ref(null)
const availablePresentations = ref([])
const imageSourceType = ref('mannequin') // 'mannequin' or 'presentation'
const motionVideoFile = ref(null)
const motionVideoPreview = ref(null)
const motionVideoInput = ref(null)
const motionVideoDuration = ref(0) // Duration in seconds
// Custom image upload (for custom role)
const customMannequinImageFile = ref(null)
const customMannequinImagePreview = ref(null)
const customMannequinImageInput = ref(null)

// Toast state
const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Video settings
const videoSettings = ref({
  resolution: '1080p', // '720p', '1080p'
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
              controlMotion {
                p720 {
                  pricePerSecond
                  creditsPerSecond
                }
                p1080 {
                  pricePerSecond
                  creditsPerSecond
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

// Computed
const canGenerate = computed(() => {
  let hasImage = false
  if (imageSourceType.value === 'mannequin') {
    hasImage = isCustomRole.value 
      ? (customMannequinImageFile.value || selectedMannequin.value)
      : selectedMannequin.value
  } else {
    // presentation
    hasImage = isCustomRole.value 
      ? (customMannequinImageFile.value || selectedPresentation.value)
      : selectedPresentation.value
  }
  
  // Para contas custom, kieApiKey é obrigatório
  // Para free/gold/diamond/admin, não precisa (vem do servidor)
  const hasApiKey = isCustomRole.value ? kieApiKey.value : true
  
  // Video duration must be 30 seconds or less
  const isValidDuration = motionVideoDuration.value > 0 && motionVideoDuration.value <= 30
  
  return hasImage && 
         motionVideoFile.value &&
         hasApiKey && 
         videoTitle.value.trim().length > 0 &&
         isValidDuration
})

// Computed to check if user has custom role
const isCustomRole = computed(() => {
  return user.value?.role === 'custom'
})

// Computed to check if can proceed to step 2
const canProceedToStep2 = computed(() => {
  if (imageSourceType.value === 'mannequin') {
    if (isCustomRole.value) {
      return customMannequinImageFile.value || selectedMannequin.value
    }
    return selectedMannequin.value
  } else {
    // presentation
    if (isCustomRole.value) {
      return customMannequinImageFile.value || selectedPresentation.value
    }
    return selectedPresentation.value
  }
})

// Calculate video cost based on resolution and duration using backend pricing
const calculateVideoCost = computed(() => {
  if (!motionVideoDuration.value || motionVideoDuration.value <= 0) {
    return { perSecond: 0, total: 0, credits: 0, pricePerSecond: 0 }
  }
  
  const resolution = videoSettings.value.resolution || '1080p'
  let creditsPerSecond = 0
  let pricePerSecond = 0
  
  // Use pricing from backend if available, otherwise fallback to default values
  if (pricingConfig.value && pricingConfig.value.controlMotion) {
    if (resolution === '1080p' && pricingConfig.value.controlMotion.p1080) {
      creditsPerSecond = pricingConfig.value.controlMotion.p1080.creditsPerSecond
      pricePerSecond = pricingConfig.value.controlMotion.p1080.pricePerSecond
    } else if (resolution === '720p' && pricingConfig.value.controlMotion.p720) {
      creditsPerSecond = pricingConfig.value.controlMotion.p720.creditsPerSecond
      pricePerSecond = pricingConfig.value.controlMotion.p720.pricePerSecond
    }
  }
  
  // Fallback to default values if pricing not loaded yet
  if (creditsPerSecond === 0) {
    if (resolution === '1080p') {
      creditsPerSecond = 60
      pricePerSecond = 0.06
    } else if (resolution === '720p') {
      creditsPerSecond = 45
      pricePerSecond = 0.045
    }
  }
  
  const totalCredits = Math.ceil(creditsPerSecond * motionVideoDuration.value)
  const totalPrice = pricePerSecond * motionVideoDuration.value
  
  return {
    perSecond: creditsPerSecond,
    pricePerSecond: pricePerSecond,
    total: totalCredits,
    credits: totalCredits,
    totalPrice: totalPrice,
    duration: motionVideoDuration.value,
  }
})

// Load mannequins from backend
const loadMannequins = async () => {
  try {
    const loaded = await backendStorage.fetchMannequins()
    
    availableMannequins.value = loaded.map(mannequin => ({
      ...mannequin,
      // Use GCS URL if available, otherwise fallback to generatedImage (base64)
      fullBodyImage: mannequin.fullBodyImageUrl || mannequin.generatedImage,
      faceThumbnail: mannequin.faceThumbnailUrl,
    }))
  } catch (error) {
    console.error('Error loading mannequins:', error)
    // Fallback to localStorage if backend fails
    try {
      const ids = storage.getAllMannequinIds()
      const loaded = ids.map(id => {
        const data = storage.getMannequinData(id)
        if (data) {
          return {
            ...data,
            fullBodyImage: storage.getMannequinFullBody(id),
            faceThumbnail: storage.getMannequinFaceThumb(id),
          }
        }
        return null
      }).filter(Boolean)
      
      availableMannequins.value = loaded
    } catch (fallbackError) {
      console.error('Error loading mannequins from localStorage:', fallbackError)
    }
  }
}

// Load presentations from backend
const loadPresentations = async () => {
  try {
    const loaded = await backendStorage.fetchPresentations()
    
    availablePresentations.value = loaded.map(presentation => ({
      ...presentation,
      // Use GCS URL if available, otherwise fallback to generatedImage (base64)
      generatedImage: presentation.generatedImageUrl || presentation.generatedImage,
    }))
  } catch (error) {
    console.error('Error loading presentations:', error)
  }
}

// Load control motion videos from backend
const loadControlMotionVideos = async () => {
  try {
    const loaded = await backendStorage.fetchControlMotionVideos()
    
    controlMotionVideos.value = loaded.map(video => ({
      ...video,
      // Use GCS URL if available, otherwise fallback to base64
      generatedVideo: video.generatedVideoUrl || video.generatedVideo,
      generatedVideoUrl: video.generatedVideoUrl,
    }))
    // Reset to first page when loading new videos
    currentVideoPage.value = 1
  } catch (error) {
    console.error('Error loading control motion videos:', error)
    // Don't set to empty array on error, keep existing videos
  }
}

// Watch imageSourceType to clear selections when switching
watch(imageSourceType, (newType) => {
  if (newType === 'mannequin') {
    selectedPresentation.value = null
  } else {
    selectedMannequin.value = null
  }
  // Also clear custom image
  customMannequinImageFile.value = null
  customMannequinImagePreview.value = null
  if (customMannequinImageInput.value) {
    customMannequinImageInput.value.value = ''
  }
})

// Load on mount
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadMannequins(),
      loadPresentations(),
      loadControlMotionVideos(),
      loadApiKeyFromStorage(),
      loadPricingConfig()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})

// Load API key based on user role
const loadApiKeyFromStorage = async () => {
  // No longer loading from localStorage - API keys are managed by backend
  // For custom users, they must enter the API key directly in the form
  // For free, gold, and diamond users, backend uses server API keys automatically
}

// Create new control motion
const createNewTrackMotion = () => {
  selectedMannequin.value = null
  selectedPresentation.value = null
  imageSourceType.value = 'mannequin'
  motionVideoFile.value = null
  motionVideoPreview.value = null
  customMannequinImageFile.value = null
  customMannequinImagePreview.value = null
  videoTitle.value = ''
  showCreationModal.value = true
  currentStep.value = 1
  videoSettings.value = {
    resolution: '1080p',
  }
  loadMannequins()
  loadPresentations()
  loadApiKeyFromStorage()
  // Ensure pricing is loaded
  if (!pricingConfig.value) {
    loadPricingConfig()
  }
}

// Select mannequin
const selectMannequin = (mannequin) => {
  selectedMannequin.value = mannequin
  selectedPresentation.value = null // Clear presentation when selecting mannequin
  // Clear custom image when selecting from storage
  if (isCustomRole.value) {
    customMannequinImageFile.value = null
    customMannequinImagePreview.value = null
    if (customMannequinImageInput.value) {
      customMannequinImageInput.value.value = ''
    }
  }
}

// Select presentation
const selectPresentation = (presentation) => {
  selectedPresentation.value = presentation
  selectedMannequin.value = null // Clear mannequin when selecting presentation
  // Clear custom image when selecting from storage
  if (isCustomRole.value) {
    customMannequinImageFile.value = null
    customMannequinImagePreview.value = null
    if (customMannequinImageInput.value) {
      customMannequinImageInput.value.value = ''
    }
  }
}

// Handle motion video upload
const handleMotionVideoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB')
      if (motionVideoInput.value) {
        motionVideoInput.value.value = ''
      }
      return
    }
    motionVideoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      motionVideoPreview.value = e.target.result
      // Get video duration
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = Math.ceil(video.duration)
        
        // Validate video duration (max 30 seconds)
        if (duration > 30) {
          alert('O vídeo de motion control deve ter no máximo 30 segundos. O vídeo selecionado tem ' + duration + ' segundos. Por favor, selecione um vídeo mais curto.')
          // Clear the video
          motionVideoFile.value = null
          motionVideoPreview.value = null
          motionVideoDuration.value = 0
          if (motionVideoInput.value) {
            motionVideoInput.value.value = ''
          }
          return
        }
        
        motionVideoDuration.value = duration
      }
      video.onerror = () => {
        alert('Erro ao carregar o vídeo. Por favor, tente novamente com outro arquivo.')
        motionVideoFile.value = null
        motionVideoPreview.value = null
        motionVideoDuration.value = 0
        if (motionVideoInput.value) {
          motionVideoInput.value.value = ''
        }
      }
      video.src = e.target.result
    }
    reader.onerror = () => {
      alert('Erro ao ler o arquivo. Por favor, tente novamente.')
      motionVideoFile.value = null
      motionVideoPreview.value = null
      motionVideoDuration.value = 0
      if (motionVideoInput.value) {
        motionVideoInput.value.value = ''
      }
    }
    reader.readAsDataURL(file)
  }
}

// Remove motion video
const removeMotionVideo = () => {
  motionVideoFile.value = null
  motionVideoPreview.value = null
  motionVideoDuration.value = 0
  if (motionVideoInput.value) {
    motionVideoInput.value.value = ''
  }
}

// Handle custom mannequin image upload
const handleCustomMannequinImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload a JPG or PNG image')
      return
    }
    customMannequinImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      customMannequinImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    // Clear selected mannequin/presentation when custom image is uploaded
    selectedMannequin.value = null
    selectedPresentation.value = null
  }
}

// Remove custom mannequin image
const removeCustomMannequinImage = () => {
  customMannequinImageFile.value = null
  customMannequinImagePreview.value = null
  if (customMannequinImageInput.value) {
    customMannequinImageInput.value.value = ''
  }
}

// Close creation modal
const closeCreationModal = () => {
  selectedMannequin.value = null
  selectedPresentation.value = null
  imageSourceType.value = 'mannequin'
  motionVideoFile.value = null
  motionVideoPreview.value = null
  customMannequinImageFile.value = null
  customMannequinImagePreview.value = null
  showCreationModal.value = false
  videoTitle.value = ''
  currentStep.value = 1
  videoSettings.value = {
    resolution: '1080p',
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
    link.download = `${(video.title || 'control-motion').replace(/\s+/g, '_')}_${video.resolution}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading video:', error)
    alert('Error downloading video. Please try again.')
  }
}

// Delete video
const deleteVideo = async (id) => {
  if (confirm('Are you sure you want to delete this video?')) {
    try {
      // TODO: Implement deleteControlMotionVideo in backend
      controlMotionVideos.value = controlMotionVideos.value.filter(v => v.id !== id)
      // Adjust page if current page becomes empty
      if (currentVideoPage.value > totalVideoPages.value && totalVideoPages.value > 0) {
        currentVideoPage.value = totalVideoPages.value
      }
      // Reload from backend to ensure consistency
      await loadControlMotionVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Error deleting video: ' + error.message)
    }
  }
}

// Convert video file to base64
const videoFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Generate control motion video
const generateTrackMotion = async () => {
  if (!canGenerate.value) {
    const missingFields = []
    let hasImage = false
    if (imageSourceType.value === 'mannequin') {
      hasImage = isCustomRole.value 
        ? (customMannequinImageFile.value || selectedMannequin.value)
        : selectedMannequin.value
      if (!hasImage) missingFields.push('mannequin image')
    } else {
      hasImage = isCustomRole.value 
        ? (customMannequinImageFile.value || selectedPresentation.value)
        : selectedPresentation.value
      if (!hasImage) missingFields.push('product thumb')
    }
    if (!motionVideoFile.value) missingFields.push('motion control video')
    if (isCustomRole.value && !kieApiKey.value) missingFields.push('KieAI API key')
    if (!videoTitle.value.trim()) missingFields.push('video title')
    
    alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
    return
  }

  // Validate video duration (max 30 seconds)
  if (motionVideoDuration.value > 30) {
    alert('O vídeo de motion control deve ter no máximo 30 segundos. O vídeo selecionado tem ' + motionVideoDuration.value + ' segundos. Por favor, selecione um vídeo mais curto.')
    return
  }

  isGenerating.value = true
  
  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Control Motion Video'
  toastMessage.value = 'Please wait while we create your control motion video with KieAI. This may take a few minutes...'
  toastProgress.value = 10

  try {
    // Get image - prioritize custom uploaded image for custom role
    toastProgress.value = 20
    let mannequinImageBase64
    let mannequinId = null
    
    if (isCustomRole.value && customMannequinImageFile.value) {
      // Use custom uploaded image
      toastProgress.value = 25
      const reader = new FileReader()
      mannequinImageBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(customMannequinImageFile.value)
      })
    } else if (imageSourceType.value === 'mannequin' && selectedMannequin.value) {
      // Use selected mannequin from storage
      const selectedMannequinImage = selectedMannequin.value.fullBodyImage
      if (!selectedMannequinImage) {
        throw new Error('Selected mannequin has no image')
      }
      mannequinId = selectedMannequin.value.id

      // Convert mannequin image to base64
      toastProgress.value = 30
      if (selectedMannequinImage.startsWith('http://') || selectedMannequinImage.startsWith('https://')) {
        // It's a URL, download through backend to avoid CORS
        try {
          const response = await fetch(`${API_URL}/api/download-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ url: selectedMannequinImage }),
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to download mannequin image: ${response.statusText}`)
          }
          
          const data = await response.json()
          mannequinImageBase64 = data.base64
        } catch (error) {
          console.error('Error downloading mannequin image:', error)
          throw new Error(`Failed to download mannequin image: ${error.message}`)
        }
      } else if (selectedMannequinImage.includes('data:')) {
        mannequinImageBase64 = selectedMannequinImage.split(',')[1]
      } else {
        mannequinImageBase64 = selectedMannequinImage
      }
    } else if (imageSourceType.value === 'presentation' && selectedPresentation.value) {
      // Use selected presentation (product thumb)
      const selectedPresentationImage = selectedPresentation.value.generatedImage
      if (!selectedPresentationImage) {
        throw new Error('Selected product thumb has no image')
      }

      // Convert presentation image to base64
      toastProgress.value = 30
      if (selectedPresentationImage.startsWith('http://') || selectedPresentationImage.startsWith('https://')) {
        // It's a URL, download through backend to avoid CORS
        try {
          const response = await fetch(`${API_URL}/api/download-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ url: selectedPresentationImage }),
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to download product thumb image: ${response.statusText}`)
          }
          
          const data = await response.json()
          mannequinImageBase64 = data.base64
        } catch (error) {
          console.error('Error downloading product thumb image:', error)
          throw new Error(`Failed to download product thumb image: ${error.message}`)
        }
      } else if (selectedPresentationImage.includes('data:')) {
        mannequinImageBase64 = selectedPresentationImage.split(',')[1]
      } else {
        mannequinImageBase64 = selectedPresentationImage
      }
    } else {
      throw new Error('No image selected or uploaded')
    }

    // Convert motion control video to base64
    toastProgress.value = 40
    const motionVideoBase64 = await videoFileToBase64(motionVideoFile.value)

    // Call backend GraphQL API
    toastProgress.value = 60
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation CreateControlMotionVideo($input: CreateControlMotionVideoInput!) {
            createControlMotionVideo(input: $input) {
              id
              userId
              mannequinId
              title
              generatedVideo
              generatedVideoUrl
              resolution
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: {
            mannequinImage: mannequinImageBase64,
            motionControlVideo: motionVideoBase64,
            title: videoTitle.value.trim(),
            // Only send kieApiKey for custom accounts
            // Free/gold/diamond accounts will use KEY_KIA from server
            kieApiKey: isCustomRole.value ? kieApiKey.value : null,
            resolution: videoSettings.value.resolution,
            mannequinId: (isCustomRole.value && customMannequinImageFile.value) ? null : (imageSourceType.value === 'mannequin' ? (selectedMannequin.value?.id || null) : null),
            duration: motionVideoDuration.value || 5,
          },
        },
      }),
    })

    if (response.errors) {
      console.error('[Control Motion] GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    console.log('[Control Motion] Response received from backend')
    toastProgress.value = 80
    const generatedData = response.data.createControlMotionVideo
    
    const videoId = generatedData.id

    // Video is already uploaded to GCS by backend - use GCS URL
    const video = {
      id: videoId,
      userId: generatedData.userId,
      mannequinId: generatedData.mannequinId,
      title: generatedData.title || videoTitle.value.trim(),
      generatedVideo: generatedData.generatedVideoUrl || generatedData.generatedVideo,
      generatedVideoUrl: generatedData.generatedVideoUrl,
      resolution: generatedData.resolution,
      createdAt: generatedData.createdAt,
      updatedAt: generatedData.updatedAt,
    }
    
    // Add to list
    controlMotionVideos.value.unshift(video)
    // Reset to first page when new video is added
    currentVideoPage.value = 1
    
    // Reload from backend to ensure we have the latest data
    toastProgress.value = 90
    await loadControlMotionVideos()
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Control Motion Video Created Successfully!'
    toastMessage.value = `Your control motion video has been created at ${video.resolution} resolution.`
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
    
    // Reset form and return to videos list
    selectedMannequin.value = null
    selectedPresentation.value = null
    imageSourceType.value = 'mannequin'
    motionVideoFile.value = null
    motionVideoPreview.value = null
    customMannequinImageFile.value = null
    customMannequinImagePreview.value = null
    videoTitle.value = ''
    currentStep.value = 1
    videoSettings.value = {
      resolution: '1080p',
    }
    showCreationModal.value = false
  } catch (error) {
    console.error('Error creating control motion video:', error)
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Creating Control Motion Video'
    toastMessage.value = error.message || 'An error occurred while creating the control motion video. Please try again.'
    toastProgress.value = null
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } finally {
    isGenerating.value = false
  }
}
</script>
