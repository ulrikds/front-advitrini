<template>
  <div class="vitrini-template min-h-screen font-sans antialiased">    

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-blue-500"></div>
    </div>

    <!-- Video Creation Center Box (after selecting product thumb) -->
    <Transition name="video-box">
      <div v-if="!loading && selectedPresentationForVideo && !showProductThumbModal" class="w-4/5 mx-auto mb-6 relative z-30">
        <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 video-creation-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Create Video from Template</h2>
          <button
            @click="resetVideoCreation"
            class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition-all"
          >
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>

        <!-- Steps tabs: shown only after image is generated; click to go to each step -->
        <div v-if="generatedMannequinImage" class="mb-5 border-b border-gray-100 overflow-x-auto">
          <nav class="flex gap-0 min-w-max sm:min-w-0" aria-label="Creation steps">
            <button
              v-for="s in creationSteps"
              :key="s.step"
              type="button"
              @click="goToStep(s.step)"
              :class="[
                'flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 text-xs sm:text-sm border-b-2 transition-all duration-200 whitespace-nowrap relative',
                videoCreationStep === s.step
                  ? 'border-blue-500 text-blue-700 font-medium'
                  : (s.step < videoCreationStep || (s.step === 3 && generatedMannequinImage))
                    ? 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-200'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
              ]"
            >
              <span v-if="(s.step < videoCreationStep) || (s.step === 3 && generatedMannequinImage)" class="mr-1.5 text-green-500">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="text-sm" />
              </span>
              <font-awesome-icon v-else :icon="s.icon" class="text-sm opacity-70" />
              <span>{{ s.label }}</span>
            </button>
          </nav>
          <!-- Progress bar -->
          <div class="h-0.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-400 ease-out"
              :style="{ width: `${(videoCreationStep / 6) * 100}%` }"
            />
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Selected Product Thumb Preview -->
          <div class="lg:col-span-1">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4">
              <div class="flex items-center justify-between gap-2 mb-3">
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ generatedMannequinImage ? 'Generated Mannequin Image' : 'Selected Product Thumb' }}
                </h3>
                <button
                  type="button"
                  @click="showLeftColumnPromptContext = !showLeftColumnPromptContext"
                  class="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                  :title="showLeftColumnPromptContext ? 'Hide prompt context' : 'Show prompt context'"
                  aria-label="Toggle prompt context"
                >
                  <font-awesome-icon
                    :icon="['fas', 'align-left']"
                    class="text-sm"
                  />
                  <font-awesome-icon
                    :icon="['fas', showLeftColumnPromptContext ? 'chevron-up' : 'chevron-down']"
                    class="text-xs ml-1 opacity-80"
                  />
                </button>
              </div>
              <div class="space-y-3">
                <div class="relative overflow-hidden rounded-lg">
                  <Transition name="thumb-fade" mode="out-in">
                    <img
                      :key="generatedMannequinImage ? 'generated' : 'thumb'"
                      :src="generatedMannequinImage || selectedPresentationForVideo.imageUrl"
                      :alt="generatedMannequinImage ? 'Generated mannequin image' : selectedPresentationForVideo.productName"
                      class="w-full aspect-square object-cover rounded-lg"
                    />
                  </Transition>
                  <button
                    type="button"
                    @click="openPreviewThumbImage"
                    class="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-110"
                    title="View larger"
                    aria-label="View image larger"
                  >
                    <font-awesome-icon :icon="['fas', 'search-plus']" class="text-lg" />
                  </button>
                  <div class="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-white text-sm" />
                  </div>
                  <div v-if="generatedMannequinImage" class="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span class="text-xs font-semibold text-white">Generated</span>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ selectedPresentationForVideo.productName }}</p>
                  <div
                    v-if="showLeftColumnPromptContext"
                    class="mt-2 p-2.5 bg-gray-100 border border-gray-200 rounded-lg"
                  >
                    <p class="text-xs font-medium text-gray-600 mb-1">Prompt context</p>
                    <p class="text-xs text-gray-700 whitespace-pre-wrap break-words">{{ selectedPresentationForVideo.productDescription || 'No description' }}</p>
                  </div>
                  <p v-else class="text-xs text-gray-700 mt-1 line-clamp-2">{{ selectedPresentationForVideo.productDescription || 'No description' }}</p>
                  <p v-if="generatedMannequinImage" class="text-xs text-green-600 mt-1 font-medium">✓ Image generated successfully</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: All Steps (with slide transition) -->
            <div class="lg:col-span-2 min-h-[320px] relative overflow-hidden">
              <Transition :name="stepTransitionName" mode="out-in">
                <div :key="videoCreationStep" class="space-y-4">
            <!-- Product Upload Section -->
            <div v-if="videoCreationStep === 1" class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Upload Product Image</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <input
              ref="productImageInput"
              type="file"
              accept="image/*"
              @change="handleProductImageUpload"
              class="hidden"
            />
            <div
              @click="productImageInput?.click()"
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-all"
            >
              <div v-if="!uploadedProductImage" class="space-y-4">
                <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="text-4xl text-gray-400" />
                <div>
                  <p class="text-gray-800 font-medium">Click to upload product image</p>
                  <p class="text-sm text-gray-600 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <img :src="uploadedProductImage" alt="Uploaded product" class="max-h-48 mx-auto rounded-lg" />
                <p class="text-sm text-gray-600">Click to change image</p>
              </div>
            </div>
          </div>

          <div v-if="uploadedProductImage" class="flex justify-end">
            <button
              @click="goToStep(2)"
              class="px-6 py-2 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Next: Select Product Type
            </button>
          </div>
        </div>

            <!-- Product Type Selection -->
            <div v-if="videoCreationStep === 2" class="space-y-4">
              <h3 class="text-base font-semibold text-gray-900 mb-4">Select Product Type</h3>
              <p class="text-sm text-gray-700 mb-4">Choose how the product will be used in the video</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  @click="selectProductType('presentable')"
                  :class="[
                    'p-6 rounded-lg border-2 transition-all text-left',
                    productType === 'presentable'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center space-x-3 mb-3">
                    <font-awesome-icon :icon="['fas', 'hand-holding']" class="text-2xl text-blue-600" />
                    <h4 class="font-semibold text-gray-900">Presentable</h4>
                  </div>
                  <p class="text-sm text-gray-700">Product will be held in hand (cosmetics, electronics, accessories, etc.)</p>
                </button>

                <button
                  @click="selectProductType('wearable')"
                  :class="[
                    'p-6 rounded-lg border-2 transition-all text-left',
                    productType === 'wearable'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center space-x-3 mb-3">
                    <font-awesome-icon :icon="['fas', 'tshirt']" class="text-2xl text-blue-600" />
                    <h4 class="font-semibold text-gray-900">Wearable</h4>
                  </div>
                  <p class="text-sm text-gray-700">The mannequin will wear the uploaded product (clothing, shoes, jewelry, accessories, etc.). The product from your upload will be fitted on the model.</p>
                </button>
              </div>

              <div v-if="productType" class="mt-4">
                <label class="block text-sm font-medium text-gray-800 mb-2">
                  Scene Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="videoPromptData.scene"
                  rows="4"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                  :placeholder="productType === 'presentable'
                    ? (selectedMannequinForVideo?.gender === 'male'
                      ? 'Describe how the mannequin will present the product. Example: A man holds the product up to camera and smiles naturally, showcasing its features.'
                      : 'Describe how the mannequin will present the product. Example: A young woman holds the product up to camera and smiles naturally, showcasing its features.')
                    : (selectedMannequinForVideo?.gender === 'male'
                      ? 'Describe how the mannequin will wear the uploaded product. Example: A man wears and models the uploaded product, showing different angles and movements to highlight how it fits on the body.'
                      : 'Describe how the mannequin will wear the uploaded product. Example: A young woman wears and models the uploaded product, showing different angles and movements to highlight how it fits on the body.')"
                ></textarea>
              </div>

              <div class="flex justify-between mt-6">
                <button
                  @click="goToStep(1)"
                  class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Previous
                </button>
                <button
                  @click="goToStep(3)"
                  :disabled="!productType || !videoPromptData.scene.trim()"
                  class="px-4 py-2 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                >
                  Next: Generate Image
                </button>
              </div>
            </div>

        <!-- Generate Image Step -->
        <div v-if="videoCreationStep === 3" class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Generate Mannequin Image</h3>
          <p class="text-sm text-gray-700 mb-4">First, we'll generate an image of the mannequin {{ productType === 'wearable' ? 'wearing' : 'presenting' }} your product.</p>
          
          <div v-if="!generatedMannequinImage" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="font-medium text-gray-900">Ready to generate image</p>
                <p class="text-sm text-gray-700">The mannequin will {{ productType === 'wearable' ? 'wear' : 'present' }} your uploaded product</p>
              </div>
            </div>
            
            <button
              @click="generateMannequinImage"
              :disabled="isGeneratingImage"
              class="w-full px-6 py-3 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99]"
              :class="{ 'animate-pulse-subtle': isGeneratingImage }"
            >
              <span v-if="isGeneratingImage" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <font-awesome-icon v-else :icon="['fas', 'image']" class="text-lg" />
              <span>{{ isGeneratingImage ? 'Generating Image...' : 'Generate Image' }}</span>
            </button>
          </div>

          <div v-else class="space-y-6">
            <!-- Compact generated image reminder -->
            <div class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-green-500/50">
                <img
                  :src="generatedMannequinImage"
                  alt="Generated"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-green-500/20">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-600 text-lg" />
                </div>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 text-sm">Image ready</p>
                <p class="text-xs text-gray-600">Choose an option below to continue</p>
              </div>
              <button
                @click="goToStep(2)"
                class="ml-auto px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Previous
              </button>
            </div>

            <!-- Button to open hub pop-up -->
            <div class="flex justify-center pt-2">
              <button
                type="button"
                @click="showHubModal = true"
                class="px-6 py-3 rounded-xl border-2 border-blue-400 bg-blue-50 text-blue-800 font-semibold shadow-md hover:bg-blue-100 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
              >
                <font-awesome-icon :icon="['fas', 'hand-point-up']" class="text-xl" />
                Choose next step
              </button>
            </div>
          </div>
        </div>

        <!-- Studio Step (image customization) -->
        <div v-if="videoCreationStep === 4" class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Studio</h3>
          <p class="text-sm text-gray-700 mb-4">Change the <strong>background</strong> and the <strong>position</strong> of the mannequin. Modifications in the Studio improve the quality of the mannequin with the product and are <strong>recommended</strong>.</p>
          
          <!-- Background Reference -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <font-awesome-icon :icon="['fas', 'image']" class="text-blue-600 mr-2" />
              Background Reference
            </h4>
            <div class="space-y-3">
              <input
                ref="backgroundInput"
                type="file"
                accept="image/*"
                @change="handleBackgroundUpload"
                class="hidden"
              />
              <button
                @click="backgroundInput?.click()"
                type="button"
                class="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all text-center"
              >
                <font-awesome-icon :icon="['fas', 'upload']" class="text-blue-600 text-xl mb-2" />
                <p class="text-gray-800 font-medium text-sm">Upload Background Image</p>
                <p class="text-xs text-gray-600 mt-1">Click to select a reference image</p>
              </button>
              <div v-if="backgroundPreview" class="mt-3">
                <img
                  :src="backgroundPreview"
                  alt="Background preview"
                  class="w-full h-32 rounded-lg object-cover border-2 border-blue-500"
                />
                <button
                  @click="removeBackground"
                  class="mt-2 w-full px-3 py-2 bg-red-100 border border-red-300 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                  Remove Background
                </button>
              </div>
            </div>
          </div>

          <!-- Position Settings -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <font-awesome-icon :icon="['fas', 'user-friends']" class="text-blue-600 mr-2" />
              Position
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <label
                class="relative flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                :class="imageSettings.position === 'standing'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'"
              >
                <input
                  v-model="imageSettings.position"
                  type="radio"
                  value="standing"
                  class="sr-only"
                />
                <font-awesome-icon :icon="['fas', 'user']" class="text-blue-600 text-xl mb-1" />
                <span class="text-xs font-medium text-gray-900">Standing</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                :class="imageSettings.position === 'sitting'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'"
              >
                <input
                  v-model="imageSettings.position"
                  type="radio"
                  value="sitting"
                  class="sr-only"
                />
                <font-awesome-icon :icon="['fas', 'chair']" class="text-blue-600 text-xl mb-1" />
                <span class="text-xs font-medium text-gray-900">Sitting</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                :class="imageSettings.position === 'streamer'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'"
              >
                <input
                  v-model="imageSettings.position"
                  type="radio"
                  value="streamer"
                  class="sr-only"
                />
                <font-awesome-icon :icon="['fas', 'microphone']" class="text-blue-600 text-xl mb-1" />
                <span class="text-xs font-medium text-gray-900">Streamer</span>
              </label>
            </div>
          </div>

          <!-- Camera Focus -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <font-awesome-icon :icon="['fas', 'camera']" class="text-blue-600 mr-2" />
              Camera Focus
            </h4>
            <div class="grid grid-cols-4 gap-2">
              <label
                v-for="focus in ['face', 'hands', 'full-body', 'upper-body']"
                :key="focus"
                class="relative flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all"
                :class="imageSettings.cameraFocus === focus
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'"
              >
                <input
                  v-model="imageSettings.cameraFocus"
                  type="radio"
                  :value="focus"
                  class="sr-only"
                />
                <font-awesome-icon 
                  :icon="focus === 'face' ? ['fas', 'user-circle'] : focus === 'hands' ? ['fas', 'hand-paper'] : focus === 'full-body' ? ['fas', 'user'] : ['fas', 'tshirt']" 
                  class="text-blue-600 text-lg mb-1" 
                />
                <span class="text-[10px] font-medium text-gray-900 text-center">{{ focus === 'full-body' ? 'Full Body' : focus === 'upper-body' ? 'Upper Body' : focus.charAt(0).toUpperCase() + focus.slice(1) }}</span>
              </label>
            </div>
          </div>

          <!-- Camera Angle & Perspective -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <font-awesome-icon :icon="['fas', 'video']" class="text-blue-600 mr-2" />
              Camera Angle & Perspective
            </h4>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-800 mb-2">Angle</label>
                <div class="grid grid-cols-4 gap-2">
                  <label
                    v-for="angle in ['front', 'side', 'three-quarter', 'low-angle']"
                    :key="angle"
                    class="relative flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all"
                    :class="imageSettings.cameraAngle === angle
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-400'"
                  >
                    <input
                      v-model="imageSettings.cameraAngle"
                      type="radio"
                      :value="angle"
                      class="sr-only"
                    />
                    <font-awesome-icon 
                      :icon="angle === 'front' ? ['fas', 'arrow-up'] : angle === 'side' ? ['fas', 'arrow-right'] : angle === 'three-quarter' ? ['fas', 'arrows-alt'] : ['fas', 'arrow-up']" 
                      :class="angle === 'low-angle' ? 'rotate-45' : ''"
                      class="text-blue-600 text-sm mb-1" 
                    />
                    <span class="text-[9px] font-medium text-gray-900 text-center">{{ angle === 'three-quarter' ? '3/4' : angle === 'low-angle' ? 'Low' : angle.charAt(0).toUpperCase() + angle.slice(1) }}</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-800 mb-2">Distance</label>
                <div class="grid grid-cols-4 gap-2">
                  <label
                    v-for="distance in ['close-up', 'medium', 'full-body', 'wide']"
                    :key="distance"
                    class="relative flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all"
                    :class="imageSettings.cameraDistance === distance
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-blue-400'"
                  >
                    <input
                      v-model="imageSettings.cameraDistance"
                      type="radio"
                      :value="distance"
                      class="sr-only"
                    />
                    <font-awesome-icon 
                      :icon="distance === 'close-up' ? ['fas', 'search-plus'] : distance === 'medium' ? ['fas', 'expand'] : distance === 'full-body' ? ['fas', 'user'] : ['fas', 'expand-arrows-alt']" 
                      class="text-blue-600 text-sm mb-1" 
                    />
                    <span class="text-[9px] font-medium text-gray-900 text-center">{{ distance === 'close-up' ? 'Close-up' : distance === 'full-body' ? 'Full Body' : distance.charAt(0).toUpperCase() + distance.slice(1) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Generate Custom Image Button -->
          <div v-if="backgroundPreview || imageSettings.position !== 'standing' || imageSettings.cameraFocus !== 'full-body' || imageSettings.cameraAngle !== 'front' || imageSettings.cameraDistance !== 'medium'" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <button
              @click="generateCustomMannequinImage"
              :disabled="isGeneratingCustomImage"
              class="w-full px-4 py-3 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span v-if="isGeneratingCustomImage" class="animate-spin">⏳</span>
              <font-awesome-icon v-else :icon="['fas', 'magic']" />
              <span>{{ isGeneratingCustomImage ? 'Generating Custom Image...' : 'Generate Custom Image' }}</span>
            </button>
            <p class="text-xs text-gray-700 mt-2 text-center">Generate a new image with your custom settings</p>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click="goToStep(3)"
              class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Previous
            </button>
            <div class="flex gap-2">
              <button
                @click="goToStep(5)"
                class="px-4 py-2 bg-gray-500 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Skip to Audio
              </button>
              <button
                @click="goToStep(5)"
                class="px-4 py-2 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Next: Audio Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Audio Configuration -->
        <div v-if="videoCreationStep === 5" class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Audio Configuration</h3>
          
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="videoSettings.generateAudio"
                class="w-5 h-5 text-blue-600 bg-white border border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span class="font-medium text-gray-900">Generate Audio</span>
                <p class="text-xs text-gray-700">Include voice narration in the video</p>
              </div>
            </label>
          </div>

          <div v-if="videoSettings.generateAudio" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-800 mb-2">
                What the mannequin will say <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="videoPromptData.dialogue"
                rows="3"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                placeholder="Enter what the mannequin will say in the video. Example: 'This product is amazing! I love how it feels and looks.'"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click="goToStep(3)"
              class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Previous
            </button>
            <button
              @click="goToStep(6)"
              :disabled="videoSettings.generateAudio && !videoPromptData.dialogue.trim()"
              class="px-4 py-2 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              Next: Video Settings
            </button>
          </div>
        </div>

        <!-- Video Settings -->
        <div v-if="videoCreationStep === 6" class="space-y-4">
          <h3 class="text-base font-semibold text-gray-900 mb-4">Video Settings</h3>
          
          <!-- Video Title -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">
              Video Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="videoTitle"
              type="text"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter a title for this video"
            />
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Duration</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="dur in [4, 6, 8]"
                :key="dur"
                @click="videoSettings.duration = dur"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium',
                  videoSettings.duration === dur
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                {{ dur }}s
              </button>
            </div>
          </div>

          <!-- Resolution -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Resolution</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="res in ['720p', '1080p', '4k']"
                :key="res"
                @click="videoSettings.resolution = res"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium',
                  videoSettings.resolution === res
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                {{ res }}
              </button>
            </div>
          </div>

          <!-- Aspect Ratio -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Orientation</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="videoSettings.aspectRatio = '9:16'"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium flex items-center justify-center space-x-2',
                  videoSettings.aspectRatio === '9:16'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                <font-awesome-icon :icon="['fas', 'mobile']" />
                <span>Vertical (9:16)</span>
              </button>
              <button
                @click="videoSettings.aspectRatio = '16:9'"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium flex items-center justify-center space-x-2',
                  videoSettings.aspectRatio === '16:9'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                <font-awesome-icon :icon="['fas', 'desktop']" />
                <span>Horizontal (16:9)</span>
              </button>
            </div>
          </div>

          <!-- Model Type -->
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">AI Model Type</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="videoSettings.modelType = 'fast'"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium',
                  videoSettings.modelType === 'fast'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                Veo 3.1 Fast
              </button>
              <button
                @click="videoSettings.modelType = 'normal'"
                :class="[
                  'px-3 py-2 rounded-lg border-2 transition-all font-medium',
                  videoSettings.modelType === 'normal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                ]"
              >
                Veo 3.1
              </button>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click="goToStep(5)"
              class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Previous
            </button>
            <button
              @click="generateVideoFromTemplate"
              :disabled="isGeneratingVideo || !videoTitle.trim()"
              class="px-6 py-2 bg-blue-600 border border-blue-700 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <span v-if="isGeneratingVideo" class="animate-spin">⏳</span>
              <span>{{ isGeneratingVideo ? 'Generating...' : 'Generate Video' }}</span>
            </button>
          </div>
        </div>
                </div>
              </Transition>
            </div>
        </div>
        </div>
      </div>
    </Transition>

    <!-- Hub pop-up: choose Studio / Audio / Create Video after mannequin image is generated -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showHubModal && selectedPresentationForVideo"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click.self="showHubModal = false"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div
            class="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 max-w-lg w-full hub-modal-content"
            role="dialog"
            aria-labelledby="hub-modal-title"
            @click.stop
          >
            <div class="flex items-center justify-between mb-5">
              <h2 id="hub-modal-title" class="text-lg font-semibold text-gray-900">What would you like to do next?</h2>
              <button
                type="button"
                @click="showHubModal = false"
                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
              <button
                type="button"
                @click="goToStep(4); showHubModal = false"
                class="video-hub-btn group flex flex-col items-center justify-center w-[150px] h-[150px] rounded-2xl border-2 border-slate-200 bg-white text-gray-900 shadow-md hover:border-blue-400 hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out"
              >
                <font-awesome-icon :icon="['fas', 'image']" class="text-4xl text-blue-600 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span class="text-sm font-semibold text-center px-1">Studio</span>
                <span class="text-xs text-gray-500 mt-0.5">Background & position</span>
                <span class="text-[10px] text-gray-500 mt-1.5 px-1 leading-tight text-center">Studio adjustments are recommended for better mannequin quality.</span>
              </button>
              <button
                type="button"
                @click="goToStep(5); showHubModal = false"
                class="video-hub-btn group flex flex-col items-center justify-center w-[150px] h-[150px] rounded-2xl border-2 border-slate-200 bg-white text-gray-900 shadow-md hover:border-amber-400 hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out"
              >
                <font-awesome-icon :icon="['fas', 'bullhorn']" class="text-4xl text-amber-600 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span class="text-sm font-semibold text-center px-1">Audio Settings</span>
                <span class="text-xs text-gray-500 mt-0.5">Voice & sound</span>
              </button>
              <button
                type="button"
                @click="goToStep(6); showHubModal = false"
                class="video-hub-btn group flex flex-col items-center justify-center w-[150px] h-[150px] rounded-2xl border-2 border-slate-200 bg-white text-gray-900 shadow-md hover:border-emerald-500 hover:shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out"
              >
                <font-awesome-icon :icon="['fas', 'video']" class="text-4xl text-emerald-600 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span class="text-sm font-semibold text-center px-1">Create Video</span>
                <span class="text-xs text-gray-500 mt-0.5">Settings & generate</span>
              </button>
            </div>
            <!-- Generated image preview below buttons (3x larger: was max-h-48 ≈ 12rem, now max-h-[36rem]) -->
            <div v-if="generatedMannequinImage" class="mt-6 pt-4 border-t border-gray-200">
              <p class="text-xs font-medium text-gray-600 mb-2 text-center">Generated image</p>
              <div class="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-[36rem] flex justify-center">
                <img
                  :src="generatedMannequinImage"
                  alt="Generated mannequin image"
                  class="max-h-[36rem] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Create from Template Box -->
    <div v-if="!loading && !selectedMannequin && !selectedPresentationForVideo" class="flex items-center justify-center py-12 sm:py-16 lg:py-24 relative z-0">
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-8 sm:p-12 lg:p-16 max-w-2xl w-full relative overflow-hidden">
        <div class="relative flex flex-col items-center text-center space-y-6">
          <!-- Icon -->
          <div 
            @click="openTemplatesModal"
            class="cursor-pointer bg-blue-100 border border-blue-300 p-6 sm:p-8 lg:p-10 rounded-full shadow-lg hover:scale-105 transition-all duration-300 hover:bg-blue-200"
          >
            <font-awesome-icon :icon="['fas', 'user-plus']" class="text-4xl sm:text-5xl lg:text-6xl text-blue-600" />
          </div>
          
          <!-- Title -->
          <div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Create from Template
            </h2>
            <p class="text-sm sm:text-base text-slate-600 font-medium">
              Click the icon above to browse approved templates
            </p>
          </div>
          
          <!-- Tips/Description -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 w-full text-left">
            <div class="flex items-start space-x-3">
              <div class="bg-blue-100 border border-blue-200 p-2 rounded-lg flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-blue-600 text-lg" />
              </div>
              <div class="flex-1">
                <h3 class="text-sm sm:text-base font-semibold text-slate-800 mb-2">How it works:</h3>
                <ol class="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li class="flex items-start space-x-2">
                    <span class="font-semibold text-blue-600">1.</span>
                    <span>Select an approved mannequin template from the gallery</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="font-semibold text-blue-600">2.</span>
                    <span>Upload your product image and choose how it will be used (presentable or wearable)</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="font-semibold text-blue-600">3.</span>
                    <span>Generate a mannequin image with your product (optional: customize background, position, and camera settings)</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="font-semibold text-blue-600">4.</span>
                    <span>Configure audio settings and video parameters, then generate your product video</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Modal -->
    <div
      v-if="showTemplatesModal"
      @click.self="showTemplatesModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/50"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div class="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg sm:text-xl font-bold text-slate-800">
              Templates
            </h3>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="goToCreateMannequin"
                class="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-700 hover:bg-blue-500/30 transition-all duration-300 font-medium text-sm"
                title="Criar manequim"
              >
                <font-awesome-icon :icon="['fas', 'user-plus']" class="text-base sm:text-lg" />
                <span class="hidden sm:inline">Create Mannequin</span>
              </button>
              <button
                @click="showTemplatesModal = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-gray-700" />
              </button>
            </div>
          </div>
          <!-- Tabs: Template Standard | Own Templates -->
          <div class="flex gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200">
            <button
              type="button"
              :class="[
                'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                templateTab === 'approved'
                  ? 'bg-white text-blue-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
              @click="templateTab = 'approved'"
            >
              Template Standard
            </button>
            <button
              type="button"
              :class="[
                'flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                templateTab === 'own'
                  ? 'bg-white text-indigo-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
              @click="switchToOwnTemplates"
            >
              Own Templates
            </button>
          </div>
        </div>

        <div class="p-4 sm:p-6">
          <!-- Template Standard tab -->
          <template v-if="templateTab === 'approved'">
            <div v-if="mannequins.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div class="p-4 sm:p-6 rounded-full backdrop-blur-sm bg-slate-500/10 border border-slate-400/20 mb-3 sm:mb-4">
                <font-awesome-icon :icon="['fas', 'user']" class="text-3xl sm:text-4xl text-slate-400" />
              </div>
              <p class="text-base sm:text-lg font-semibold text-slate-700 mb-2">No standard templates</p>
              <p class="text-xs sm:text-sm text-slate-600">Standard templates will be available here</p>
            </div>
            <div v-else class="relative flex items-center gap-2">
              <button
                type="button"
                :disabled="!canPrevApproved"
                @click="carouselPrevApproved"
                class="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all"
                aria-label="Anterior"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-lg" />
              </button>
              <div class="flex-1 min-w-0 grid grid-cols-6 gap-2 sm:gap-3">
                <div
                  v-for="mannequin in visibleApprovedMannequins"
                  :key="mannequin.id"
                  @click="selectTemplate(mannequin)"
                  class="group relative cursor-pointer backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl shadow-2xl transform hover:scale-[1.02] hover:bg-white/40 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-12 h-12 bg-blue-400/20 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-blue-400/30 transition-all z-10"></div>
                  <div class="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50 flex items-center justify-center">
                    <img
                      v-if="mannequin.fullBodyImageUrl || mannequin.generatedImage"
                      :src="mannequin.fullBodyImageUrl || mannequin.generatedImage"
                      :alt="mannequin.name"
                      class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      @error="handleImageError($event)"
                    />
                    <div v-else class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-4 rounded-full shadow-lg">
                      <font-awesome-icon :icon="['fas', 'user']" class="text-2xl text-blue-600" />
                    </div>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="backdrop-blur-sm bg-white/30 rounded-full p-2 border border-white/40">
                          <font-awesome-icon :icon="['fas', 'check-circle']" class="text-xl text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-2 relative z-10">
                    <p class="font-semibold text-slate-800 text-xs truncate" :title="mannequin.name">
                      {{ mannequin.name }}
                    </p>
                    <p class="text-[10px] text-slate-600 mt-0.5 capitalize">
                      {{ mannequin.type }}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                :disabled="!canNextApproved"
                @click="carouselNextApproved"
                class="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all"
                aria-label="Próximo"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-lg" />
              </button>
            </div>
            <p v-if="mannequins.length > 0" class="text-center text-xs text-gray-500 mt-2">
              {{ Math.min(approvedCarouselPage * MANNEQUINS_PER_PAGE + 1, mannequins.length) }}-{{ Math.min((approvedCarouselPage + 1) * MANNEQUINS_PER_PAGE, mannequins.length) }} de {{ mannequins.length }}
            </p>
          </template>

          <!-- Own Templates tab: user mannequins → click opens Studio Products (presentations) -->
          <template v-else>
            <div v-if="loadingOwnMannequins" class="flex items-center justify-center py-12 sm:py-16">
              <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-indigo-500"></div>
            </div>
            <div v-else-if="ownMannequins.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div class="p-4 sm:p-6 rounded-full backdrop-blur-sm bg-indigo-500/10 border border-indigo-400/20 mb-3 sm:mb-4">
                <font-awesome-icon :icon="['fas', 'user']" class="text-3xl sm:text-4xl text-indigo-400" />
              </div>
              <p class="text-base sm:text-lg font-semibold text-slate-700 mb-2">No own templates</p>
              <p class="text-xs sm:text-sm text-slate-600">Create mannequins in Model Mannequin to see them here and use their Studio Products</p>
            </div>
            <div v-else class="relative flex items-center gap-2">
              <button
                type="button"
                :disabled="!canPrevOwn"
                @click="carouselPrevOwn"
                class="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all"
                aria-label="Anterior"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-lg" />
              </button>
              <div class="flex-1 min-w-0 grid grid-cols-6 gap-2 sm:gap-3">
                <div
                  v-for="mannequin in visibleOwnMannequins"
                  :key="mannequin.id"
                  @click="selectTemplate(mannequin)"
                  class="group relative cursor-pointer backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl shadow-2xl transform hover:scale-[1.02] hover:bg-white/40 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-12 h-12 bg-indigo-400/20 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-indigo-400/30 transition-all z-10"></div>
                  <div class="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50 flex items-center justify-center">
                    <img
                      v-if="mannequin.fullBodyImageUrl || mannequin.generatedImage"
                      :src="mannequin.fullBodyImageUrl || mannequin.generatedImage"
                      :alt="mannequin.name"
                      class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      @error="handleImageError($event)"
                    />
                    <div v-else class="backdrop-blur-sm bg-indigo-500/20 border border-indigo-400/30 p-4 rounded-full shadow-lg">
                      <font-awesome-icon :icon="['fas', 'user']" class="text-2xl text-indigo-600" />
                    </div>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="backdrop-blur-sm bg-white/30 rounded-full p-2 border border-white/40">
                          <font-awesome-icon :icon="['fas', 'images']" class="text-xl text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="absolute top-1.5 right-1.5 z-20">
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm bg-indigo-500/20 text-indigo-700 border border-indigo-400/30 shadow">
                        Own
                      </span>
                    </div>
                  </div>
                  <div class="p-2 relative z-10">
                    <p class="font-semibold text-slate-800 text-xs truncate" :title="mannequin.name">
                      {{ mannequin.name }}
                    </p>
                    <p class="text-[10px] text-slate-600 mt-0.5 capitalize">
                      {{ mannequin.type || 'Mannequin' }}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                :disabled="!canNextOwn"
                @click="carouselNextOwn"
                class="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-all"
                aria-label="Próximo"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-lg" />
              </button>
            </div>
            <p v-if="ownMannequins.length > 0" class="text-center text-xs text-gray-500 mt-2">
              {{ Math.min(ownCarouselPage * MANNEQUINS_PER_PAGE + 1, ownMannequins.length) }}-{{ Math.min((ownCarouselPage + 1) * MANNEQUINS_PER_PAGE, ownMannequins.length) }} de {{ ownMannequins.length }}
            </p>
          </template>
        </div>
      </div>
    </div>

    <!-- Creations Grid -->
    <div v-if="selectedMannequin && !selectedPresentationForVideo" class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 relative z-20">
      <div class="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <h2 class="text-lg sm:text-xl font-semibold text-slate-800">
          Creations ({{ allCreations.length }})
        </h2>
        <div class="relative flex-1 sm:flex-none min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full pl-9 pr-3 py-1.5 sm:py-2 text-sm backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 placeholder-slate-500"
          />
          <font-awesome-icon
            :icon="['fas', 'search']"
            class="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm pointer-events-none"
          />
        </div>
      </div>

      <div v-if="loadingPresentations" class="flex items-center justify-center py-12 sm:py-16">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-blue-500"></div>
      </div>

      <div v-else-if="filteredCreations.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
        <div class="p-4 sm:p-6 rounded-full backdrop-blur-sm bg-slate-500/10 border border-slate-400/20 mb-3 sm:mb-4">
          <font-awesome-icon :icon="['fas', 'images']" class="text-3xl sm:text-4xl text-slate-400" />
        </div>
        <p class="text-base sm:text-lg font-semibold text-slate-700 mb-2">No creations found</p>
        <p class="text-xs sm:text-sm text-slate-600">
          {{ searchQuery ? 'Try adjusting your search' : 'This template doesn\'t have approved creations yet' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          v-for="creation in filteredCreations"
          :key="`${creation.type}-${creation.id}`"
          @click="viewCreation(creation)"
          class="group relative cursor-pointer rounded-xl overflow-hidden backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <!-- Thumbnail -->
          <div class="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50">
            <!-- Video -->
            <div v-if="creation.type === 'video' && creation.videoUrl" class="w-full h-full relative">
              <video
                :src="creation.videoUrl"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                muted
                preload="metadata"
              ></video>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="backdrop-blur-sm bg-black/40 rounded-full p-3 sm:p-4 border border-white/40">
                  <font-awesome-icon :icon="['fas', 'play-circle']" class="text-3xl sm:text-4xl text-white" />
                </div>
              </div>
            </div>
            <!-- Image -->
            <img
              v-else-if="creation.imageUrl"
              :src="creation.imageUrl"
              :alt="creation.title || creation.productName"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              @error="handleImageError($event)"
            />
            <!-- Fallback -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="backdrop-blur-sm bg-white/30 rounded-full p-6 border border-white/40">
                <font-awesome-icon 
                  :icon="creation.type === 'video' ? ['fas', 'video'] : creation.type === 'control-motion' ? ['fas', 'film'] : ['fas', 'image']" 
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
                    : creation.type === 'control-motion'
                    ? 'bg-emerald-500/20 text-emerald-700 border-emerald-400/30'
                    : 'bg-blue-500/20 text-blue-700 border-blue-400/30'
                ]"
              >
                {{ creation.type === 'video' ? 'Product Clip' : creation.type === 'control-motion' ? 'Control Motion' : 'Product Thumb' }}
              </span>
            </div>
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="backdrop-blur-sm bg-white/30 rounded-full p-3 border border-white/40">
                  <font-awesome-icon :icon="['fas', 'eye']" class="text-2xl text-white" />
                </div>
              </div>
            </div>
          </div>
          <!-- Creation info -->
          <div class="p-2 sm:p-3">
            <p class="font-semibold text-slate-800 text-xs sm:text-sm truncate" :title="creation.title || creation.productName || 'Unnamed'">
              {{ creation.title || creation.productName || 'Unnamed Creation' }}
            </p>
            <p class="text-xs text-slate-600 mt-0.5 sm:mt-1">
              {{ formatDate(creation.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- View Creation Modal -->
    <div
      v-if="viewingCreation"
      @click.self="viewingCreation = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="p-4 sm:p-6 border-b border-white/20 flex items-center justify-between">
          <h3 class="text-base sm:text-xl font-bold text-slate-800 truncate pr-2">
            {{ viewingCreation.title || viewingCreation.productName || 'Creation' }}
          </h3>
          <button
            @click="viewingCreation = null"
            class="p-2 hover:bg-white/40 rounded-lg transition-all duration-300 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-slate-600" />
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <div v-if="viewingCreation.type === 'video' && viewingCreation.videoUrl" class="w-full mb-4">
            <video
              :src="viewingCreation.videoUrl"
              controls
              class="w-full rounded-xl shadow-lg"
            ></video>
          </div>
          <div v-else-if="viewingCreation.imageUrl" class="w-full mb-4">
            <img
              :src="viewingCreation.imageUrl"
              :alt="viewingCreation.title || viewingCreation.productName"
              class="w-full rounded-xl shadow-lg"
            />
          </div>
          <div class="space-y-2 text-sm text-slate-600">
            <p v-if="viewingCreation.productDescription">
              <strong>Description:</strong> {{ viewingCreation.productDescription }}
            </p>
            <p><strong>Type:</strong> {{ viewingCreation.type === 'video' ? 'Product Clip' : viewingCreation.type === 'control-motion' ? 'Control Motion' : viewingCreation.presentationType || 'Product Thumb' }}</p>
            <p><strong>Created at:</strong> {{ formatDate(viewingCreation.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Thumb Selection Modal -->
    <div
      v-if="showProductThumbModal"
      @click.self="closeProductThumbModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/50"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <!-- Modal Header -->
        <div class="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 class="text-lg sm:text-xl font-bold text-slate-800">
            Step 1: Select a Product Thumb
          </h3>
          <button
            @click="closeProductThumbModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-gray-700" />
          </button>
        </div>

        <div class="p-4 sm:p-6">
          <p class="text-sm text-slate-600 mb-6">Choose a product thumb to create a video from</p>
          
          <div v-if="loadingPresentations" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-blue-500"></div>
          </div>
          
          <div v-else-if="availablePresentations.length === 0" class="text-center py-8">
            <div class="p-6 rounded-full backdrop-blur-sm bg-slate-500/10 border border-slate-400/20 mb-4 inline-block">
              <font-awesome-icon :icon="['fas', 'image']" class="text-4xl text-slate-400" />
            </div>
            <p class="text-base font-semibold text-slate-700 mb-2">No product thumbs available</p>
            <p class="text-sm text-slate-600 mb-6">This template doesn't have any product thumbs yet</p>
            <!-- Use own mannequin image when no products (Own Templates only) -->
            <div
              v-if="selectedMannequinForVideo && (selectedMannequinForVideo.fullBodyImageUrl || selectedMannequinForVideo.generatedImage)"
              @click="useOwnMannequinImageAsPresentation"
              class="inline-block cursor-pointer group"
            >
              <div class="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-[200px] mx-auto hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <div class="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                  <img
                    :src="selectedMannequinForVideo.fullBodyImageUrl || selectedMannequinForVideo.generatedImage"
                    :alt="selectedMannequinForVideo.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-blue-600">
                      <font-awesome-icon :icon="['fas', 'check']" class="text-xl" />
                    </span>
                  </div>
                </div>
                <p class="text-sm font-semibold text-slate-800">Use mannequin image</p>
                <p class="text-xs text-slate-500 mt-0.5">Create video from this template image</p>
              </div>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            <div
              v-for="presentation in availablePresentations"
              :key="presentation.id"
              @click="selectPresentationForVideo(presentation)"
              class="group relative cursor-pointer backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl transform hover:scale-105 hover:bg-white/40 transition-all duration-300 overflow-hidden"
            >
              <!-- Background decoration -->
              <div class="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-purple-400/20 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-purple-400/30 transition-all"></div>
              <div class="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50 z-10">
                <img
                  v-if="presentation.imageUrl"
                  :src="presentation.imageUrl"
                  :alt="presentation.productName"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 p-4 sm:p-6 rounded-full shadow-lg">
                    <font-awesome-icon :icon="['fas', 'image']" class="text-3xl sm:text-4xl text-purple-600" />
                  </div>
                </div>
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="backdrop-blur-sm bg-white/30 rounded-full p-3 border border-white/40">
                      <font-awesome-icon :icon="['fas', 'check-circle']" class="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-2 sm:p-3 relative z-10">
                <p class="text-xs sm:text-sm font-semibold text-slate-800 truncate" :title="presentation.productName">
                  {{ presentation.productName || 'Unnamed' }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <button
              @click="closeProductThumbModal"
              class="px-4 py-2 backdrop-blur-sm bg-white/20 border border-white/40 text-slate-700 rounded-lg hover:bg-white/30 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Media Modal -->
    <div
      v-if="showGeneratedMediaModal"
      @click.self="showGeneratedMediaModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="p-4 sm:p-6 border-b border-white/20 flex items-center justify-between sticky top-0 bg-white/30 backdrop-blur-sm z-10">
          <h3 class="text-base sm:text-xl font-bold text-slate-800 truncate pr-2">
            {{ generatedMediaTitle || (generatedMediaType === 'video' ? 'Video Generated' : 'Image Generated') }}
          </h3>
          <button
            @click="showGeneratedMediaModal = false"
            class="p-2 hover:bg-white/40 rounded-lg transition-all duration-300 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-slate-600" />
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <div v-if="generatedMediaType === 'video' && generatedMediaUrl" class="w-full mb-4">
            <video
              :src="generatedMediaUrl"
              controls
              class="w-full rounded-xl shadow-lg"
            ></video>
          </div>
          <div v-else-if="generatedMediaType === 'image' && generatedMediaUrl" class="w-full mb-4">
            <img
              :src="generatedMediaUrl"
              alt="Generated image"
              class="w-full rounded-xl shadow-lg"
            />
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button
              v-if="generatedMediaType === 'video'"
              @click="handleVideoModalClose"
              class="px-4 py-2 bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-lg hover:bg-blue-500/40 transition-all"
            >
              Close & Continue
            </button>
            <button
              @click="showGeneratedMediaModal = false"
              class="px-4 py-2 bg-white/20 border border-white/40 text-slate-700 rounded-lg hover:bg-white/30 transition-all"
            >
              Close
            </button>
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
import { useAuth } from '~/composables/useAuth'

const {
  fetchApprovedMannequins,
  fetchMannequins,
  fetchPresentationsByMannequin,
  fetchVideosByMannequin,
  fetchControlMotionVideosByMannequin
} = useBackendStorage()

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'
const { user } = useAuth()

// Estado
const loading = ref(false)
const loadingPresentations = ref(false)
const mannequins = ref([])
const selectedMannequin = ref(null)
const allCreations = ref([])
const viewingCreation = ref(null)
const searchQuery = ref('')

// Templates Modal State
const showTemplatesModal = ref(false)
const templateTab = ref('approved') // 'approved' | 'own'
const ownMannequins = ref([])
const loadingOwnMannequins = ref(false)
const MANNEQUINS_PER_PAGE = 6
const approvedCarouselPage = ref(0)
const ownCarouselPage = ref(0)

const visibleApprovedMannequins = computed(() => {
  const start = approvedCarouselPage.value * MANNEQUINS_PER_PAGE
  return mannequins.value.slice(start, start + MANNEQUINS_PER_PAGE)
})
const visibleOwnMannequins = computed(() => {
  const start = ownCarouselPage.value * MANNEQUINS_PER_PAGE
  return ownMannequins.value.slice(start, start + MANNEQUINS_PER_PAGE)
})
const canPrevApproved = computed(() => approvedCarouselPage.value > 0)
const canNextApproved = computed(() => (approvedCarouselPage.value + 1) * MANNEQUINS_PER_PAGE < mannequins.value.length)
const canPrevOwn = computed(() => ownCarouselPage.value > 0)
const canNextOwn = computed(() => (ownCarouselPage.value + 1) * MANNEQUINS_PER_PAGE < ownMannequins.value.length)

const carouselPrevApproved = () => {
  if (canPrevApproved.value) approvedCarouselPage.value--
}
const carouselNextApproved = () => {
  if (canNextApproved.value) approvedCarouselPage.value++
}
const carouselPrevOwn = () => {
  if (canPrevOwn.value) ownCarouselPage.value--
}
const carouselNextOwn = () => {
  if (canNextOwn.value) ownCarouselPage.value++
}

// Product Thumb Selection Modal State
const showProductThumbModal = ref(false)

// Video Creation Modal State
const showVideoCreationModal = ref(false)
const selectedMannequinForVideo = ref(null)
const availablePresentations = ref([])
const selectedPresentationForVideo = ref(null)
const videoCreationStep = ref(1)
const stepDirection = ref('next') // 'next' | 'prev' for slide transition direction
const goToStep = (step) => {
  stepDirection.value = step > videoCreationStep.value ? 'next' : 'prev'
  videoCreationStep.value = step
}
const stepTransitionName = computed(() => `step-${stepDirection.value}`)
const creationSteps = [
  { step: 1, label: 'Upload', icon: ['fas', 'upload'] },
  { step: 2, label: 'Product Type', icon: ['fas', 'hand-holding'] },
  { step: 3, label: 'Generate Image', icon: ['fas', 'image'] },
  { step: 4, label: 'Studio', icon: ['fas', 'palette'] },
  { step: 5, label: 'Audio', icon: ['fas', 'bullhorn'] },
  { step: 6, label: 'Video', icon: ['fas', 'video'] },
]
const isGeneratingVideo = ref(false)
const videoTitle = ref('')
const uploadedProductImage = ref(null)
const productImageInput = ref(null)
const productType = ref(null) // 'presentable' or 'wearable'
const generatedMannequinImage = ref(null) // Imagem gerada do manequim com o produto
const isGeneratingImage = ref(false)
const backgroundPreview = ref(null)
const backgroundBase64 = ref(null)
const backgroundInput = ref(null)
const imageSettings = ref({
  position: 'standing', // 'standing', 'sitting', or 'streamer'
  cameraFocus: 'full-body', // 'face', 'hands', 'fps', 'back', 'full-body', 'upper-body', 'lower-body'
  cameraAngle: 'front', // 'front', 'side', 'three-quarter', 'low-angle', 'high-angle', 'bird-eye', 'worm-eye'
  cameraDistance: 'medium', // 'close-up', 'medium', 'full-body', 'wide'
})
const isGeneratingCustomImage = ref(false)
const showGeneratedMediaModal = ref(false)
const showHubModal = ref(false) // Pop-up to choose Studio / Audio / Create Video after mannequin image is generated
const showLeftColumnPromptContext = ref(false)
const generatedMediaType = ref(null) // 'image' or 'video'
const generatedMediaUrl = ref(null)
const generatedMediaTitle = ref(null)
const videoPromptData = ref({
  scene: '',
  dialogue: '',
  product: {
    name: '',
  },
})
const videoSettings = ref({
  duration: 4,
  resolution: '720p',
  aspectRatio: '9:16',
  modelType: 'fast',
  generateAudio: false,
})

// Toast state
const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Filtrar criações
const filteredCreations = computed(() => {
  if (!searchQuery.value) return allCreations.value
  
  const query = searchQuery.value.toLowerCase()
  return allCreations.value.filter(c =>
    (c.title && c.title.toLowerCase().includes(query)) ||
    (c.productName && c.productName.toLowerCase().includes(query)) ||
    (c.productDescription && c.productDescription.toLowerCase().includes(query))
  )
})

// Helper functions
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

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Ações
const selectMannequin = async (mannequin) => {
  selectedMannequin.value = mannequin
  loadingPresentations.value = true
  searchQuery.value = ''
  
  try {
    // Fetch all types of creations in parallel
    const [presentations, videos, controlMotionVideos] = await Promise.all([
      fetchPresentationsByMannequin(mannequin.id),
      fetchVideosByMannequin(mannequin.id),
      fetchControlMotionVideosByMannequin(mannequin.id)
    ])
    
    // Combine all creations with type identifier
    // Todas as criações já vêm da collection VitriniCreation (apenas aprovadas)
    const allPresentations = presentations.map(p => ({
      ...p,
      type: 'presentation',
      title: p.productName,
      imageUrl: p.generatedImageUrl || p.generatedImage
    }))
    
    const allVideos = videos.map(v => ({
      ...v,
      type: 'video',
      videoUrl: v.generatedVideoUrl
    }))
    
    const allControlMotion = controlMotionVideos.map(v => ({
      ...v,
      type: 'control-motion',
      videoUrl: v.generatedVideoUrl || v.generatedVideo
    }))
    
    // Combine and sort by creation date
    allCreations.value = [...allPresentations, ...allVideos, ...allControlMotion]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
  } catch (error) {
    console.error('Error loading creations:', error)
    alert('Error loading creations. Please try again.')
  } finally {
    loadingPresentations.value = false
  }
}

// Open templates modal
const openTemplatesModal = () => {
  templateTab.value = 'approved'
  approvedCarouselPage.value = 0
  ownCarouselPage.value = 0
  showTemplatesModal.value = true
}

// Navigate to Create Mannequin page (Model Mannequin)
const goToCreateMannequin = () => {
  showTemplatesModal.value = false
  const activeMenu = useState('activeMenu')
  if (activeMenu) activeMenu.value = 'model-mannequin'
  navigateTo({ path: '/app', query: { menu: 'model-mannequin' } }, { replace: true })
}

// Switch to Own Templates tab and load user mannequins
const switchToOwnTemplates = async () => {
  templateTab.value = 'own'
  if (ownMannequins.value.length === 0 && !loadingOwnMannequins.value) {
    loadingOwnMannequins.value = true
    try {
      ownMannequins.value = await fetchMannequins()
    } catch (error) {
      console.error('Error loading own mannequins:', error)
      ownMannequins.value = []
    } finally {
      loadingOwnMannequins.value = false
    }
  }
}

// Select template from modal
const selectTemplate = async (mannequin) => {
  showTemplatesModal.value = false
  selectedMannequinForVideo.value = mannequin
  showProductThumbModal.value = true
  loadingPresentations.value = true
  
  try {
    // Load presentations for this mannequin
    const presentations = await fetchPresentationsByMannequin(mannequin.id)
    availablePresentations.value = presentations.map(p => ({
      ...p,
      imageUrl: p.generatedImageUrl || p.generatedImage
    }))
  } catch (error) {
    console.error('Error loading presentations:', error)
    alert('Error loading product thumbs. Please try again.')
  } finally {
    loadingPresentations.value = false
  }
}

// Close product thumb modal
const closeProductThumbModal = () => {
  showProductThumbModal.value = false
  selectedMannequinForVideo.value = null
  availablePresentations.value = []
}

// Use own mannequin image as presentation when template has no product thumbs (Own Templates)
const useOwnMannequinImageAsPresentation = () => {
  if (!selectedMannequinForVideo.value) return
  const mannequin = selectedMannequinForVideo.value
  const imageUrl = mannequin.fullBodyImageUrl || mannequin.generatedImage
  if (!imageUrl) return
  const syntheticPresentation = {
    id: null,
    imageUrl,
    productName: mannequin.name || 'Mannequin image',
    productDescription: '',
  }
  selectPresentationForVideo(syntheticPresentation)
}

// Open video creation modal (deprecated - now using product thumb modal)
const openVideoCreationModal = async (mannequin) => {
  // This function is kept for backward compatibility but redirects to product thumb modal
  await selectTemplate(mannequin)
}

// Close video creation modal (deprecated - kept for compatibility)
const closeVideoCreationModal = () => {
  showVideoCreationModal.value = false
  closeProductThumbModal()
}

// Select presentation for video
const selectPresentationForVideo = (presentation) => {
  selectedPresentationForVideo.value = presentation
  // Close product thumb modal and show center box
  showProductThumbModal.value = false
  videoCreationStep.value = 1
  
  // Pre-fill product name if available
  if (presentation.productName) {
    videoPromptData.value.product.name = presentation.productName
  }
  // Pre-fill video title
  if (presentation.productName) {
    videoTitle.value = `${presentation.productName} - Product Video`
  }
  
  // Reset other fields
  uploadedProductImage.value = null
  productType.value = null
  generatedMannequinImage.value = null
  backgroundPreview.value = null
  backgroundBase64.value = null
  imageSettings.value = {
    position: 'standing',
    cameraFocus: 'full-body',
    cameraAngle: 'front',
    cameraDistance: 'medium',
  }
  videoPromptData.value.scene = ''
  videoPromptData.value.dialogue = ''
}

// Handle product image upload
const handleProductImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('Image size must be less than 10MB')
    return
  }
  
  // Read file as data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedProductImage.value = e.target.result
  }
  reader.onerror = () => {
    alert('Error reading image file')
  }
  reader.readAsDataURL(file)
}

// Subject for scene description based on mannequin gender (no product title in text)
const sceneSubject = () => {
  const g = selectedMannequinForVideo.value?.gender
  if (g === 'male') return 'A man'
  if (g === 'female') return 'A young woman'
  return 'The model'
}

// Select product type
const selectProductType = (type) => {
  productType.value = type
  const subject = sceneSubject()
  // Default scene: no product title/name inside the text
  if (type === 'presentable') {
    videoPromptData.value.scene = `${subject} holds the product up to camera and smiles naturally, showcasing the product's features and details in an authentic and engaging way.`
  } else if (type === 'wearable') {
    videoPromptData.value.scene = `${subject} wears and models the uploaded product. The mannequin must be wearing the exact product that was uploaded in the product image. Show different angles, movements, and poses to highlight how the product fits on the body, its style, texture, and overall appearance. The product should be clearly visible and properly fitted on the model.`
  }
}

// Generate mannequin image with product
const generateMannequinImage = async () => {
  if (!uploadedProductImage.value) {
    alert('Please upload a product image first')
    return
  }
  
  if (!productType.value) {
    alert('Please select a product type first')
    return
  }
  
  if (!selectedPresentationForVideo.value) {
    alert('Please select a product thumb first')
    return
  }

  isGeneratingImage.value = true
  
  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Mannequin Image'
  toastMessage.value = 'Creating an image of the mannequin with your product. This may take a moment...'
  toastProgress.value = 10

  try {
    // Get mannequin image from selected presentation
    const mannequinImageUrl = selectedPresentationForVideo.value.imageUrl
    if (!mannequinImageUrl) {
      throw new Error('Selected presentation has no image')
    }

    // Convert images to base64
    toastProgress.value = 20
    
    // Convert mannequin image to base64
    let mannequinImageBase64
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

    // Convert product image to base64
    toastProgress.value = 30
    let productImageBase64
    if (uploadedProductImage.value.includes('data:')) {
      productImageBase64 = uploadedProductImage.value.split(',')[1]
    } else {
      productImageBase64 = uploadedProductImage.value
    }

    // Determine presentation type based on product type
    const presentationType = productType.value === 'wearable' ? 'wear-product' : 'presentation-product'
    
    // Build prompt that maintains the same camera perspective and environment
    // Use format that backend recognizes as custom instructions
    // Only add/wear the product without changing the scene
    let prompt = `Generate a new professional image of this mannequin with the following specifications:
- CRITICAL: Maintain the EXACT same camera perspective, angle, distance, lighting, and background environment as shown in the original mannequin image (Image 1)
- DO NOT change the camera position, viewing angle, camera distance, background, lighting, or any environmental elements
- Preserve the exact same scene composition, background details, and overall visual context
- Camera focus: Keep the exact same focus and framing as the original image
- Camera angle: Maintain the exact same viewing angle as the original image
- Camera distance: Keep the exact same distance and framing as the original image
`
    
    if (productType.value === 'wearable') {
      prompt += `- The mannequin must be wearing the exact product from the uploaded image (Image 2), fitted naturally and seamlessly on the body
- The product should blend perfectly into the existing pose, maintaining the same body position and stance
- The product must be properly fitted and visible, but the pose, position, and environment must remain unchanged
`
    } else {
      prompt += `- The mannequin must be presenting the exact product from the uploaded image (Image 2) in hand, maintaining the exact same pose, hand position, and body stance
- The product should appear naturally in the hand without changing the original pose or position
- The hand position should accommodate the product while maintaining the original pose structure
`
    }
    
    prompt += `- Maintain the same facial expression, body position, pose, and overall appearance as the original
- The only change should be adding the product - everything else must remain identical to the original image
- High quality, professional photography style
- Suitable for e-commerce product presentation`

    toastProgress.value = 50
    
    // Call createProductPresentation mutation
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
            productImage: productImageBase64, // The uploaded product to add/wear
            presentationType: presentationType,
            productName: videoPromptData.value.product.name || 'Product',
            productDescription: prompt,
            mannequinId: selectedMannequinForVideo.value.id,
            modelPose: null, // Don't specify pose to maintain original
            handPosition: null, // Don't specify hand position to maintain original
            expression: null, // Don't specify expression to maintain original
            environmentType: null, // Don't specify environment to preserve original background
            blurBackground: false,
            imageOrientation: null, // Don't specify orientation to maintain original
          },
        },
      }),
    })

    if (response.errors) {
      console.error('[Image Generation] GraphQL errors:', response.errors)
      throw new Error(response.errors[0].message)
    }

    toastProgress.value = 80
    
    const generatedData = response.data.createProductPresentation
    const imageUrl = generatedData.generatedImageUrl || generatedData.generatedImage
    
    if (!imageUrl) {
      throw new Error('No image was generated')
    }

    generatedMannequinImage.value = imageUrl
    showHubModal.value = true

    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Image Generated Successfully!'
    toastMessage.value = 'The mannequin image has been generated. You can now proceed to create the video.'
    
    // Auto close toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Error generating mannequin image:', error)
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Generating Image'
    toastMessage.value = error.message || 'Failed to generate image. Please try again.'
    toastProgress.value = null
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } finally {
    isGeneratingImage.value = false
  }
}

// Handle background upload
const handleBackgroundUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    backgroundBase64.value = e.target.result
    backgroundPreview.value = e.target.result
  }
  reader.onerror = () => {
    alert('Error reading image file')
  }
  reader.readAsDataURL(file)
}

