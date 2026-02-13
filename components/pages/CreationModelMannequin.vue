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
          <div class="backdrop-blur-sm bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'user-circle']" class="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent mb-1 flex items-center flex-wrap gap-2">
              <span>Model Mannequin</span>
              <span class="text-xs font-normal text-blue-700 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {{ mannequins.length }} {{ mannequins.length === 1 ? 'model' : 'models' }}
              </span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-1 sm:space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-blue-500 text-xs flex-shrink-0" />
              <span class="truncate">Create personalized mannequin models with AI</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            @click="openUploadMannequin"
            class="flex-1 sm:flex-none backdrop-blur-sm bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-emerald-500/40 hover:to-emerald-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'upload']" />
            <span class="hidden sm:inline">Upload Mannequin</span>
            <span class="sm:hidden">Upload</span>
          </button>
          <button
            @click="createNewMannequin"
            class="flex-1 sm:flex-none backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-blue-500/40 hover:to-blue-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-1 sm:space-x-2 font-semibold text-xs sm:text-sm"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
            <span class="hidden sm:inline">New Mannequin</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Criação -->
    <div
      v-if="showForm"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="cancelForm"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl flex-shrink-0 relative z-10">
          <div class="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div class="bg-blue-100 border border-blue-300 p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
              <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-blue-600 text-lg sm:text-2xl" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">Create New Model Mannequin</h2>
              <p class="text-gray-700 text-xs sm:text-sm font-medium hidden sm:block">Fill in the information step by step to generate your mannequin model</p>
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
        <div class="flex-1 overflow-y-auto p-3 sm:p-6">

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
                  ? 'bg-blue-500/30 border-blue-400/40 text-blue-700'
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
                :class="currentStep === index ? 'text-blue-700 font-semibold' : 'text-gray-700'"
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

      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Model Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="newMannequin.name"
            type="text"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500"
            placeholder="Ex: Summer Model 2024"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Gender <span class="text-red-500">*</span>
          </label>
          <select
            v-model="newMannequin.gender"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900"
          >
            <option value="">Select gender</option>
            <option value="male">Male (Homem)</option>
            <option value="female">Female (Mulher)</option>
            <option value="other">Other (Outro)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Clothing Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="newMannequin.type"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900"
          >
            <option value="">Select a type</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sporty">Sporty</option>
            <option value="elegant">Elegant</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Primary Color <span class="text-red-500">*</span>
          </label>
          <ColorPicker v-model="newMannequin.color" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="newMannequin.description"
            rows="3"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all resize-none text-gray-900 placeholder-gray-500"
            placeholder="Describe the model..."
          ></textarea>
        </div>
      </div>

      <!-- Step 2: Model Configuration -->
      <div v-if="currentStep === 1" class="space-y-4 sm:space-y-6">
        <!-- Model Type Selection -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Model Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <label
              class="relative flex flex-col items-center justify-center p-3 sm:p-6 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.modelType === 'realistic' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.modelType"
                type="radio"
                value="realistic"
                class="sr-only"
              />
              <div class="mb-2 sm:mb-3 text-2xl sm:text-4xl">
                <font-awesome-icon :icon="['fas', 'user']" class="text-blue-500" />
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-900 text-center">Realistic</span>
              <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1 text-center">Realista</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.modelType === 'plastic' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.modelType"
                type="radio"
                value="plastic"
                class="sr-only"
              />
              <div class="mb-3 text-4xl">
                <font-awesome-icon :icon="['fas', 'dolly']" class="text-gray-600" />
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">Plastic</span>
              <span class="text-xs text-gray-700 mt-1 text-center">Plástico</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.modelType === 'animation' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.modelType"
                type="radio"
                value="animation"
                class="sr-only"
              />
              <div class="mb-3 text-4xl">
                <font-awesome-icon :icon="['fas', 'palette']" class="text-purple-500" />
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">Animation</span>
              <span class="text-xs text-gray-700 mt-1 text-center">Animação</span>
            </label>
          </div>
        </div>

        <!-- Image Format Selection -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Image Format <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2 sm:gap-4">
            <label
              class="relative flex flex-col items-center justify-center p-3 sm:p-6 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.imageFormat === 'vertical' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.imageFormat"
                type="radio"
                value="vertical"
                class="sr-only"
              />
              <div class="w-12 h-18 sm:w-16 sm:h-24 border-2 border-gray-400 rounded bg-gradient-to-br from-gray-200 to-gray-300 mb-2 sm:mb-3 flex items-center justify-center">
                <div class="w-6 h-9 sm:w-8 sm:h-12 bg-blue-400 rounded"></div>
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-900">Vertical</span>
              <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1">9:16 (Portrait)</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.imageFormat === 'square' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.imageFormat"
                type="radio"
                value="square"
                class="sr-only"
              />
              <div class="w-20 h-20 border-2 border-gray-400 rounded bg-gradient-to-br from-gray-200 to-gray-300 mb-3 flex items-center justify-center">
                <div class="w-12 h-12 bg-blue-400 rounded"></div>
              </div>
              <span class="text-sm font-medium text-gray-900">Square</span>
              <span class="text-xs text-gray-700 mt-1">1:1 (Square)</span>
            </label>
          </div>
        </div>

        <!-- Body Type Selection -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Body Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.bodyType === 'full' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.bodyType"
                type="radio"
                value="full"
                class="sr-only"
              />
              <div class="w-12 h-20 border-2 border-gray-400 rounded bg-gradient-to-br from-gray-200 to-gray-300 mb-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div class="w-6 h-6 bg-blue-400 rounded-full absolute top-1"></div>
                <div class="w-8 h-8 bg-blue-400 rounded absolute top-8"></div>
                <div class="w-6 h-6 bg-blue-400 rounded absolute top-16"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">Full Body</span>
              <span class="text-xs text-gray-700 mt-1 text-center">Corpo Inteiro</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.bodyType === 'torso' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.bodyType"
                type="radio"
                value="torso"
                class="sr-only"
              />
              <div class="w-12 h-16 border-2 border-gray-400 rounded bg-gradient-to-br from-gray-200 to-gray-300 mb-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div class="w-6 h-6 bg-blue-400 rounded-full absolute top-1"></div>
                <div class="w-8 h-10 bg-blue-400 rounded absolute top-7"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">Torso Only</span>
              <span class="text-xs text-gray-700 mt-1 text-center">Apenas Tronco</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.bodyType === 'waist-up' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.bodyType"
                type="radio"
                value="waist-up"
                class="sr-only"
              />
              <div class="w-12 h-20 border-2 border-gray-400 rounded bg-gradient-to-br from-gray-200 to-gray-300 mb-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div class="w-6 h-6 bg-blue-400 rounded-full absolute top-1"></div>
                <div class="w-8 h-12 bg-blue-400 rounded absolute top-7"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 text-center">Waist Up</span>
              <span class="text-xs text-gray-700 mt-1 text-center">Da Cintura para Cima</span>
            </label>
          </div>
        </div>

        <!-- Style Selection (Studio vs UGC) -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Style <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2 sm:gap-4">
            <label
              class="relative flex flex-col items-center justify-center p-3 sm:p-6 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.style === 'studio' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.style"
                type="radio"
                value="studio"
                class="sr-only"
              />
              <div class="mb-2 sm:mb-3 text-2xl sm:text-4xl">
                <font-awesome-icon :icon="['fas', 'camera']" class="text-blue-500" />
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-900 text-center">Studio</span>
              <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1 text-center">Professional background</span>
            </label>
            <label
              class="relative flex flex-col items-center justify-center p-3 sm:p-6 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
              :class="newMannequin.style === 'ugc' 
                ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
            >
              <input
                v-model="newMannequin.style"
                type="radio"
                value="ugc"
                class="sr-only"
              />
              <div class="mb-2 sm:mb-3 text-2xl sm:text-4xl">
                <font-awesome-icon :icon="['fas', 'image']" class="text-emerald-500" />
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-900 text-center">UGC</span>
              <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1 text-center">Natural with background</span>
            </label>
          </div>
        </div>

        <!-- Body Description -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Body Description</h3>
          
          <!-- Body Build -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Body Build
            </label>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <label
                class="relative flex flex-col items-center justify-center p-2 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bodyBuild === 'slim' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bodyBuild"
                  type="radio"
                  value="slim"
                  class="sr-only"
                />
                <span class="text-xs sm:text-sm font-medium text-gray-900">Slim</span>
                <span class="text-[10px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1">Magro</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bodyBuild === 'athletic' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bodyBuild"
                  type="radio"
                  value="athletic"
                  class="sr-only"
                />
                <span class="text-sm font-medium text-gray-900">Athletic</span>
                <span class="text-xs text-gray-700 mt-1">Forte</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bodyBuild === 'curvy' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bodyBuild"
                  type="radio"
                  value="curvy"
                  class="sr-only"
                />
                <span class="text-sm font-medium text-gray-900">Curvy</span>
                <span class="text-xs text-gray-700 mt-1">Gordo/Curvilíneo</span>
              </label>
            </div>
          </div>

          <!-- Bust Description -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Bust Size
            </label>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <label
                class="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bustSize === 'small' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bustSize"
                  type="radio"
                  value="small"
                  class="sr-only"
                />
                <span class="text-sm font-medium text-gray-900">Small</span>
                <span class="text-xs text-gray-700 mt-1">Pequeno</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bustSize === 'medium' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bustSize"
                  type="radio"
                  value="medium"
                  class="sr-only"
                />
                <span class="text-sm font-medium text-gray-900">Medium</span>
                <span class="text-xs text-gray-700 mt-1">Médio</span>
              </label>
              <label
                class="relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
                :class="newMannequin.bustSize === 'large' 
                  ? 'border-blue-400/40 bg-blue-500/20 shadow-lg' 
                  : 'border-gray-200 bg-white/20 hover:border-white/60 hover:bg-white/30'"
              >
                <input
                  v-model="newMannequin.bustSize"
                  type="radio"
                  value="large"
                  class="sr-only"
                />
                <span class="text-sm font-medium text-gray-900">Large</span>
                <span class="text-xs text-gray-700 mt-1">Volumoso</span>
              </label>
            </div>
          </div>

          <!-- Additional Body Details -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Additional Body Details (Optional)
            </label>
            <textarea
              v-model="newMannequin.bodyDetails"
              rows="3"
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="e.g., toned arms, defined waist, long legs, etc."
            ></textarea>
            <p class="text-xs text-gray-700 mt-1 font-medium">Add any additional details about the body shape, proportions, or physical characteristics</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Face Upload & API Key -->
      <div v-if="currentStep === 2" class="space-y-6">
        <!-- Seleção de Face do Backend -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Face Image <span class="text-red-500">*</span>
          </label>
          <div v-if="loadingFaces" class="text-center py-8">
            <div class="animate-spin text-blue-500 text-2xl mb-2">⏳</div>
            <p class="text-sm text-gray-500">Loading faces...</p>
          </div>
          <div v-else-if="availableFaces.length > 0" class="space-y-4">
            <!-- Grid de Faces (4 por vez) -->
            <div class="relative">
              <!-- Botão Anterior -->
              <button
                v-if="currentFacePage > 0"
                @click="previousFacePage"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-blue-50 transition-all duration-300 border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-gray-700" />
              </button>

              <!-- Grid de 4 faces -->
              <div class="grid grid-cols-4 gap-3 p-2 bg-white border border-gray-200 rounded-xl">
                <div
                  v-for="face in paginatedFaces"
                  :key="face.id"
                  @click="selectFaceFromBackend(face)"
                  class="relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 bg-white"
                  :class="selectedFaceId === face.id ? 'border-blue-400/60 ring-2 ring-blue-400/30 shadow-lg' : 'border-gray-200 hover:border-white/60'"
                >
                  <img
                    :src="face.url"
                    :alt="face.filename"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div
                    v-if="selectedFaceId === face.id"
                    class="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center"
                  >
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>

              <!-- Botão Próximo -->
              <button
                v-if="hasNextFacePage"
                @click="nextFacePage"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-blue-50 transition-all duration-300 border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-gray-700" />
              </button>
            </div>

            <!-- Indicadores de Página -->
            <div v-if="totalFacePages > 1" class="flex items-center justify-center space-x-2">
              <button
                @click="goToFacePage(0)"
                :disabled="currentFacePage === 0"
                class="px-3 py-1 text-xs rounded-lg transition-all"
                :class="currentFacePage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                First
              </button>
              <div class="flex space-x-1">
                <div
                  v-for="page in visibleFacePages"
                  :key="page"
                  @click="goToFacePage(page)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all"
                  :class="currentFacePage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ page + 1 }}
                </div>
              </div>
              <button
                @click="goToFacePage(totalFacePages - 1)"
                :disabled="currentFacePage === totalFacePages - 1"
                class="px-3 py-1 text-xs rounded-lg transition-all"
                :class="currentFacePage === totalFacePages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                Last
              </button>
            </div>

            <!-- Contador de Faces -->
            <div class="text-center text-xs text-gray-500">
              Showing {{ currentFacePage * facesPerPage + 1 }} - {{ Math.min((currentFacePage + 1) * facesPerPage, availableFaces.length) }} of {{ availableFaces.length }} faces
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 text-sm">
            No faces available from backend. You can upload a face image locally below.
          </div>
          
          <!-- Upload Local de Face -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Or Upload Face Image Locally
            </label>
            <div class="flex items-center justify-center w-full">
              <label
                class="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50': faceImagePreview && !selectedFaceId }"
              >
                <div v-if="!faceImagePreview || selectedFaceId" class="flex flex-col items-center justify-center p-6">
                  <div class="bg-gray-200 rounded-full p-4 mb-3">
                    <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 text-4xl" />
                  </div>
                  <p class="mb-2 text-sm text-gray-500 text-center">
                    <span class="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 text-center">PNG, JPG, WEBP (MAX. 10MB)</p>
                </div>
                <div v-else class="relative w-full h-full">
                  <img :src="faceImagePreview" alt="Face preview" class="w-full h-full object-cover rounded-xl" />
                  <button
                    @click.stop="removeFaceImage"
                    class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />
                  </button>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  @change="handleFileUpload"
                />
              </label>
            </div>
            <p v-if="faceImagePreview && !selectedFaceId" class="text-xs text-green-600 mt-2 font-medium flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'check-circle']" />
              <span>Face image selected locally (will be used for mannequin generation)</span>
            </p>
          </div>
        </div>

        <!-- Google API Key (only for custom role) -->
        <div v-if="isCustomRole">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Google API Key <span class="text-red-500">*</span>
          </label>
          <input
            v-model="googleApiKey"
            type="password"
            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500"
            placeholder="Enter your Google Gemini API key"
          />
          <p class="text-xs text-gray-700 mt-1 font-medium">Your API key will be used to generate the mannequin image</p>
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
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Next</span>
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
              <button
                v-else
                @click="saveMannequin"
                :disabled="isGenerating"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <font-awesome-icon v-if="!isGenerating" :icon="['fas', 'shopping-bag']" />
                <span v-if="isGenerating" class="animate-spin">⏳</span>
                <span class="text-xs sm:text-base">{{ isGenerating ? 'Generating...' : 'Create Model (30 credits)' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carrossel de Mannequins -->
    <div v-if="displayedMannequins.length > 0 && mannequinGroups.length > 0" class="relative w-full flex-1 overflow-hidden flex flex-col relative z-10">
      <!-- Botão de Navegação Esquerda -->
      <button
        v-if="mannequinGroups.length > 1"
        @click="previousSlide"
        :disabled="currentSlideIndex === 0"
        class="absolute left-1 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-200 shadow-2xl hover:bg-white/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-400/40"
        :class="{ 'hover:scale-110': currentSlideIndex > 0 }"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-gray-800 text-sm sm:text-lg md:text-2xl" />
      </button>

      <!-- Container do Carrossel -->
      <div class="relative overflow-hidden w-full px-10 sm:px-12 md:px-16 flex-1 flex items-center">
        <div
          class="flex transition-transform duration-500 ease-in-out w-full h-full"
          :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
        >
          <div
            v-for="(group, groupIndex) in mannequinGroups"
            :key="groupIndex"
            class="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-full"
          >
            <div
              v-for="mannequin in group"
              :key="mannequin.id"
              class="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 flex flex-col h-full relative overflow-hidden group"
              :style="{ borderLeftColor: mannequin.color }"
            >
              <div class="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-400/20 transition-all"></div>
              <!-- Imagem de corpo inteiro - 4/5 da altura -->
              <div 
                class="w-full flex-[4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden group"
              >
                <img
                  v-if="mannequin.fullBodyImage"
                  :src="mannequin.fullBodyImage"
                  alt="Generated mannequin"
                  class="h-full w-auto object-contain"
                  style="min-width: 100%; min-height: 100%;"
                />
                <div v-else class="text-8xl opacity-50">👔</div>
                
                <!-- Thumbnail do rosto no canto -->
                <div
                  v-if="mannequin.faceThumbnail"
                  class="absolute bottom-2 right-2 w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white z-10"
                >
                  <img
                    :src="mannequin.faceThumbnail"
                    alt="Face thumbnail"
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- Badge do tipo de roupa -->
                <div
                  class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-lg z-10"
                  :style="{ backgroundColor: mannequin.color + '20', color: mannequin.color, border: `2px solid ${mannequin.color}40` }"
                >
                  {{ mannequin.type.charAt(0).toUpperCase() + mannequin.type.slice(1) }}
                </div>
                
                <!-- Ícone de camiseta -->
                <div
                  class="absolute bottom-2 left-2 w-12 h-12 rounded-full shadow-lg border-2 border-white flex items-center justify-center z-10"
                  :style="{ backgroundColor: mannequin.color }"
                >
                  <font-awesome-icon :icon="['fas', 'tshirt']" class="text-white text-sm" />
                </div>
              </div>
              
              <!-- Informações - 1/5 da altura -->
              <div class="flex-[1] p-3 flex flex-col justify-between backdrop-blur-sm bg-white/20 border-t border-gray-200 relative z-10">
                <!-- Nome e badges -->
                <div class="mb-2">
                  <h3 class="text-base font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-1.5 line-clamp-1">{{ mannequin.name }}</h3>
                  
                  <!-- Info Icons -->
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <!-- Model Type -->
                    <div 
                      v-if="mannequin.modelType"
                      class="flex items-center space-x-1.5 text-[10px] px-2 py-1 rounded-md font-medium"
                      :class="{
                        'bg-blue-50 text-blue-700 border border-blue-200': mannequin.modelType === 'realistic',
                        'bg-gray-100 text-gray-700 border border-gray-300': mannequin.modelType === 'plastic',
                        'bg-purple-50 text-purple-700 border border-purple-200': mannequin.modelType === 'animation'
                      }"
                      :title="mannequin.modelType === 'realistic' ? 'Realistic Model' : mannequin.modelType === 'plastic' ? 'Plastic Mannequin' : 'Animation Style'"
                    >
                      <font-awesome-icon 
                        :icon="['fas', mannequin.modelType === 'realistic' ? 'user' : mannequin.modelType === 'plastic' ? 'dolly' : 'palette']" 
                        :class="[
                          'text-[10px]',
                          mannequin.modelType === 'realistic' ? 'text-blue-500' : 
                          mannequin.modelType === 'plastic' ? 'text-gray-600' : 
                          'text-purple-500'
                        ]"
                      />
                      <span class="capitalize">{{ mannequin.modelType === 'realistic' ? 'Real' : mannequin.modelType === 'plastic' ? 'Plastic' : 'Anim' }}</span>
                    </div>
                    
                    <!-- Image Format -->
                    <div 
                      v-if="mannequin.imageFormat"
                      class="flex items-center space-x-1.5 text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-200 font-medium"
                      :title="mannequin.imageFormat === 'vertical' ? 'Vertical Format (9:16)' : 'Square Format (1:1)'"
                    >
                      <div 
                        class="flex items-center justify-center border-2 border-indigo-600 rounded bg-gradient-to-br from-indigo-200 to-indigo-300"
                        :class="mannequin.imageFormat === 'vertical' ? 'w-3 h-4' : 'w-3.5 h-3.5'"
                      >
                        <div 
                          class="bg-indigo-600 rounded"
                          :class="mannequin.imageFormat === 'vertical' ? 'w-1.5 h-2.5' : 'w-2 h-2'"
                        ></div>
                      </div>
                      <span class="capitalize">{{ mannequin.imageFormat === 'vertical' ? 'Vertical' : 'Square' }}</span>
                    </div>
                    
                    <!-- Body Type -->
                    <div 
                      v-if="mannequin.bodyType"
                      class="flex items-center space-x-1.5 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-200 font-medium"
                      :title="mannequin.bodyType === 'full' ? 'Full Body' : mannequin.bodyType === 'torso' ? 'Torso Only' : 'Waist Up'"
                    >
                      <div 
                        class="flex flex-col items-center justify-center relative overflow-hidden border-2 border-green-600 rounded bg-gradient-to-br from-green-200 to-green-300"
                        :class="{
                          'w-3 h-5': mannequin.bodyType === 'full',
                          'w-3 h-4': mannequin.bodyType === 'torso',
                          'w-3 h-5': mannequin.bodyType === 'waist-up'
                        }"
                      >
                        <!-- Full Body -->
                        <template v-if="mannequin.bodyType === 'full'">
                          <div class="w-1.5 h-1.5 bg-green-600 rounded-full absolute top-0.5"></div>
                          <div class="w-2 h-2 bg-green-600 rounded absolute top-2"></div>
                          <div class="w-1.5 h-1.5 bg-green-600 rounded absolute top-4"></div>
                        </template>
                        <!-- Torso Only -->
                        <template v-else-if="mannequin.bodyType === 'torso'">
                          <div class="w-1.5 h-1.5 bg-green-600 rounded-full absolute top-0.5"></div>
                          <div class="w-2 h-2.5 bg-green-600 rounded absolute top-1.5"></div>
                        </template>
                        <!-- Waist Up -->
                        <template v-else-if="mannequin.bodyType === 'waist-up'">
                          <div class="w-1.5 h-1.5 bg-green-600 rounded-full absolute top-0.5"></div>
                          <div class="w-2 h-3 bg-green-600 rounded absolute top-1.5"></div>
                        </template>
                      </div>
                      <span class="capitalize">{{ mannequin.bodyType === 'full' ? 'Full' : mannequin.bodyType === 'torso' ? 'Torso' : 'Waist' }}</span>
                    </div>
                  </div>
                </div>
                
                  <!-- Footer com data e ações -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div class="flex items-center space-x-1 text-[10px] text-gray-700 font-medium">
                    <font-awesome-icon :icon="['fas', 'credit-card']" class="text-[9px]" />
                    <span>{{ mannequin.createdAtDisplay || mannequin.createdAt }}</span>
                  </div>
                  <div class="flex space-x-1">
                    <button @click="viewFullImage(mannequin)" class="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details">
                      <font-awesome-icon :icon="['fas', 'eye']" class="text-xs" />
                    </button>
                    <button @click="downloadImage(mannequin)" class="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Download">
                      <font-awesome-icon :icon="['fas', 'download']" class="text-xs" />
                    </button>
                    <button @click="deleteMannequin(mannequin.id)" class="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão de Navegação Direita -->
      <button
        v-if="mannequinGroups.length > 1"
        @click="nextSlide"
        :disabled="currentSlideIndex === mannequinGroups.length - 1"
        class="absolute right-1 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-200 shadow-2xl hover:bg-white/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-400/40"
        :class="{ 'hover:scale-110': currentSlideIndex < mannequinGroups.length - 1 }"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-gray-800 text-sm sm:text-lg md:text-2xl" />
      </button>

      <!-- Indicadores de Página -->
      <div v-if="mannequinGroups.length > 1" class="flex items-center justify-center space-x-2 mt-4 flex-shrink-0">
        <div
          v-for="(group, index) in mannequinGroups"
          :key="index"
          @click="goToSlide(index)"
          class="cursor-pointer transition-all duration-300"
          :class="currentSlideIndex === index ? 'w-8 h-3 backdrop-blur-sm bg-blue-500/40 border border-blue-400/40 rounded-full' : 'w-3 h-3 backdrop-blur-sm bg-slate-300/40 border border-slate-300/40 hover:bg-slate-400/40 rounded-full'"
        ></div>
      </div>
    </div>

    <!-- Mensagem quando não há mannequins -->
    <div v-if="allMannequins.length === 0 && !showForm" class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 text-center flex-1 flex items-center justify-center relative z-10">
      <div class="backdrop-blur-sm bg-slate-200/40 border border-slate-300/40 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-slate-500 text-3xl sm:text-5xl" />
      </div>
      <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">No Model Mannequin created</h3>
      <p class="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto font-medium px-4">Start by creating your first mannequin model. It's quick and easy!</p>
      <button
        @click="createNewMannequin"
        class="backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 mx-auto text-sm sm:text-base"
      >
        <font-awesome-icon :icon="['fas', 'shopping-bag']" />
        <span>Create First Mannequin</span>
      </button>
    </div>

    <!-- Upload Mannequin Modal -->
    <div
      v-if="showUploadForm"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="cancelUploadForm"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl flex-shrink-0 relative z-10">
          <div class="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div class="bg-emerald-100 border border-emerald-300 p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
              <font-awesome-icon :icon="['fas', 'upload']" class="text-emerald-600 text-lg sm:text-2xl" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">Upload Mannequin</h2>
              <p class="text-gray-700 text-xs sm:text-sm font-medium hidden sm:block">Upload a mannequin image and configure its information</p>
            </div>
          </div>
          <button
            @click="cancelUploadForm"
            class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 flex-shrink-0"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6">
          <div class="space-y-4 sm:space-y-6">
            <!-- Upload Mannequin Image -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Mannequin Image Upload <span class="text-red-500">*</span>
              </label>
              <div class="mt-2 flex items-center justify-center w-full">
                <label
                  class="flex flex-col items-center justify-center w-full h-64 sm:h-96 border-2 border-gray-300 border-dashed rounded-lg sm:rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  :class="{ 'border-green-500 bg-green-50': uploadMannequinImagePreview }"
                >
                  <div v-if="!uploadMannequinImagePreview" class="flex flex-col items-center justify-center p-6">
                    <div class="bg-gray-200 rounded-full p-6 mb-4">
                      <font-awesome-icon :icon="['fas', 'image']" class="text-gray-400 text-6xl" />
                    </div>
                    <p class="mb-2 text-sm text-gray-500 text-center">
                      <span class="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 text-center">PNG, JPG, WEBP (MAX. 10MB)</p>
                  </div>
                  <div v-else class="relative w-full h-full">
                    <img :src="uploadMannequinImagePreview" alt="Mannequin preview" class="w-full h-full object-contain rounded-xl" />
                    <button
                      @click.stop="removeUploadMannequinImage"
                      class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <font-awesome-icon :icon="['fas', 'times']" />
                    </button>
                  </div>
                  <input
                    ref="uploadMannequinFileInput"
                    type="file"
                    class="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    @change="handleUploadMannequinFile"
                  />
                </label>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Model Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="uploadMannequinData.name"
                  type="text"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900 placeholder-gray-500"
                  placeholder="Ex: Summer Model 2024"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.gender"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male (Homem)</option>
                  <option value="female">Female (Mulher)</option>
                  <option value="other">Other (Outro)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Clothing Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.type"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="">Select a type</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="sporty">Sporty</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color <span class="text-red-500">*</span>
                </label>
                <ColorPicker v-model="uploadMannequinData.color" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Model Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.modelType"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="realistic">Realistic</option>
                  <option value="plastic">Plastic</option>
                  <option value="animation">Animation</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Image Format <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.imageFormat"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="vertical">Vertical (9:16)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Body Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.bodyType"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="full">Full Body</option>
                  <option value="torso">Torso Only</option>
                  <option value="waist-up">Waist Up</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Style <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="uploadMannequinData.style"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="studio">Studio (Professional background)</option>
                  <option value="ugc">UGC (Natural with background)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Body Build
                </label>
                <select
                  v-model="uploadMannequinData.bodyBuild"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="">Select build</option>
                  <option value="slim">Slim (Magro)</option>
                  <option value="athletic">Athletic (Forte)</option>
                  <option value="curvy">Curvy (Gordo/Curvilíneo)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bust Size
                </label>
                <select
                  v-model="uploadMannequinData.bustSize"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all text-gray-900"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (Pequeno)</option>
                  <option value="medium">Medium (Médio)</option>
                  <option value="large">Large (Volumoso)</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                v-model="uploadMannequinData.description"
                rows="3"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all resize-none text-gray-900 placeholder-gray-500"
                placeholder="Describe the model..."
              ></textarea>
            </div>

            <!-- Additional Body Details -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Additional Body Details (Optional)
              </label>
              <textarea
                v-model="uploadMannequinData.bodyDetails"
                rows="3"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/40 transition-all resize-none text-gray-900 placeholder-gray-500"
                placeholder="e.g., toned arms, defined waist, long legs, etc."
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <button
              @click="cancelUploadForm"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-800 hover:bg-white/40 transition-all duration-300 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              @click="saveUploadedMannequin"
              :disabled="!canSaveUploadedMannequin || isSavingUpload"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <font-awesome-icon v-if="!isSavingUpload" :icon="['fas', 'save']" />
              <span v-if="isSavingUpload" class="animate-spin">⏳</span>
              <span>{{ isSavingUpload ? 'Saving...' : 'Save Mannequin' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal for Full View -->
    <div
      v-if="showImageModal && selectedMannequin"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      @click.self="closeImageModal"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-t-xl sm:rounded-t-2xl relative z-10">
          <div class="min-w-0 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent truncate">{{ selectedMannequin.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 font-medium">{{ selectedMannequin.type }} • {{ selectedMannequin.color }}</p>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <button
              @click="downloadImage(selectedMannequin)"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-emerald-500/30 border border-emerald-400/40 text-emerald-700 rounded-lg sm:rounded-xl hover:bg-emerald-500/40 transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'download']" />
              <span>Download</span>
            </button>
            <button
              @click="closeImageModal"
              class="p-1.5 sm:p-2 text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-3 sm:p-6 relative z-10">
          <!-- Full Body Image -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Full Body Image</h4>
            <div class="bg-gray-100 rounded-xl overflow-hidden">
              <img
                v-if="selectedMannequin.fullBodyImage"
                :src="selectedMannequin.fullBodyImage"
                alt="Full body image"
                class="w-full h-auto"
              />
              <div v-else class="h-96 flex items-center justify-center text-gray-400">
                <font-awesome-icon :icon="['fas', 'image']" class="text-6xl" />
              </div>
            </div>
          </div>

          <!-- Face Thumbnail -->
          <div v-if="selectedMannequin.faceThumbnail" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Face Reference</h4>
            <div class="bg-gray-100 rounded-xl overflow-hidden inline-block">
              <img
                :src="selectedMannequin.faceThumbnail"
                alt="Face thumbnail"
                class="w-48 h-48 object-cover"
              />
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedMannequin.description" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <p class="text-gray-700 bg-gray-50 rounded-xl p-4">{{ selectedMannequin.description }}</p>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Type</p>
              <p class="font-semibold text-gray-900 capitalize">{{ selectedMannequin.type }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Color</p>
              <div class="flex items-center space-x-2">
                <div
                  class="w-6 h-6 rounded-full border-2 border-gray-300"
                  :style="{ backgroundColor: selectedMannequin.color }"
                ></div>
                <span class="font-semibold text-gray-900">{{ selectedMannequin.color }}</span>
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Created</p>
              <p class="font-semibold text-gray-900">{{ selectedMannequin.createdAt }}</p>
            </div>
            <div v-if="selectedMannequin.modelType" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Model Type</p>
              <p class="font-semibold text-gray-900 capitalize">
                {{ selectedMannequin.modelType === 'realistic' ? 'Realistic' : selectedMannequin.modelType === 'plastic' ? 'Plastic' : 'Animation' }}
              </p>
            </div>
            <div v-if="selectedMannequin.imageFormat" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Image Format</p>
              <p class="font-semibold text-gray-900 capitalize">{{ selectedMannequin.imageFormat === 'vertical' ? 'Vertical (9:16)' : 'Square (1:1)' }}</p>
            </div>
            <div v-if="selectedMannequin.bodyType" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Body Type</p>
              <p class="font-semibold text-gray-900 capitalize">
                {{ selectedMannequin.bodyType === 'full' ? 'Full Body' : selectedMannequin.bodyType === 'torso' ? 'Torso Only' : 'Waist Up' }}
              </p>
            </div>
            <div v-if="selectedMannequin.style" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Style</p>
              <p class="font-semibold text-gray-900 capitalize">
                {{ selectedMannequin.style === 'studio' ? 'Studio (Professional background)' : 'UGC (Natural with background)' }}
              </p>
            </div>
            <div v-if="selectedMannequin.bodyBuild" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Body Build</p>
              <p class="font-semibold text-gray-900 capitalize">
                {{ selectedMannequin.bodyBuild === 'slim' ? 'Slim (Magro)' : selectedMannequin.bodyBuild === 'athletic' ? 'Athletic (Forte)' : 'Curvy (Gordo/Curvilíneo)' }}
              </p>
            </div>
            <div v-if="selectedMannequin.bustSize" class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-1">Bust Size</p>
              <p class="font-semibold text-gray-900 capitalize">
                {{ selectedMannequin.bustSize === 'small' ? 'Small (Pequeno)' : selectedMannequin.bustSize === 'medium' ? 'Medium (Médio)' : 'Large (Volumoso)' }}
              </p>
            </div>
            <div v-if="selectedMannequin.bodyDetails" class="bg-gray-50 rounded-xl p-4 col-span-2">
              <p class="text-sm text-gray-600 mb-1">Additional Body Details</p>
              <p class="font-semibold text-gray-900">{{ selectedMannequin.bodyDetails }}</p>
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
const faceImageFile = ref(null)
const faceImagePreview = ref(null)
const googleApiKey = ref('')
const fileInput = ref(null)
const currentStep = ref(0)
const selectedFaceId = ref(null)
const availableFaces = ref([])
const loadingFaces = ref(false)
const currentFacePage = ref(0)
const facesPerPage = 4

// Toast state
const showToast = ref(false)
const toastType = ref('loading')
const toastTitle = ref('')
const toastMessage = ref('')
const toastProgress = ref(null)

// Upload mannequin state
const showUploadForm = ref(false)
const isSavingUpload = ref(false)
const uploadMannequinImageFile = ref(null)
const uploadMannequinImagePreview = ref(null)
const uploadMannequinFileInput = ref(null)
const uploadMannequinData = ref({
  name: '',
  type: '',
  color: '#3B82F6',
  description: '',
  gender: '',
  modelType: 'realistic',
  imageFormat: 'vertical',
  bodyType: 'full',
  bodyBuild: '',
  bustSize: '',
  bodyDetails: '',
  style: 'studio',
})

// Steps configuration
const steps = [
  { label: 'Basic Info', key: 'basic' },
  { label: 'Configuration', key: 'config' },
  { label: 'Upload & API', key: 'upload' },
]

// New mannequin data
const newMannequin = ref({
  name: '',
  type: '',
  color: '#3B82F6',
  description: '',
  gender: '', // 'male', 'female', or 'other'
  modelType: 'realistic', // 'realistic', 'plastic', or 'animation'
  imageFormat: 'vertical', // 'vertical' or 'square'
  bodyType: 'full', // 'full', 'torso', or 'waist-up'
  bodyBuild: '', // 'slim', 'athletic', or 'curvy'
  bustSize: '', // 'small', 'medium', or 'large'
  bodyDetails: '', // Additional body description
  style: 'studio', // 'studio' or 'ugc'
})

// Modal state for viewing full image
const showImageModal = ref(false)
const selectedMannequin = ref(null)

// Mannequins list - must be defined before computed properties
const mannequins = ref([])
const allMannequins = ref([]) // Store all loaded mannequins
const displayedMannequinsCount = ref(6) // Start with 6 mannequins
const isLoadingMore = ref(false)

// Carousel state
const currentSlideIndex = ref(0)

// Image movement state for interactive effect
const imageMovements = ref({})

// Computed property to get displayed mannequins (limited by displayedMannequinsCount)
const displayedMannequins = computed(() => {
  return allMannequins.value.slice(0, displayedMannequinsCount.value)
})

// Window size detection for responsive grouping
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth)
    updateWindowWidth()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

// Computed property to group mannequins - 1 per group on mobile, 3 per group on desktop
const mannequinGroups = computed(() => {
  if (!displayedMannequins.value || displayedMannequins.value.length === 0) {
    return []
  }
  const groups = []
  // Mobile (< 640px): 1 per group, Tablet (640-1024px): 2 per group, Desktop (> 1024px): 3 per group
  const itemsPerGroup = windowWidth.value < 640 ? 1 : windowWidth.value < 1024 ? 2 : 3
  for (let i = 0; i < displayedMannequins.value.length; i += itemsPerGroup) {
    groups.push(displayedMannequins.value.slice(i, i + itemsPerGroup))
  }
  return groups
})

// Computed properties for face pagination
const totalFacePages = computed(() => {
  return Math.ceil(availableFaces.value.length / facesPerPage)
})

const paginatedFaces = computed(() => {
  const start = currentFacePage.value * facesPerPage
  const end = start + facesPerPage
  return availableFaces.value.slice(start, end)
})

const hasNextFacePage = computed(() => {
  return currentFacePage.value < totalFacePages.value - 1
})

const visibleFacePages = computed(() => {
  const pages = []
  const total = totalFacePages.value
  const current = currentFacePage.value
  
  // Show max 5 page numbers
  let start = Math.max(0, current - 2)
  let end = Math.min(total - 1, current + 2)
  
  // Adjust if we're near the start
  if (current < 2) {
    end = Math.min(total - 1, 4)
  }
  
  // Adjust if we're near the end
  if (current > total - 3) {
    start = Math.max(0, total - 5)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Carousel navigation functions
const nextSlide = async () => {
  if (currentSlideIndex.value < mannequinGroups.value.length - 1) {
    currentSlideIndex.value++
    
    // Check if we're near the end (within 1 slide of the end)
    const remainingSlides = mannequinGroups.value.length - currentSlideIndex.value - 1
    if (remainingSlides <= 1 && displayedMannequinsCount.value < allMannequins.value.length) {
      // Load more mannequins
      await loadMoreMannequins()
    }
  }
}

const previousSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

const goToSlide = (index) => {
  if (index >= 0 && index < mannequinGroups.value.length) {
    currentSlideIndex.value = index
  }
}

// Watch displayedMannequins to update mannequins ref
watch(displayedMannequins, (newValue) => {
  mannequins.value = newValue
}, { immediate: true })

// Reset carousel when mannequins change significantly
watch(() => mannequinGroups.value.length, (newLength, oldLength) => {
  // Only reset if the number of groups decreased (e.g., after deletion)
  if (newLength < oldLength && currentSlideIndex.value >= newLength) {
    currentSlideIndex.value = Math.max(0, newLength - 1)
  }
})

// Load mannequins from backend
const loadMannequinsFromBackend = async (append = false) => {
  try {
    const loaded = await backendStorage.fetchMannequins()
    
    // Map backend data to frontend format
    const mappedMannequins = loaded.map(mannequin => ({
      ...mannequin,
      // Use GCS URL if available, otherwise fallback to generatedImage (base64)
      fullBodyImage: mannequin.fullBodyImageUrl || mannequin.generatedImage,
      faceThumbnail: mannequin.faceThumbnailUrl,
      createdAtDisplay: mannequin.createdAt ? new Date(mannequin.createdAt).toLocaleDateString('en-US') : null,
    }))
    
    if (append) {
      // Append new mannequins, avoiding duplicates
      const existingIds = new Set(allMannequins.value.map(m => m.id))
      const newMannequins = mappedMannequins.filter(m => !existingIds.has(m.id))
      allMannequins.value = [...allMannequins.value, ...newMannequins]
    } else {
      // Initial load - store all and display first 6
      allMannequins.value = mappedMannequins
      displayedMannequinsCount.value = Math.min(6, mappedMannequins.length)
    }
    
    // Update mannequins ref for compatibility
    mannequins.value = displayedMannequins.value
  } catch (error) {
    console.error('Error loading mannequins from backend:', error)
    // Fallback to localStorage if backend fails
    try {
      const ids = storage.getAllMannequinIds()
      const loadedMannequins = ids.map(id => {
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
      
      if (loadedMannequins.length > 0) {
        allMannequins.value = loadedMannequins
        displayedMannequinsCount.value = Math.min(6, loadedMannequins.length)
        mannequins.value = displayedMannequins.value
      }
    } catch (fallbackError) {
      console.error('Error loading mannequins from localStorage:', fallbackError)
    }
  }
}

// Load more mannequins (3 more)
const loadMoreMannequins = async () => {
  if (isLoadingMore.value) return
  if (displayedMannequinsCount.value >= allMannequins.value.length) return
  
  isLoadingMore.value = true
  try {
    // Increase displayed count by 3
    displayedMannequinsCount.value = Math.min(
      displayedMannequinsCount.value + 3,
      allMannequins.value.length
    )
    // Update mannequins ref
    mannequins.value = displayedMannequins.value
  } finally {
    isLoadingMore.value = false
  }
}

// Load on mount
onMounted(async () => {
  await loadMannequinsFromBackend()
  loadApiKeyFromStorage()
  // Faces are loaded only when the creation form is opened (in createNewMannequin)
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

// Handle file upload (local only, no backend upload)
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    faceImageFile.value = file
    selectedFaceId.value = null // Clear backend face selection when uploading new file
    const reader = new FileReader()
    reader.onload = (e) => {
      faceImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Remove face image
const removeFaceImage = () => {
  faceImageFile.value = null
  faceImagePreview.value = null
  selectedFaceId.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Load faces from backend
const loadFacesFromBackend = async () => {
  loadingFaces.value = true
  try {
    const fetchResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include', // Importante para enviar cookies de autenticação
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            faces {
              id
              filename
              url
              createdAt
            }
          }
        `,
      }),
    })

    const response = await fetchResponse.json()

    if (response.errors) {
      console.error('Error loading faces:', response.errors)
      alert('Error loading faces: ' + (response.errors[0]?.message || 'Unknown error'))
      return
    }

    if (response.data && response.data.faces) {
      availableFaces.value = response.data.faces
      console.log('✅ Loaded faces:', availableFaces.value.length, availableFaces.value)
    } else {
      console.warn('⚠️ No faces data in response:', response)
      availableFaces.value = []
    }
    
    // Reset to first page when loading new faces
    currentFacePage.value = 0
  } catch (error) {
    console.error('Error loading faces from backend:', error)
        alert(`Error loading faces from backend. Make sure the backend server is running on ${API_URL}`)
  } finally {
    loadingFaces.value = false
  }
}

// Face pagination functions
const nextFacePage = () => {
  if (currentFacePage.value < totalFacePages.value - 1) {
    currentFacePage.value++
  }
}

const previousFacePage = () => {
  if (currentFacePage.value > 0) {
    currentFacePage.value--
  }
}

const goToFacePage = (page) => {
  if (page >= 0 && page < totalFacePages.value) {
    currentFacePage.value = page
  }
}

// Handle image loading errors
const handleImageError = (event) => {
  console.error('Error loading face image:', event.target.src)
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E'
}

// Select face from backend
const selectFaceFromBackend = async (face) => {
  selectedFaceId.value = face.id
  faceImageFile.value = null
  faceImagePreview.value = face.url
  
  // Load the image as a file-like object for the API call
  try {
    const imageResponse = await fetch(face.url)
    const blob = await imageResponse.blob()
    const file = new File([blob], face.filename, { type: blob.type })
    faceImageFile.value = file
  } catch (error) {
    console.error('Error loading face image:', error)
    // Fallback: we'll use the URL directly in the API call
  }
}


// Step navigation
const nextStep = () => {
  // Validate current step before proceeding
  if (currentStep.value === 0) {
    // Validate step 1: Basic Info
    if (!newMannequin.value.name || !newMannequin.value.gender || !newMannequin.value.type || !newMannequin.value.color) {
      alert('Please fill in all required fields (Model Name, Gender, Clothing Type, Primary Color)')
      return
    }
  } else if (currentStep.value === 1) {
    // Validate step 2: Configuration
    if (!newMannequin.value.modelType || !newMannequin.value.imageFormat || !newMannequin.value.bodyType || !newMannequin.value.style) {
      alert('Please select Model Type, Image Format, Body Type, and Style')
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

// Create new mannequin
const createNewMannequin = () => {
  showForm.value = true
  currentStep.value = 0
  newMannequin.value = {
    name: '',
    type: '',
    color: '#3B82F6',
    description: '',
    modelType: 'realistic',
    imageFormat: 'vertical',
    bodyType: 'full',
    bodyBuild: '',
    bustSize: '',
    bodyDetails: '',
    style: 'studio',
  }
  removeFaceImage()
  // Load API key from storage when opening form
  loadApiKeyFromStorage()
  // Load faces from backend when opening form
  loadFacesFromBackend()
}

// View full image
const viewFullImage = (mannequin) => {
  selectedMannequin.value = mannequin
  showImageModal.value = true
}

// Close image modal
const closeImageModal = () => {
  showImageModal.value = false
  selectedMannequin.value = null
}

// Download image
const downloadImage = (mannequin) => {
  if (!mannequin.fullBodyImage) {
    alert('No image available to download')
    return
  }

  try {
    // Create a temporary anchor element
    const link = document.createElement('a')
    link.href = mannequin.fullBodyImage
    link.download = `${mannequin.name.replace(/\s+/g, '_')}_${mannequin.type}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading image:', error)
    alert('Error downloading image. Please try again.')
  }
}

// Cancel form
const cancelForm = () => {
  showForm.value = false
  currentStep.value = 0
  newMannequin.value = {
    name: '',
    type: '',
    color: '#3B82F6',
    description: '',
    gender: '',
    modelType: 'realistic',
    imageFormat: 'vertical',
    bodyType: 'full',
    bodyBuild: '',
    bustSize: '',
    bodyDetails: '',
    style: 'studio',
  }
  removeFaceImage()
  // Don't clear API key, keep it for next time
  // googleApiKey.value = ''
}

// Delete mannequin
const deleteMannequin = async (id) => {
  if (confirm('Are you sure you want to delete this mannequin?')) {
    try {
      // Try to delete from backend first
      await backendStorage.deleteMannequin(id)
    } catch (error) {
      console.error('Error deleting mannequin from backend:', error)
      // Fallback to localStorage if backend fails
      try {
        storage.deleteMannequin(id)
      } catch (fallbackError) {
        console.error('Error deleting mannequin from localStorage:', fallbackError)
      }
    }
    
    // Remove from list
    allMannequins.value = allMannequins.value.filter(m => m.id !== id)
    mannequins.value = displayedMannequins.value
    
    // Adjust displayed count if needed
    if (displayedMannequinsCount.value > allMannequins.value.length) {
      displayedMannequinsCount.value = allMannequins.value.length
    }
    
    // Remove movement state
    delete imageMovements.value[id]
  }
}

// Handle mouse move on image for interactive effect
const handleImageMove = (event, mannequinId) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const y = event.clientY - rect.top
  const height = rect.height
  const percentage = (y / height) * 100
  
  // Calculate transform: when cursor is at top (0%), image moves DOWN (+10%) to show top part
  // When cursor is at bottom (100%), image moves UP (-10%) to show bottom part
  // When cursor is at center (50%), image is at center (0%)
  // Inverted: cursor up = image down, cursor down = image up
  const translateY = -((percentage - 50) / 50) * 10 // Range from +10% to -10% (inverted)
  
  imageMovements.value[mannequinId] = {
    translateY: translateY
  }
}

// Handle mouse leave - reset image position
const handleImageLeave = (mannequinId) => {
  imageMovements.value[mannequinId] = {
    translateY: 0
  }
}

// Get image transform style
const getImageTransform = (mannequinId) => {
  const movement = imageMovements.value[mannequinId]
  if (!movement) {
    return { transform: 'translateY(0%)' }
  }
  return {
    transform: `translateY(${movement.translateY}%)`
  }
}

// Upload mannequin functions
const openUploadMannequin = () => {
  showUploadForm.value = true
  uploadMannequinData.value = {
    name: '',
    type: '',
    color: '#3B82F6',
    description: '',
    gender: '',
    modelType: 'realistic',
    imageFormat: 'vertical',
    bodyType: 'full',
    bodyBuild: '',
    bustSize: '',
    bodyDetails: '',
    style: 'studio',
  }
  removeUploadMannequinImage()
}

const cancelUploadForm = () => {
  showUploadForm.value = false
  uploadMannequinData.value = {
    name: '',
    type: '',
    color: '#3B82F6',
    description: '',
    gender: '',
    modelType: 'realistic',
    imageFormat: 'vertical',
    bodyType: 'full',
    bodyBuild: '',
    bustSize: '',
    bodyDetails: '',
    style: 'studio',
  }
  removeUploadMannequinImage()
}

const resetUploadForm = () => {
  uploadMannequinData.value = {
    name: '',
    type: '',
    color: '#3B82F6',
    description: '',
    modelType: 'realistic',
    imageFormat: 'vertical',
    bodyType: 'full',
    bodyBuild: '',
    bustSize: '',
    bodyDetails: '',
    style: 'studio',
  }
  removeUploadMannequinImage()
}

const handleUploadMannequinFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    uploadMannequinImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadMannequinImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeUploadMannequinImage = () => {
  uploadMannequinImageFile.value = null
  uploadMannequinImagePreview.value = null
  if (uploadMannequinFileInput.value) {
    uploadMannequinFileInput.value.value = ''
  }
}

const canSaveUploadedMannequin = computed(() => {
  return uploadMannequinImageFile.value &&
         uploadMannequinData.value.name &&
         uploadMannequinData.value.gender &&
         uploadMannequinData.value.type &&
         uploadMannequinData.value.color &&
         uploadMannequinData.value.modelType &&
         uploadMannequinData.value.imageFormat &&
         uploadMannequinData.value.bodyType &&
         uploadMannequinData.value.style
})

const saveUploadedMannequin = async () => {
  if (!canSaveUploadedMannequin.value) {
    alert('Please fill in all required fields and upload an image')
    return
  }

  isSavingUpload.value = true

  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Uploading Mannequin'
  toastMessage.value = 'Please wait while we upload your mannequin to the server...'
  toastProgress.value = 10

  try {
    // Convert image to base64
    toastProgress.value = 20
    let imageBase64
    if (uploadMannequinImageFile.value) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Keep the full data URL for now, backend will extract base64
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(uploadMannequinImageFile.value)
      })
    } else if (uploadMannequinImagePreview.value) {
      imageBase64 = uploadMannequinImagePreview.value
    } else {
      throw new Error('No image available to upload')
    }

    // Call backend GraphQL API
    toastProgress.value = 60
    const fetchResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include', // Importante para enviar cookies de autenticação
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation UploadMannequin($input: UploadMannequinInput!) {
            uploadMannequin(input: $input) {
              id
              userId
              name
              type
              color
              description
              modelType
              imageFormat
              bodyType
              bodyBuild
              bustSize
              bodyDetails
              gender
              generatedImage
              fullBodyImageUrl
              faceThumbnailUrl
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: {
            name: uploadMannequinData.value.name,
            type: uploadMannequinData.value.type,
            color: uploadMannequinData.value.color,
            description: (() => {
              const baseDescription = uploadMannequinData.value.description || ''
              const style = uploadMannequinData.value.style || 'studio'
              const styleContext = style === 'ugc' 
                ? 'Natural UGC style with realistic background environment. '
                : 'Professional studio style with clean background. '
              return styleContext + baseDescription
            })(),
            fullBodyImage: imageBase64,
            gender: uploadMannequinData.value.gender,
            modelType: uploadMannequinData.value.modelType || 'realistic',
            imageFormat: uploadMannequinData.value.imageFormat || 'vertical',
            bodyType: uploadMannequinData.value.bodyType || 'full',
            bodyBuild: uploadMannequinData.value.bodyBuild || '',
            bustSize: uploadMannequinData.value.bustSize || '',
            bodyDetails: uploadMannequinData.value.bodyDetails || '',
          },
        },
      }),
    })

    const response = await fetchResponse.json()

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    toastProgress.value = 80
    const generatedData = response.data.uploadMannequin
    const mannequinId = generatedData.id

    // Prepare mannequin data - use GCS URLs if available, otherwise use base64
    const mannequin = {
      id: mannequinId,
      userId: generatedData.userId,
      name: generatedData.name,
      type: generatedData.type,
      color: generatedData.color,
      description: generatedData.description,
      // Use GCS URL if available, otherwise fallback to base64
      fullBodyImage: generatedData.fullBodyImageUrl || generatedData.generatedImage,
      faceThumbnail: generatedData.faceThumbnailUrl,
      modelType: generatedData.modelType || uploadMannequinData.value.modelType || 'realistic',
      imageFormat: generatedData.imageFormat || uploadMannequinData.value.imageFormat || 'vertical',
      bodyType: generatedData.bodyType || uploadMannequinData.value.bodyType || 'full',
      bodyBuild: generatedData.bodyBuild || uploadMannequinData.value.bodyBuild || '',
      bustSize: generatedData.bustSize || uploadMannequinData.value.bustSize || '',
      bodyDetails: generatedData.bodyDetails || uploadMannequinData.value.bodyDetails || '',
      createdAt: generatedData.createdAt || new Date().toISOString(),
      createdAtDisplay: generatedData.createdAt ? new Date(generatedData.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
    }

    // Add to list (will be reloaded from backend on next mount)
    mannequins.value.unshift(mannequin)
    
    // Reload from backend to ensure we have the latest data
    toastProgress.value = 90
    await loadMannequinsFromBackend()
    
    cancelUploadForm()
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Mannequin Uploaded Successfully!'
    toastMessage.value = 'Your mannequin has been uploaded and saved to the server. It can now be used in other steps.'
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } catch (error) {
    console.error('Error uploading mannequin:', error)
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Uploading Mannequin'
    toastMessage.value = error.message || 'An error occurred while uploading the mannequin. Please try again.'
    toastProgress.value = null
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } finally {
    isSavingUpload.value = false
  }
}

// Save mannequin
const saveMannequin = async () => {
  if (!newMannequin.value.name || !newMannequin.value.type) {
    alert('Please fill in all required fields')
    return
  }

  if (!faceImageFile.value && !selectedFaceId.value) {
    alert('Please select or upload a face image')
    return
  }

  // Only validate API key for custom role users
  if (isCustomRole.value && !googleApiKey.value) {
    alert('Please enter your Google API key')
    return
  }

  isGenerating.value = true
  
  // Show loading toast
  showToast.value = true
  toastType.value = 'loading'
  toastTitle.value = 'Generating Model Mannequin'
  toastMessage.value = 'Please wait while we create your mannequin model with AI...'
  toastProgress.value = 10

  try {
    // Convert image to base64 (without data URL prefix)
    toastProgress.value = 20
    let base64Image
    if (faceImageFile.value) {
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(faceImageFile.value)
      })
    } else if (selectedFaceId.value) {
      // If a face was selected from backend, fetch it
      const selectedFace = availableFaces.value.find(f => f.id === selectedFaceId.value)
      if (selectedFace) {
        const imageResponse = await fetch(selectedFace.url)
        const blob = await imageResponse.blob()
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } else {
        throw new Error('Selected face not found')
      }
    } else {
      throw new Error('No face image available')
    }

    // Create thumbnail of face image
    // A função createThumbnail agora lida com URLs externas automaticamente
    toastProgress.value = 40
    const faceThumbnail = await storage.createThumbnail(faceImagePreview.value, 150, 150)

    // Call backend GraphQL API usando fetch nativo para garantir credenciais
    toastProgress.value = 60
    const fetchResponse = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include', // Importante para enviar cookies de autenticação
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateMannequin($input: CreateMannequinInput!) {
            createMannequin(input: $input) {
              id
              userId
              name
              type
              color
              description
              modelType
              imageFormat
              bodyType
              bodyBuild
              bustSize
              bodyDetails
              gender
              generatedImage
              fullBodyImageUrl
              faceThumbnailUrl
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: {
            name: newMannequin.value.name,
            type: newMannequin.value.type,
            color: newMannequin.value.color,
            description: (() => {
              const baseDescription = newMannequin.value.description || ''
              const style = newMannequin.value.style || 'studio'
              const styleContext = style === 'ugc' 
                ? 'Natural UGC style with realistic background environment. '
                : 'Professional studio style with clean background. '
              return styleContext + baseDescription
            })(),
            faceImage: base64Image,
            gender: newMannequin.value.gender,
            ...(isCustomRole.value && { googleApiKey: googleApiKey.value }), // Only include if custom role
            modelType: newMannequin.value.modelType || 'realistic',
            imageFormat: newMannequin.value.imageFormat || 'vertical',
            bodyType: newMannequin.value.bodyType || 'full',
            bodyBuild: newMannequin.value.bodyBuild || '',
            bustSize: newMannequin.value.bustSize || '',
            bodyDetails: newMannequin.value.bodyDetails || '',
          },
        },
      }),
    })

    const response = await fetchResponse.json()

    if (response.errors) {
      throw new Error(response.errors[0].message)
    }

    toastProgress.value = 80
    const generatedData = response.data.createMannequin
    const mannequinId = generatedData.id

    // Prepare mannequin data - use GCS URLs if available, otherwise use base64
    const mannequin = {
      id: mannequinId,
      userId: generatedData.userId,
      name: generatedData.name,
      type: generatedData.type,
      color: generatedData.color,
      description: generatedData.description,
      // Use GCS URL if available, otherwise fallback to base64
      fullBodyImage: generatedData.fullBodyImageUrl || generatedData.generatedImage,
      faceThumbnail: generatedData.faceThumbnailUrl,
      modelType: generatedData.modelType || newMannequin.value.modelType || 'realistic',
      imageFormat: generatedData.imageFormat || newMannequin.value.imageFormat || 'vertical',
      bodyType: generatedData.bodyType || newMannequin.value.bodyType || 'full',
      bodyBuild: generatedData.bodyBuild || newMannequin.value.bodyBuild || '',
      bustSize: generatedData.bustSize || newMannequin.value.bustSize || '',
      bodyDetails: generatedData.bodyDetails || newMannequin.value.bodyDetails || '',
      createdAt: generatedData.createdAt || new Date().toISOString(),
      createdAtDisplay: generatedData.createdAt ? new Date(generatedData.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
    }

    // Add to list (will be reloaded from backend on next mount)
    allMannequins.value.unshift(mannequin)
    // Update displayed count if needed
    if (displayedMannequinsCount.value < allMannequins.value.length) {
      displayedMannequinsCount.value = Math.min(displayedMannequinsCount.value + 1, 6)
    }
    mannequins.value = displayedMannequins.value
    
    // Reload from backend to ensure we have the latest data
    toastProgress.value = 90
    await loadMannequinsFromBackend(true) // Append mode
    showForm.value = false
    currentStep.value = 0
    removeFaceImage()
    googleApiKey.value = ''
    
    // Show success toast
    toastProgress.value = 100
    toastType.value = 'success'
    toastTitle.value = 'Model Mannequin Created!'
    toastMessage.value = 'Your mannequin model has been created successfully. 30 credits consumed.'
    
    // Auto close after 5 seconds
    setTimeout(() => {
      showToast.value = false
    }, 5000)
  } catch (error) {
    console.error('Error creating mannequin:', error)
    
    // Show error toast
    toastType.value = 'error'
    toastTitle.value = 'Error Creating Mannequin'
    toastMessage.value = error.message || 'An error occurred while creating the mannequin. Please try again.'
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
