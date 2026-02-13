<template>
  <div class="min-h-screen pb-8 relative">
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
          <div class="backdrop-blur-sm bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-purple-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Product Thumb</span>
              <span class="text-xs font-normal text-purple-700 bg-purple-400/20 backdrop-blur-sm border border-purple-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {{ presentations.length }} {{ presentations.length === 1 ? 'thumb' : 'thumbs' }}
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-purple-500 text-xs flex-shrink-0" />
              <span class="truncate">Create professional product thumbs using AI-generated models</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            @click="createNewPresentation"
            class="w-full sm:w-auto backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-purple-600/30 border border-purple-400/40 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-purple-500/40 hover:to-purple-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span class="hidden sm:inline">New Thumb</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Creation Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="cancelForm"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl flex-shrink-0 relative z-10">
          <div class="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div class="bg-purple-100 border border-purple-300 p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-purple-600 text-lg sm:text-2xl" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg sm:text-2xl font-bold text-gray-900 truncate">Create Product Thumb</h2>
              <p class="text-gray-700 text-xs sm:text-sm font-medium hidden sm:block">Fill in the information step by step to generate your thumb</p>
            </div>
          </div>
          <button
            @click="cancelForm"
            class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6 relative z-10">
          <!-- Step Indicators -->
          <div class="mb-4 sm:mb-8">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="flex items-center flex-1"
              >
                <div class="flex flex-col items-center flex-1">
                  <div
                    class="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg transition-all duration-300 backdrop-blur-sm border-2 shadow-lg"
                    :class="currentStep > index
                      ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-700'
                      : currentStep === index
                      ? 'bg-purple-500/30 border-purple-400/40 text-purple-700'
                      : 'bg-slate-200/40 border-slate-300/40 text-slate-500'"
                  >
                    <font-awesome-icon
                      v-if="currentStep > index"
                      :icon="['fas', 'check']"
                      class="text-white text-xs sm:text-base"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span
                    class="mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-center"
                    :class="currentStep === index ? 'text-purple-700 font-semibold' : 'text-gray-700'"
                  >
                    {{ step.label }}
                  </span>
                </div>
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 transition-all duration-300 rounded-full backdrop-blur-sm"
                  :class="currentStep > index ? 'bg-emerald-500/40 border border-emerald-400/30' : 'bg-slate-200/40 border border-slate-300/30'"
                ></div>
              </div>
            </div>
          </div>

          <!-- Step 1: Model, Product & Type Selection -->
          <div v-if="currentStep === 0" class="space-y-4 sm:space-y-6">
        <!-- Select Mannequin Model -->
        <div class="md:col-span-2">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Select Mannequin Model <span class="text-red-500">*</span>
          </label>
          <div v-if="availableMannequins.length === 0" class="backdrop-blur-sm bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
            <p class="text-amber-700 text-sm font-medium">
              <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
              No mannequin models available. Please create a mannequin model first.
            </p>
          </div>
          <div v-else>
            <button
              @click="showMannequinModal = true"
              type="button"
              class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-400/60 hover:bg-white/40 transition-all text-left flex items-center justify-between"
            >
              <span class="text-gray-800 font-medium">
                <span v-if="selectedMannequinId">
                  {{ getSelectedMannequinName() }}
                </span>
                <span v-else class="text-slate-500">Click to select a mannequin model</span>
              </span>
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-slate-500" />
            </button>
            <div v-if="selectedMannequinId" class="mt-2">
              <div class="flex items-center space-x-3 backdrop-blur-sm bg-purple-500/10 border border-purple-400/20 rounded-xl p-3">
                <img
                  :src="getSelectedMannequinImage()"
                  alt="Selected mannequin"
                  class="w-16 h-16 rounded-lg object-cover border-2 border-purple-500"
                />
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ getSelectedMannequinName() }}</p>
                  <p class="text-sm text-gray-700">{{ getSelectedMannequinType() }}</p>
                </div>
                <button
                  @click="selectedMannequinId = ''"
                  class="p-2 text-red-600 hover:bg-red-500/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-red-400/30"
                  title="Remove selection"
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Upload -->
        <div class="md:col-span-2">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Product Image Upload <span class="text-red-500">*</span>
          </label>
          <div class="mt-2 flex items-center justify-center w-full">
            <label
              class="flex flex-col items-center justify-center w-full h-48 sm:h-64 bg-white border-2 border-dashed border-gray-200 rounded-lg sm:rounded-xl cursor-pointer hover:bg-white/40 transition-all duration-300"
              :class="{ 'border-purple-400/60 bg-purple-500/10': productImagePreview }"
            >
              <div v-if="!productImagePreview" class="flex flex-col items-center justify-center pt-5 pb-6">
                <font-awesome-icon :icon="['fas', 'image']" class="text-gray-400 text-4xl mb-4" />
                <p class="mb-2 text-sm text-gray-500">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
              </div>
              <div v-else class="relative w-full h-full">
                <img :src="productImagePreview" alt="Product preview" class="w-full h-full object-cover rounded-xl" />
                <button
                  @click.stop="removeProductImage"
                  class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </div>
              <input
                ref="productFileInput"
                type="file"
                class="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                @change="handleProductUpload"
              />
            </label>
          </div>
        </div>

        <!-- Presentation Type -->
        <div class="md:col-span-2">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Presentation Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <label
              class="flex items-center p-3 sm:p-4 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
              :class="presentationType === 'presentation-product' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="presentationType"
                type="radio"
                value="presentation-product"
                class="w-4 h-4 text-purple-600 focus:ring-purple-500 mr-2 sm:mr-3 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm sm:text-base text-gray-900">Presentation Product</div>
                <div class="text-xs sm:text-sm text-gray-700">Present the product in a professional way</div>
              </div>
            </label>
            <label
              class="flex items-center p-3 sm:p-4 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
              :class="presentationType === 'wear-product' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="presentationType"
                type="radio"
                value="wear-product"
                class="w-4 h-4 text-purple-600 focus:ring-purple-500 mr-2 sm:mr-3 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm sm:text-base text-gray-900">Wear Product</div>
                <div class="text-xs sm:text-sm text-gray-700">Show the product being worn by the selected model</div>
              </div>
            </label>
          </div>
        </div>

          </div>

          <!-- Step 2: Position, Poses & Expression -->
          <div v-if="currentStep === 1" class="space-y-4 sm:space-y-6">
            <!-- Hand Position -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Hand Position <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-3 gap-2 sm:gap-4">
                <label
                  class="flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.handPosition === 'holding' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.handPosition"
                    type="radio"
                    value="holding"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'hand-holding']" class="text-xl sm:text-3xl mb-1 sm:mb-2 text-gray-600" />
                  <span class="text-xs sm:text-sm font-medium text-gray-700">Holding</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.handPosition === 'pointing' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.handPosition"
                    type="radio"
                    value="pointing"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'hand-point-up']" class="text-3xl mb-2 text-gray-700" />
                  <span class="text-sm font-medium text-gray-900">Pointing</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.handPosition === 'resting' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.handPosition"
                    type="radio"
                    value="resting"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'hand']" class="text-3xl mb-2 text-gray-700" />
                  <span class="text-sm font-medium text-gray-900">Resting</span>
                </label>
              </div>
            </div>

            <!-- Model Pose -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Model Pose <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-3 gap-2 sm:gap-4">
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.modelPose === 'standing' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.modelPose"
                    type="radio"
                    value="standing"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'user']" class="text-3xl mb-2 text-gray-700" />
                  <span class="text-sm font-medium text-gray-900">Standing</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.modelPose === 'sitting' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.modelPose"
                    type="radio"
                    value="sitting"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'chair']" class="text-3xl mb-2 text-gray-700" />
                  <span class="text-sm font-medium text-gray-900">Sitting</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.modelPose === 'dynamic' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.modelPose"
                    type="radio"
                    value="dynamic"
                    class="sr-only"
                  />
                  <font-awesome-icon :icon="['fas', 'running']" class="text-3xl mb-2 text-gray-700" />
                  <span class="text-sm font-medium text-gray-900">Dynamic</span>
                </label>
              </div>
            </div>

            <!-- Expression -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Expression <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-4 gap-2 sm:gap-4">
                <label
                  class="flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.expression === 'smiling' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.expression"
                    type="radio"
                    value="smiling"
                    class="sr-only"
                  />
                  <span class="text-2xl sm:text-4xl mb-1 sm:mb-2">😊</span>
                  <span class="text-[10px] sm:text-xs font-medium text-gray-900">Smiling</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.expression === 'neutral' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.expression"
                    type="radio"
                    value="neutral"
                    class="sr-only"
                  />
                  <span class="text-4xl mb-2">😐</span>
                  <span class="text-xs font-medium text-gray-900">Neutral</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.expression === 'confident' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.expression"
                    type="radio"
                    value="confident"
                    class="sr-only"
                  />
                  <span class="text-4xl mb-2">😎</span>
                  <span class="text-xs font-medium text-gray-900">Confident</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-4 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="presentationSettings.expression === 'friendly' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="presentationSettings.expression"
                    type="radio"
                    value="friendly"
                    class="sr-only"
                  />
                  <span class="text-4xl mb-2">😃</span>
                  <span class="text-xs font-medium text-gray-900">Friendly</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 3: Environment Selection -->
          <div v-if="currentStep === 2" class="space-y-4 sm:space-y-6">
            <!-- Environment Type -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Environment Type <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <label
                  class="flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
                  :class="environmentSettings.type === 'studio' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="environmentSettings.type"
                    type="radio"
                    value="studio"
                    class="sr-only"
                  />
                  <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 sm:mb-3 flex items-center justify-center border-2 border-gray-300">
                    <font-awesome-icon :icon="['fas', 'camera']" class="text-gray-600 text-lg sm:text-2xl" />
                  </div>
                  <span class="text-xs sm:text-sm font-medium text-gray-900">Studio</span>
                  <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1 text-center">Professional studio background</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-6 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="environmentSettings.type === 'indoor' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="environmentSettings.type"
                    type="radio"
                    value="indoor"
                    class="sr-only"
                  />
                  <div class="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg mb-3 flex items-center justify-center border-2 border-amber-300/40 backdrop-blur-sm">
                    <font-awesome-icon :icon="['fas', 'home']" class="text-amber-600 text-2xl" />
                  </div>
                  <span class="text-sm font-medium text-gray-900">Indoor Environment</span>
                  <span class="text-xs text-gray-700 mt-1">Real-world indoor setting</span>
                </label>
              </div>

              <!-- Studio Background Color (shown when studio is selected) -->
              <div v-if="environmentSettings.type === 'studio'" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Background Color <span class="text-red-500">*</span>
                </label>
                <ColorPicker v-model="environmentSettings.studioBackgroundColor" />
                <p class="text-xs text-gray-500 mt-1">Select the background color for the studio setting</p>
              </div>

              <!-- Indoor Environment Selection (shown when indoor is selected) -->
              <div v-if="environmentSettings.type === 'indoor'" class="mt-3 sm:mt-4">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Indoor Environment <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <label
                    v-for="env in [
                      { value: 'cafe', label: 'Cafeteria', icon: 'coffee' },
                      { value: 'bedroom', label: 'Bedroom', icon: 'bed' },
                      { value: 'living-room', label: 'Living Room', icon: 'couch' },
                      { value: 'hall', label: 'Hall', icon: 'door-open' },
                      { value: 'mall', label: 'Shopping Mall', icon: 'shopping-bag' },
                      { value: 'office', label: 'Office', icon: 'briefcase' },
                      { value: 'restaurant', label: 'Restaurant', icon: 'utensils' },
                      { value: 'bathroom', label: 'Bathroom', icon: 'bath' },
                      { value: 'kitchen', label: 'Kitchen', icon: 'utensils' },
                      { value: 'gym', label: 'Gym', icon: 'dumbbell' },
                      { value: 'outdoor', label: 'Outdoor', icon: 'tree' },
                    ]"
                    :key="env.value"
                    class="flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
                    :class="environmentSettings.indoorEnvironment === env.value ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                  >
                    <input
                      v-model="environmentSettings.indoorEnvironment"
                      type="radio"
                      :value="env.value"
                      class="sr-only"
                    />
                    <font-awesome-icon :icon="['fas', env.icon]" class="text-lg sm:text-2xl mb-1 sm:mb-2 text-gray-700" />
                    <span class="text-[10px] sm:text-xs font-medium text-gray-900 text-center">{{ env.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Background Blur Option (shown for both studio and indoor) -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <label class="flex items-center text-sm font-medium text-gray-800 cursor-pointer">
                  <input
                    v-model="environmentSettings.blurBackground"
                    type="checkbox"
                    class="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500/50 bg-white border border-gray-200"
                  />
                  <span class="ml-3">Blur Background</span>
                </label>
                <p class="text-xs text-gray-700 mt-2 ml-8 font-medium">
                  Apply a blur effect to the background to create depth and focus attention on the model and product.
                </p>
              </div>
            </div>
          </div>

          <!-- Step 4: Product Info & API Key -->
          <div v-if="currentStep === 3" class="space-y-4 sm:space-y-6">
            <!-- Image Orientation -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Image Orientation <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <label
                  class="flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-sm border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300"
                  :class="imageOrientation === 'vertical' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="imageOrientation"
                    type="radio"
                    value="vertical"
                    class="sr-only"
                  />
                  <div class="w-12 h-18 sm:w-16 sm:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-2 sm:mb-3 flex items-center justify-center border-2 border-gray-300">
                    <font-awesome-icon :icon="['fas', 'mobile']" class="text-purple-600 text-lg sm:text-2xl" />
                  </div>
                  <span class="text-xs sm:text-sm font-medium text-gray-900">Vertical</span>
                  <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1">Portrait (9:16)</span>
                </label>
                <label
                  class="flex flex-col items-center justify-center p-6 backdrop-blur-sm border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="imageOrientation === 'horizontal' ? 'border-purple-400/40 bg-purple-500/20' : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
                >
                  <input
                    v-model="imageOrientation"
                    type="radio"
                    value="horizontal"
                    class="sr-only"
                  />
                  <div class="w-24 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-3 flex items-center justify-center border-2 border-purple-300/40 backdrop-blur-sm">
                    <font-awesome-icon :icon="['fas', 'desktop']" class="text-purple-600 text-2xl" />
                  </div>
                  <span class="text-sm font-medium text-gray-900">Horizontal</span>
                  <span class="text-xs text-gray-700 mt-1">Landscape (16:9)</span>
                </label>
              </div>
              <p class="text-xs text-gray-700 mt-2 font-medium">Choose the orientation for the generated image</p>
            </div>

            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                v-model="productName"
                type="text"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/40 transition-all text-gray-900 placeholder-gray-500"
                placeholder="Ex: Summer T-Shirt 2024"
              />
            </div>

            <!-- Product Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                v-model="productDescription"
                rows="4"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/40 transition-all resize-none text-gray-900 placeholder-gray-500"
                placeholder="Describe the product..."
              ></textarea>
            </div>

            <!-- Google API Key (only for custom role) -->
            <div v-if="isCustomRole">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Google API Key <span class="text-red-500">*</span>
              </label>
              <input
                v-model="googleApiKey"
                type="password"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/40 transition-all text-gray-900 placeholder-gray-500"
                placeholder="Enter your Google Gemini API key"
              />
              <p class="text-xs text-gray-700 mt-1 font-medium">Your API key will be used to generate the product thumb</p>
              <p class="text-xs text-blue-600 mt-1 font-medium flex items-center space-x-1">
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
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <div>
              <button
                v-if="currentStep > 0"
                @click="previousStep"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-white/40 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                <span>Previous</span>
              </button>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                @click="cancelForm"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-white/40 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                v-if="currentStep < steps.length - 1"
                @click="nextStep"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-purple-500/30 border border-purple-400/40 text-purple-700 rounded-lg sm:rounded-xl hover:bg-purple-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Next</span>
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
              <button
                v-else
                @click="generatePresentation"
                :disabled="isGenerating || !canGenerate"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-purple-500/30 border border-purple-400/40 text-purple-700 rounded-lg sm:rounded-xl hover:bg-purple-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <font-awesome-icon v-if="!isGenerating" :icon="['fas', 'magic']" />
                <span v-if="isGenerating" class="animate-spin">⏳</span>
                <span class="text-xs sm:text-base">{{ isGenerating ? 'Generating...' : 'Generate Thumb (40 credits)' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="px-3 sm:px-6 lg:px-8 relative z-10">
      <!-- Presentations List -->
      <div v-if="presentations.length > 0 && !showForm" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" style="grid-auto-rows: 1fr;">
          <div
            v-for="presentation in paginatedPresentations"
            :key="presentation.id"
          class="group relative bg-white border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 shadow-2xl hover:shadow-2xl"
          :class="presentation.isVertical ? 'row-span-2' : ''"
          :style="presentation.isVertical ? 'aspect-ratio: 1 / 2;' : 'aspect-ratio: 1 / 1;'"
        >
        <!-- Image -->
        <div class="w-full h-full relative overflow-hidden">
          <img
            v-if="presentation.generatedImage || presentation.generatedImageUrl"
            :src="presentation.generatedImage || presentation.generatedImageUrl"
            alt="Product presentation"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            @error="handleImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-8xl opacity-30 image-placeholder">🛍️</div>
          
          <!-- Player Icon Overlay -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div class="backdrop-blur-sm bg-white/30 rounded-full p-4 border border-white/40 shadow-lg">
              <font-awesome-icon :icon="['fas', 'play-circle']" class="text-4xl text-purple-600" />
            </div>
          </div>
          
          <!-- Badge -->
          <div
            class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {{ presentation.type === 'presentation-product' ? 'Presentation' : 'Worn by Model' }}
          </div>
        </div>

        <!-- Overlay with Info (shown on hover) -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-xl font-bold text-white mb-2">{{ presentation.productName || 'Untitled Product' }}</h3>
            <p class="text-gray-200 text-sm mb-4 line-clamp-2">{{ presentation.productDescription || 'No description' }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-white/20">
              <div class="flex items-center space-x-2 text-sm text-gray-300">
                <font-awesome-icon :icon="['fas', 'calendar']" />
                <span>{{ presentation.createdAtDisplay || presentation.createdAt || 'N/A' }}</span>
              </div>
              <div class="flex space-x-2">
                <button 
                  @click.stop="viewFullPresentation(presentation)" 
                  class="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm" 
                  title="View Details"
                >
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </button>
                <button 
                  @click.stop="downloadPresentation(presentation)" 
                  class="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm" 
                  title="Download"
                >
                  <font-awesome-icon :icon="['fas', 'download']" />
                </button>
                <button 
                  @click.stop="deletePresentation(presentation.id)" 
                  class="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors" 
                  title="Delete"
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-6 flex-wrap gap-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center space-x-1 sm:space-x-2 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
            <span>Previous</span>
          </button>
          
          <div class="flex items-center space-x-1 sm:space-x-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300"
              :class="currentPage === page 
                ? 'bg-purple-500/30 border-2 border-purple-400/40 text-purple-700 shadow-lg' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-purple-400/40'"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center space-x-1 sm:space-x-2 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <span>Next</span>
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>

        <!-- Page Info -->
        <div v-if="totalPages > 1" class="text-center text-xs sm:text-sm text-gray-600 font-medium px-2">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, presentations.length) }} of {{ presentations.length }} presentations
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingPresentations && !showForm" class="flex items-center justify-center py-8 sm:py-12">
        <div class="text-center bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-purple-500 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-800 font-medium text-sm sm:text-base">Loading presentations...</p>
        </div>
      </div>

      <!-- Empty State Message -->
      <div v-if="!isLoadingPresentations && presentations.length === 0 && !showForm" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-12 text-center">
        <div class="backdrop-blur-sm bg-slate-200/40 border border-slate-300/40 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-slate-500 text-3xl sm:text-5xl" />
        </div>
        <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-2">No Product Thumb created</h3>
        <p class="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-medium px-4">Start by creating your first product thumb. It's quick and easy!</p>
        <button
          @click="createNewPresentation"
          class="backdrop-blur-sm bg-purple-500/30 border border-purple-400/40 text-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-purple-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 mx-auto text-sm sm:text-base"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>Create First Thumb</span>
        </button>
      </div>
    </div>

    <!-- Presentation Modal for Full View -->
    <div
      v-if="showPresentationModal && selectedPresentation"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="closePresentationModal"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-t-xl sm:rounded-t-2xl relative z-10">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent truncate">{{ selectedPresentation.productName || 'Untitled Product' }}</h3>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
              {{ selectedPresentation.type === 'presentation-product' ? 'Presentation Product' : 'Worn by Model' }}
            </p>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <button
              @click="downloadPresentation(selectedPresentation)"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'download']" />
              <span>Download</span>
            </button>
            <button
              @click="closePresentationModal"
              class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-3 sm:p-6 relative z-10">
          <!-- Generated Presentation -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Generated Thumb</h4>
            <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <img
                v-if="selectedPresentation.generatedImage"
                :src="selectedPresentation.generatedImage"
                alt="Product presentation"
                class="w-full h-auto"
              />
              <div v-else class="h-96 flex items-center justify-center text-gray-400">
                <font-awesome-icon :icon="['fas', 'image']" class="text-6xl" />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedPresentation.productDescription" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p class="text-gray-700 leading-relaxed">{{ selectedPresentation.productDescription }}</p>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Type</p>
              <p class="text-sm font-semibold text-gray-900">
                {{ selectedPresentation.type === 'presentation-product' ? 'Presentation Product' : 'Worn by Model' }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Created</p>
              <p class="text-sm font-semibold text-gray-900">{{ selectedPresentation.createdAt }}</p>
            </div>
            <div v-if="selectedPresentation.productName" class="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Product</p>
              <p class="text-sm font-semibold text-gray-900 line-clamp-2">{{ selectedPresentation.productName }}</p>
            </div>
          </div>

          <!-- Floating Original Product Card (Bottom Right) -->
          <div
            v-if="selectedPresentation.productImage"
            class="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-10 transition-all duration-300"
            :class="isProductCardMinimized ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]'"
          >
            <div class="bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden h-full flex flex-col">
              <!-- Card Header -->
              <div class="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center justify-between flex-shrink-0">
                <span class="text-xs font-medium text-gray-700">Original Product</span>
                <button
                  @click="isProductCardMinimized = !isProductCardMinimized"
                  class="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  title="Minimize/Maximize"
                >
                  <font-awesome-icon 
                    :icon="['fas', isProductCardMinimized ? 'chevron-up' : 'chevron-down']" 
                    class="text-sm" 
                  />
                </button>
              </div>
              
              <!-- Product Image -->
              <div v-if="!isProductCardMinimized" class="flex-1 overflow-hidden">
                <img
                  :src="selectedPresentation.productImage"
                  alt="Original product"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Minimized View -->
              <div v-else class="flex-1 flex items-center justify-center bg-gray-50">
                <font-awesome-icon :icon="['fas', 'image']" class="text-gray-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mannequin Selection Modal -->
    <div
      v-if="showMannequinModal"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="closeMannequinModal"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl relative z-10">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">Select Mannequin Model</h3>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 font-medium hidden sm:block">Choose a model to use for the presentation</p>
          </div>
          <button
            @click="closeMannequinModal"
            class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-3 sm:p-6 relative z-10">
          <div v-if="availableMannequins.length === 0" class="text-center py-12">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-amber-500 text-5xl mb-4" />
            <p class="text-gray-700 font-medium">No mannequin models available. Please create a mannequin model first.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="mannequin in availableMannequins"
              :key="mannequin.id"
              @click="selectMannequin(mannequin.id)"
              class="bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg transform hover:scale-105"
              :class="selectedMannequinId === mannequin.id ? 'border-purple-400/60 shadow-lg' : 'border-gray-200 hover:border-purple-400/40'"
            >
              <div class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                <img
                  v-if="mannequin.fullBodyImage"
                  :src="mannequin.fullBodyImage"
                  alt="Mannequin model"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-6xl opacity-50">👔</div>
                
                <!-- Face thumbnail -->
                <div
                  v-if="mannequin.faceThumbnail"
                  class="absolute bottom-2 right-2 w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white"
                >
                  <img
                    :src="mannequin.faceThumbnail"
                    alt="Face thumbnail"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Selected indicator -->
                <div
                  v-if="selectedMannequinId === mannequin.id"
                  class="absolute top-2 right-2 bg-purple-600 text-white p-2 rounded-full"
                >
                  <font-awesome-icon :icon="['fas', 'check']" />
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-1">{{ mannequin.name }}</h4>
                <p class="text-sm text-gray-700 capitalize">{{ mannequin.type }}</p>
                <p class="text-xs text-slate-500 mt-2">{{ mannequin.description || 'No description' }}</p>
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

// Form state
const showForm = ref(false)
const isGenerating = ref(false)
const productImageFile = ref(null)
const productImagePreview = ref(null)
const googleApiKey = ref('')
const productFileInput = ref(null)
const selectedMannequinId = ref('')
const presentationType = ref('presentation-product')
const productName = ref('')
const productDescription = ref('')
const imageOrientation = ref('vertical') // 'vertical' or 'horizontal'
const currentStep = ref(0)

// Toast state
const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Steps configuration
const steps = [
  { label: 'Model & Product', key: 'selection' },
  { label: 'Position & Style', key: 'position' },
  { label: 'Environment', key: 'environment' },
  { label: 'Details & API', key: 'details' },
]

// Presentation settings for step 2
const presentationSettings = ref({
  handPosition: 'holding', // 'holding', 'pointing', 'resting'
  modelPose: 'standing', // 'standing', 'sitting', 'dynamic'
  expression: 'smiling', // 'smiling', 'neutral', 'confident', 'friendly'
})

// Environment settings for step 3
const environmentSettings = ref({
  type: 'studio', // 'studio' or 'indoor'
  studioBackgroundColor: '#FFFFFF', // Color for studio background
  indoorEnvironment: 'cafe', // 'cafe', 'bedroom', 'living-room', 'hall', 'mall', 'office', 'restaurant', 'bathroom', 'kitchen', 'gym', 'outdoor'
  blurBackground: false, // Whether to blur the background
})

// Modal state
const showPresentationModal = ref(false)
const selectedPresentation = ref(null)
const showMannequinModal = ref(false)
const isProductCardMinimized = ref(false)

// Available mannequins from storage
const availableMannequins = ref([])

// Presentations list
const presentations = ref([])
const isLoadingPresentations = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 9 // 9 presentations per page

// Computed for paginated presentations
const paginatedPresentations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return presentations.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(presentations.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
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

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Computed
const canGenerate = computed(() => {
  // For custom role, API key is required
  // For free, gold, and diamond, backend manages API keys automatically
  const hasApiKey = isCustomRole.value ? googleApiKey.value : true
  
  return selectedMannequinId.value && 
         productImageFile.value && 
         hasApiKey && 
         presentationType.value &&
         presentationSettings.value.handPosition &&
         presentationSettings.value.modelPose &&
         presentationSettings.value.expression &&
         environmentSettings.value.type &&
         (environmentSettings.value.type === 'studio' ? environmentSettings.value.studioBackgroundColor : environmentSettings.value.indoorEnvironment) &&
         availableMannequins.value.length > 0
})

// Load mannequins from backend
const loadMannequins = async () => {
  try {
    // Try to load from backend first
    const loaded = await backendStorage.fetchMannequins()
    
    // Map backend data to frontend format
    availableMannequins.value = loaded.map(mannequin => ({
      ...mannequin,
      // Use GCS URL if available, otherwise fallback to generatedImage (base64)
      fullBodyImage: mannequin.fullBodyImageUrl || mannequin.generatedImage,
      faceThumbnail: mannequin.faceThumbnailUrl,
    }))
  } catch (error) {
    console.error('Error loading mannequins from backend:', error)
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

// Check if image is vertical (height > width)
const checkImageOrientation = (imageSrc) => {
  return new Promise((resolve) => {
    if (!imageSrc) {
      resolve(false)
      return
    }
    
    const img = new Image()
    img.onload = () => {
      const isVertical = img.height > img.width
      resolve(isVertical)
    }
    img.onerror = () => {
      resolve(false) // Default to square if error
    }
    img.src = imageSrc
  })
}

// Load presentations from backend
const loadPresentations = async () => {
  isLoadingPresentations.value = true
  try {
    const loaded = await backendStorage.fetchPresentations()
    console.log('[Product Presentation] Loaded presentations from backend:', loaded.length)
    
    // Process presentations and check if images are vertical
    const processed = await Promise.all(
      loaded.map(async (presentation) => {
        try {
          // Use GCS URL first, then fallback to generatedImage (base64), then null
          const generatedImage = presentation.generatedImageUrl || presentation.generatedImage || null
          
          // Only check orientation if we have an image
          let isVertical = false
          if (generatedImage) {
            try {
              isVertical = await checkImageOrientation(generatedImage)
            } catch (orientationError) {
              console.warn(`Could not check orientation for presentation ${presentation.id}:`, orientationError)
              isVertical = false
            }
          }
          
          return {
            ...presentation,
            id: presentation.id,
            productName: presentation.productName || 'Untitled Product',
            productDescription: presentation.productDescription || '',
            type: presentation.presentationType || 'presentation-product',
            generatedImage,
            generatedImageUrl: presentation.generatedImageUrl,
            productImage: presentation.productImageUrl || null,
            productImageUrl: presentation.productImageUrl,
            isVertical,
            createdAt: presentation.createdAt,
            createdAtDisplay: presentation.createdAt 
              ? new Date(presentation.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'N/A',
          }
        } catch (e) {
          console.error(`Error processing presentation ${presentation.id}:`, e)
          return null
        }
      })
    )
    
    presentations.value = processed.filter(Boolean)
    // Reset to first page when loading new presentations
    currentPage.value = 1
    console.log('[Product Presentation] Processed presentations:', presentations.value.length)
    console.log('[Product Presentation] Presentations data:', presentations.value)
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
              const isVertical = await checkImageOrientation(generatedImage)
              
              return {
                ...data,
                id,
                generatedImage,
                productImage,
                isVertical,
                createdAtDisplay: data.createdAt 
                  ? new Date(data.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'N/A',
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
  } finally {
    isLoadingPresentations.value = false
  }
}

// Load on mount
onMounted(async () => {
  console.log('[Product Presentation] Component mounted, loading data...')
  await loadMannequins()
  await loadPresentations()
  loadApiKeyFromStorage()
  console.log('[Product Presentation] Initial load complete. Presentations count:', presentations.value.length)
  console.log('[Product Presentation] Presentations:', presentations.value)
})

// Computed to check if user has custom role
const isCustomRole = computed(() => {
  return user.value?.role === 'custom'
})

// Load API key based on user role
const loadApiKeyFromStorage = async () => {
  try {
    // Only load API key for custom role users
    // Free, gold, diamond, and admin users use backend API keys automatically
    if (isCustomRole.value) {
      const saved = localStorage.getItem('google_api_key')
      if (saved) {
        googleApiKey.value = saved
      }
    }
    // For free, gold, and diamond users, API key is managed by backend - no need to load
  } catch (error) {
    console.error('Error loading API key:', error)
  }
}

// Handle product image upload
const handleProductUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    productImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      productImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Remove product image
const removeProductImage = () => {
  productImageFile.value = null
  productImagePreview.value = null
  if (productFileInput.value) {
    productFileInput.value.value = ''
  }
}

// Step navigation
const nextStep = () => {
  // Validate current step before proceeding
  if (currentStep.value === 0) {
    // Validate step 1: Model, Product & Type
    if (!selectedMannequinId.value || !productImageFile.value || !presentationType.value) {
      alert('Please select a mannequin model, upload a product image, and choose a presentation type')
      return
    }
  } else if (currentStep.value === 1) {
    // Validate step 2: Position & Style
    if (!presentationSettings.value.handPosition || !presentationSettings.value.modelPose || !presentationSettings.value.expression) {
      alert('Please select hand position, model pose, and expression')
      return
    }
  } else if (currentStep.value === 2) {
    // Validate step 3: Environment
    if (!environmentSettings.value.type) {
      alert('Please select an environment type')
      return
    }
    if (environmentSettings.value.type === 'studio' && !environmentSettings.value.studioBackgroundColor) {
      alert('Please select a background color for the studio')
      return
    }
    if (environmentSettings.value.type === 'indoor' && !environmentSettings.value.indoorEnvironment) {
      alert('Please select an indoor environment')
      return
    }
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Create new presentation
const createNewPresentation = async () => {
  showForm.value = true
  currentStep.value = 0
  await loadMannequins() // Reload to get latest mannequins from backend
  selectedMannequinId.value = ''
  presentationType.value = 'presentation-product'
  productName.value = ''
  productDescription.value = ''
  imageOrientation.value = 'vertical'
  removeProductImage()
  // Load API key from storage when opening form
  loadApiKeyFromStorage()
  presentationSettings.value = {
    handPosition: 'holding',
    modelPose: 'standing',
    expression: 'smiling',
  }
  environmentSettings.value = {
    type: 'studio',
    studioBackgroundColor: '#FFFFFF',
    indoorEnvironment: 'cafe',
    blurBackground: false,
  }
}

// Cancel form
const cancelForm = () => {
  showForm.value = false
  currentStep.value = 0
  selectedMannequinId.value = ''
  presentationType.value = 'presentation-product'
  productName.value = ''
  productDescription.value = ''
  imageOrientation.value = 'vertical'
  removeProductImage()
  // Don't clear API key, keep it for next time
  // googleApiKey.value = ''
  presentationSettings.value = {
    handPosition: 'holding',
    modelPose: 'standing',
    expression: 'smiling',
  }
  environmentSettings.value = {
    type: 'studio',
    studioBackgroundColor: '#FFFFFF',
    indoorEnvironment: 'cafe',
    blurBackground: false,
  }
}

// Get selected mannequin name
const getSelectedMannequinName = () => {
  const mannequin = availableMannequins.value.find(m => m.id === selectedMannequinId.value)
  return mannequin ? mannequin.name : ''
}

// Get selected mannequin type
const getSelectedMannequinType = () => {
  const mannequin = availableMannequins.value.find(m => m.id === selectedMannequinId.value)
  return mannequin ? mannequin.type : ''
}

// Get selected mannequin image
const getSelectedMannequinImage = () => {
  const mannequin = availableMannequins.value.find(m => m.id === selectedMannequinId.value)
  return mannequin ? (mannequin.fullBodyImage || mannequin.faceThumbnail || '') : ''
}

// Select mannequin from modal
const selectMannequin = (mannequinId) => {
  selectedMannequinId.value = mannequinId
  showMannequinModal.value = false
}

// Close mannequin modal
const closeMannequinModal = () => {
  showMannequinModal.value = false
}

// View full presentation
const viewFullPresentation = (presentation) => {
  selectedPresentation.value = presentation
  showPresentationModal.value = true
  isProductCardMinimized.value = false // Reset to expanded when opening modal
}

// Close presentation modal
const closePresentationModal = () => {
  showPresentationModal.value = false
  selectedPresentation.value = null
  isProductCardMinimized.value = false
}

// Download presentation
const downloadPresentation = (presentation) => {
  if (!presentation.generatedImage) {
    alert('No image available to download')
    return
  }

  try {
    const link = document.createElement('a')
    link.href = presentation.generatedImage
    link.download = `${(presentation.productName || 'product').replace(/\s+/g, '_')}_presentation.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading presentation:', error)
    alert('Error downloading image. Please try again.')
  }
}

// Handle image loading errors
const handleImageError = (event) => {
  console.error('Error loading presentation image:', event.target.src)
  // Replace with placeholder or hide the image
  event.target.style.display = 'none'
  const placeholder = event.target.parentElement.querySelector('.image-placeholder')
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

// Delete presentation
const deletePresentation = async (id) => {
  if (confirm('Are you sure you want to delete this presentation?')) {
    try {
      await backendStorage.deletePresentation(id)
      presentations.value = presentations.value.filter(p => p.id !== id)
      // Adjust page if current page becomes empty
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
      }
    } catch (error) {
      console.error('Error deleting presentation:', error)
      alert('Error deleting presentation: ' + error.message)
      // Fallback to localStorage if backend fails
      try {
        storage.deletePresentation(id)
        presentations.value = presentations.value.filter(p => p.id !== id)
      } catch (fallbackError) {
        console.error('Error deleting presentation from localStorage:', fallbackError)
      }
    }
  }
}

// Generate presentation
const generatePresentation = async () => {
  if (!canGenerate.value) {
    alert('Please fill in all required fields')
    return
  }

  isGenerating.value = true
  
  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Product Thumb'
  toastMessage.value = 'Please wait while we create your product presentation with AI...'
  toastProgress.value = 10

  try {
    // Get selected mannequin
    toastProgress.value = 20
    const selectedMannequin = availableMannequins.value.find(m => m.id === selectedMannequinId.value)
    if (!selectedMannequin || !selectedMannequin.fullBodyImage) {
      throw new Error('Selected mannequin not found or has no image')
    }

    // Convert product image to base64
    toastProgress.value = 30
    const productBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(productImageFile.value)
    })

    // Convert mannequin image to base64
    // If it's a URL (GCS), download through backend to avoid CORS issues
    toastProgress.value = 50
    let mannequinImageBase64
    const mannequinImage = selectedMannequin.fullBodyImage
    
    if (mannequinImage.startsWith('http://') || mannequinImage.startsWith('https://')) {
      // It's a URL, download through backend to avoid CORS
      try {
        const response = await fetch(`${API_URL}/api/download-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ url: mannequinImage }),
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
    } else if (mannequinImage.includes('data:')) {
      // It's already a data URL, extract base64 part
      mannequinImageBase64 = mannequinImage.split(',')[1]
    } else {
      // Assume it's already base64 without prefix
      mannequinImageBase64 = mannequinImage
    }

    // Call backend GraphQL API
    toastProgress.value = 60
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante: incluir cookies de autenticação
      body: JSON.stringify({
        query: `
          mutation CreateProductPresentation($input: CreateProductPresentationInput!) {
            createProductPresentation(input: $input) {
              id
              userId
              productName
              productDescription
              presentationType
              generatedImage
              generatedImageUrl
              productImageUrl
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: {
            mannequinImage: mannequinImageBase64,
            productImage: productBase64,
            presentationType: presentationType.value,
            productName: productName.value,
            productDescription: productDescription.value,
            ...(selectedMannequinId.value && { mannequinId: selectedMannequinId.value }), // Pass mannequinId to save relationship only if selected
            ...(isCustomRole.value && { googleApiKey: googleApiKey.value }), // Only include if custom role
            handPosition: presentationSettings.value.handPosition,
            modelPose: presentationSettings.value.modelPose,
            expression: presentationSettings.value.expression,
            environmentType: environmentSettings.value.type,
            studioBackgroundColor: environmentSettings.value.type === 'studio' ? environmentSettings.value.studioBackgroundColor : null,
            indoorEnvironment: environmentSettings.value.type === 'indoor' ? environmentSettings.value.indoorEnvironment : null,
            blurBackground: environmentSettings.value.blurBackground || false,
            imageOrientation: imageOrientation.value, // 'vertical' or 'horizontal'
          },
        },
      }),
    })

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    toastProgress.value = 80
    const generatedData = response.data.createProductPresentation
    const presentationId = generatedData.id

    // Presentation is already saved in backend (GCS + MongoDB)
    // Use GCS URL if available, otherwise fallback to base64
    const generatedImage = generatedData.generatedImageUrl || generatedData.generatedImage
    const isVertical = await checkImageOrientation(generatedImage)

    // Prepare presentation data
    const presentation = {
      id: presentationId,
      userId: generatedData.userId,
      productName: generatedData.productName,
      productDescription: generatedData.productDescription,
      type: generatedData.presentationType,
      generatedImage,
      generatedImageUrl: generatedData.generatedImageUrl,
      productImage: generatedData.productImageUrl || productImagePreview.value,
      productImageUrl: generatedData.productImageUrl,
      isVertical,
      createdAt: generatedData.createdAt,
      createdAtDisplay: generatedData.createdAt 
        ? new Date(generatedData.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : 'N/A',
    }

    // Add to list (will be reloaded from backend on next mount)
    presentations.value.unshift(presentation)
    // Reset to first page when new presentation is added
    currentPage.value = 1
    
    // Reload from backend to ensure we have the latest data with GCS URLs
    toastProgress.value = 90
    await loadPresentations()
    
    showForm.value = false
    removeProductImage()
    googleApiKey.value = ''
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Product Thumb Created!'
    toastMessage.value = 'Your product thumb has been created successfully. 40 credits consumed.'
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } catch (error) {
    console.error('Error creating presentation:', error)
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Creating Thumb'
    toastMessage.value = error.message || 'An error occurred while creating the thumb. Please try again.'
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