// Remove background
const removeBackground = () => {
  backgroundPreview.value = null
  backgroundBase64.value = null
  if (backgroundInput.value) {
    backgroundInput.value.value = ''
  }
}

// Convert image URL to base64 helper
const convertImageUrlToBase64 = async (imageUrl) => {
  if (!imageUrl) return null
  
  if (imageUrl.includes('data:')) {
    return imageUrl
  }
  
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
        throw new Error('Failed to download image')
      }
      
      const data = await response.json()
      return data.base64
    } catch (error) {
      console.error('Error downloading image:', error)
      throw new Error(`Failed to download image: ${error.message}`)
    }
  }
  
  return imageUrl
}

// Generate custom mannequin image with settings
const generateCustomMannequinImage = async () => {
  if (!generatedMannequinImage.value) {
    alert('Please generate the initial mannequin image first')
    return
  }

  isGeneratingCustomImage.value = true
  
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Custom Image'
  toastMessage.value = 'Creating a custom image with your settings. This may take a moment...'
  toastProgress.value = 10

  try {
    // Get the current generated image as base
    const baseImageUrl = generatedMannequinImage.value
    const mannequinImageBase64 = await convertImageUrlToBase64(baseImageUrl)
    
    // Convert background to base64 if provided
    let backgroundImageBase64 = null
    if (backgroundBase64.value) {
      backgroundImageBase64 = await convertImageUrlToBase64(backgroundBase64.value)
    }
    
    // Build prompt with settings
    let prompt = `Generate a new professional image of this mannequin with the following specifications:\n`
    
    const positionDescriptions = {
      'standing': 'standing upright',
      'sitting': 'sitting down in a chair',
      'streamer': 'sitting behind a desk/table with a microphone in front, in a streamer/content creator setup',
    }
    prompt += `- Position: ${positionDescriptions[imageSettings.value.position] || positionDescriptions['standing']}\n`
    
    const focusDescriptions = {
      'face': 'Close-up on the face, the face should be the main focus and clearly visible',
      'hands': 'Focus on the hands, hands should be prominently displayed and clearly visible',
      'full-body': 'Full body view showing the complete mannequin from head to toe',
      'upper-body': 'Upper body view from waist up, focusing on torso, arms, and face',
    }
    prompt += `- Camera focus: ${focusDescriptions[imageSettings.value.cameraFocus] || focusDescriptions['full-body']}\n`
    
    const angleDescriptions = {
      'front': 'Front view, camera directly in front of the mannequin',
      'side': 'Side view, camera positioned to the side (profile view)',
      'three-quarter': 'Three-quarter view, camera at a 45-degree angle showing both front and side',
      'low-angle': 'Low angle view, camera positioned below looking up',
    }
    prompt += `- Camera angle: ${angleDescriptions[imageSettings.value.cameraAngle] || angleDescriptions['front']}\n`
    
    const distanceDescriptions = {
      'close-up': 'Close-up shot, very close to the subject',
      'medium': 'Medium shot, showing the subject clearly with some surrounding space',
      'full-body': 'Full body shot, showing the complete subject from head to toe',
      'wide': 'Wide shot, showing the subject with plenty of surrounding environment',
    }
    prompt += `- Camera distance: ${distanceDescriptions[imageSettings.value.cameraDistance] || distanceDescriptions['medium']}\n`
    
    if (backgroundImageBase64) {
      prompt += `- Use the provided background reference image (Image 2) as the background environment\n`
      prompt += `- Replace the background of the mannequin image with the provided background reference\n`
      prompt += `- The mannequin should be seamlessly integrated into the new background\n`
    } else {
      prompt += `- CRITICAL: DO NOT change the background environment. Keep the EXACT same background as shown in the original mannequin image (Image 1).\n`
      prompt += `- Preserve ALL background details, colors, lighting, environmental elements, textures, and scene composition exactly as they appear in the original image.\n`
      prompt += `- The background must remain completely unchanged - only modify the mannequin's position, camera focus, angle, and distance according to the specifications above.\n`
      prompt += `- Maintain the exact same background context, environment, scene, and visual style from the original generated image.\n`
      prompt += `- The background in the output must be identical to the background in Image 1 - no changes whatsoever to the background.\n`
    }
    
    prompt += `- Maintain the same face and appearance from the original mannequin image\n`
    prompt += `- High quality, professional photography style\n`
    prompt += `- Suitable for e-commerce product presentation`

    toastProgress.value = 30

    // If the previous generation was with presentable product, keep that product in the new Studio image
    const hasPresentableProduct = productType.value === 'presentable' && uploadedProductImage.value
    if (hasPresentableProduct) {
      prompt += `\n- CRITICAL: The mannequin must be presenting the EXACT same product from the uploaded product image (Image 2) in hand. Keep the product visible and naturally held in the new position/pose. Do not remove or replace the product.\n`
    }

    // When no background is provided, we need to preserve the background from the original generated image
    // When background is provided, use it as the new background reference
    // When previous generation was presentable, pass the product image so the model keeps it in the new image
    let productImageBase64 = null
    let presentationType = 'wear-product'

    if (hasPresentableProduct) {
      // Maintain the presentable product from the previous generation in the new Studio image
      const productImg = uploadedProductImage.value
      if (productImg.startsWith('http://') || productImg.startsWith('https://')) {
        productImageBase64 = await convertImageUrlToBase64(productImg)
      } else {
        productImageBase64 = productImg.includes('data:') ? productImg.split(',')[1] : productImg
      }
      presentationType = 'presentation-product'
    } else if (backgroundImageBase64) {
      // If background is provided, use it as the new background
      productImageBase64 = backgroundImageBase64
      presentationType = 'presentation-product'
    } else {
      // If no background is provided, we still need to pass the original image to maintain context
      productImageBase64 = mannequinImageBase64
      presentationType = 'wear-product'
    }
    
    toastProgress.value = 50
    
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
            productName: videoPromptData.value.product.name || 'Product',
            productDescription: prompt,
            mannequinId: selectedMannequinForVideo.value.id,
            modelPose: imageSettings.value.position,
            handPosition: imageSettings.value.cameraFocus === 'hands' ? 'prominent' : 'natural',
            expression: imageSettings.value.cameraFocus === 'face' ? 'focused' : 'natural',
            environmentType: backgroundImageBase64 ? 'indoor' : null, // null to preserve original environment
            blurBackground: false,
            imageOrientation: 'vertical',
          },
        },
      }),
    })

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    toastProgress.value = 80
    
    const generatedData = response.data.createProductPresentation
    const imageUrl = generatedData.generatedImageUrl || generatedData.generatedImage
    
    if (!imageUrl) {
      throw new Error('No image was generated')
    }

    generatedMannequinImage.value = imageUrl
    
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Custom Image Generated!'
    toastMessage.value = 'Your custom image has been generated successfully.'
    
    // Show generated image in modal
    showGeneratedMediaModal.value = true
    generatedMediaType.value = 'image'
    generatedMediaUrl.value = imageUrl
    generatedMediaTitle.value = 'Custom Mannequin Image Generated'
    
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Error generating custom image:', error)
    
    toastType.value = 'error'
    toastTitle.value = 'Error Generating Image'
    toastMessage.value = error.message || 'Failed to generate custom image. Please try again.'
    toastProgress.value = null
    
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } finally {
    isGeneratingCustomImage.value = false
  }
}

// Open preview modal with the image from Left Column (product thumb or generated mannequin image)
const openPreviewThumbImage = () => {
  if (!selectedPresentationForVideo.value) return
  const url = generatedMannequinImage.value || selectedPresentationForVideo.value.imageUrl
  if (!url) return
  generatedMediaUrl.value = url
  generatedMediaType.value = 'image'
  generatedMediaTitle.value = generatedMannequinImage.value ? 'Mannequin Image' : (selectedPresentationForVideo.value.productName || 'Product Thumb')
  showGeneratedMediaModal.value = true
}

// Handle video modal close
const handleVideoModalClose = () => {
  showGeneratedMediaModal.value = false
  resetVideoCreation()
  // Reload creations if we're viewing a mannequin
  if (selectedMannequin.value && selectedMannequinForVideo.value && selectedMannequin.value.id === selectedMannequinForVideo.value.id) {
    selectMannequin(selectedMannequin.value)
  }
}

// Reset video creation
const resetVideoCreation = () => {
  selectedPresentationForVideo.value = null
  selectedMannequinForVideo.value = null
  videoCreationStep.value = 1
  uploadedProductImage.value = null
  productType.value = null
  generatedMannequinImage.value = null
  backgroundPreview.value = null
  backgroundBase64.value = null
  imageSettings.value = {
    position: 'standing',
    cameraFocus: 'full-body',
    cameraAngle: 'front',
    cameraDistance: 'medium',
  }
  showGeneratedMediaModal.value = false
  showHubModal.value = false
  generatedMediaType.value = null
  generatedMediaUrl.value = null
  generatedMediaTitle.value = null
  videoTitle.value = ''
  videoPromptData.value = {
    scene: '',
    dialogue: '',
    product: {
      name: '',
    },
  }
  videoSettings.value = {
    duration: 4,
    resolution: '720p',
    aspectRatio: '9:16',
    modelType: 'fast',
    generateAudio: false,
  }
}

// Build structured prompt JSON
const buildPromptFromStructuredData = () => {
  const data = videoPromptData.value
  
  const promptStructure = {
    prompt: {
      scene: data.scene.trim(),
      durationSeconds: videoSettings.value.duration,
      ...(data.product.name ? {
        product: {
          name: data.product.name.trim(),
        }
      } : {}),
      camera: {
        aspectRatio: videoSettings.value.aspectRatio,
      },
      ...(videoSettings.value.generateAudio && data.dialogue.trim() ? {
        audio: {
          voice: 'clear, friendly female voice, conversational tone',
          dialogue: data.dialogue.trim(),
        }
      } : {}),
    },
    config: {
      model: videoSettings.value.modelType === 'fast' ? 'veo-3.1-fast.image_to_video' : 'veo-3.1.image_to_video',
      imageInput: 'reference_image_here',
    },
  }
  
  return JSON.stringify(promptStructure, null, 2)
}

// Generate video from template
const generateVideoFromTemplate = async () => {
  if (!selectedPresentationForVideo.value) {
    alert('Please select a product thumb first')
    return
  }
  
  if (!generatedMannequinImage.value) {
    alert('Please generate the mannequin image first')
    return
  }
  
  if (!videoPromptData.value.scene.trim() || !videoTitle.value.trim()) {
    alert('Please fill in all required fields')
    return
  }
  
  if (videoSettings.value.generateAudio && !videoPromptData.value.dialogue.trim()) {
    alert('Please enter what the mannequin will say')
    return
  }

  isGeneratingVideo.value = true
  
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

    // Use the generated mannequin image instead of the original presentation
    if (!generatedMannequinImage.value) {
      throw new Error('Please generate the mannequin image first')
    }

    // Convert generated image to base64
    toastProgress.value = 30
    let imageBase64
    const generatedImage = generatedMannequinImage.value
    
    if (generatedImage.startsWith('http://') || generatedImage.startsWith('https://')) {
      // It's a URL, download through backend to avoid CORS
      try {
        const response = await fetch(`${API_URL}/api/download-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ url: generatedImage }),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to download generated image: ${response.statusText}`)
        }
        
        const data = await response.json()
        imageBase64 = data.base64
      } catch (error) {
        console.error('Error downloading generated image:', error)
        throw new Error(`Failed to download generated image: ${error.message}`)
      }
    } else if (generatedImage.includes('data:')) {
      // It's already a data URL, extract base64 part
      imageBase64 = generatedImage.split(',')[1]
    } else {
      // Assume it's already base64 without prefix
      imageBase64 = generatedImage
    }

    // Call backend GraphQL API
    toastProgress.value = 50
    const response = await $fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
            consistencyContext: null,
            duration: videoSettings.value.duration,
            resolution: videoSettings.value.resolution,
            aspectRatio: videoSettings.value.aspectRatio,
            modelType: videoSettings.value.modelType,
            generateAudio: videoSettings.value.generateAudio,
            presentationId: selectedPresentationForVideo.value.id ?? null,
            mannequinId: selectedMannequinForVideo.value.id,
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
    
    const videoData = response.data.createVideo
    const videoUrl = videoData.generatedVideoUrl || videoData.generatedVideo
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Product Clip Created Successfully!'
    toastMessage.value = `Your video is ${videoSettings.value.duration} seconds long at ${videoSettings.value.resolution} resolution.`
    
    // Show generated video in modal
    if (videoUrl) {
      showGeneratedMediaModal.value = true
      generatedMediaType.value = 'video'
      generatedMediaUrl.value = videoUrl
      generatedMediaTitle.value = videoTitle.value.trim() || 'Product Video Generated'
    }
    
    // Auto close toast after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
    
    // Reset after closing modal (user will close manually)
    // Don't auto-reset here, let user see the video first
  } catch (error) {
    console.error('Error creating video:', error)
    
    // Extract user-friendly error message
    let errorMessage = error.message || 'Unknown error occurred'
    
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
    isGeneratingVideo.value = false
  }
}

const goBack = () => {
  selectedMannequin.value = null
  allCreations.value = []
  searchQuery.value = ''
}

const viewCreation = (creation) => {
  viewingCreation.value = creation
}

// Carregar manequins aprovados
const loadMannequins = async () => {
  loading.value = true
  try {
    mannequins.value = await fetchApprovedMannequins()
  } catch (error) {
    console.error('Error loading approved mannequins:', error)
    alert('Error loading templates. Please try again.')
  } finally {
    loading.value = false
  }
}

// Load on mount
onMounted(() => {
  loadMannequins()
})
</script>

<style scoped>
.hub-fade-enter-active,
.hub-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.hub-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.hub-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Video creation box entrance */
.video-box-enter-active,
.video-box-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.video-box-enter-from,
.video-box-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.video-box-enter-to,
.video-box-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Step slide: next (go forward → new content from right) */
.step-next-enter-active,
.step-next-leave-active,
.step-prev-enter-active,
.step-prev-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.step-next-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-next-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.step-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.step-prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

/* Hub pop-up modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-active .hub-modal-content,
.modal-fade-leave-active .hub-modal-content {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .hub-modal-content,
.modal-fade-leave-to .hub-modal-content {
  transform: scale(0.92);
  opacity: 0;
}
.modal-fade-enter-active .video-hub-btn {
  animation: hub-btn-in 0.35s ease backwards;
}
.modal-fade-enter-active .video-hub-btn:nth-child(1) { animation-delay: 0.05s; }
.modal-fade-enter-active .video-hub-btn:nth-child(2) { animation-delay: 0.12s; }
.modal-fade-enter-active .video-hub-btn:nth-child(3) { animation-delay: 0.19s; }
@keyframes hub-btn-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Left column image switch (thumb ↔ generated) */
.thumb-fade-enter-active,
.thumb-fade-leave-active {
  transition: opacity 0.25s ease;
}
.thumb-fade-enter-from,
.thumb-fade-leave-to {
  opacity: 0;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 1.5s ease-in-out infinite;
}

/* Typography: Plus Jakarta Sans with improved hierarchy */
.vitrini-template h1 {
  letter-spacing: -0.025em;
  line-height: 1.2;
}
.vitrini-template h2,
.vitrini-template h3,
.vitrini-template h4 {
  letter-spacing: -0.02em;
  line-height: 1.3;
}
.vitrini-template p {
  line-height: 1.55;
}
</style>
