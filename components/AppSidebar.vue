<template>
  <aside
    :class="[
      'backdrop-blur-xl bg-white/30 text-slate-800 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden',
      // Mobile: horizontal (bottom) - fixed at bottom
      'fixed bottom-0 left-0 right-0 z-50 flex-row items-center justify-center border-t border-white/40',
      'h-16',
      // Desktop layout - fixed at left
      'md:fixed md:top-0 md:left-0 md:bottom-0 md:right-auto',
      'md:border-r md:border-white/40 md:border-t-0',
      'md:h-auto md:flex md:flex-col',
      isMinimized ? 'md:w-20 md:min-w-[5rem] md:max-w-[5rem] w-full' : 'md:w-64 md:min-w-64 md:max-w-64 w-full'
    ]"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div class="absolute bottom-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
    </div>

    <!-- Logo/Header (Desktop only) -->
    <div class="hidden md:flex p-6 border-b border-white/30 items-center justify-between relative z-10">
      <div v-if="!isMinimized" class="flex-1">
        <img src="/logo_v.png" alt="VitrinAI" class="w-[60px] h-[60px] object-contain" />
      </div>
      <div v-else class="flex-1 flex justify-center">
        <div class="w-10 h-10 rounded-xl backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-lg overflow-hidden">
          <img src="/logo_v.png" alt="VitrinAI" class="w-full h-full object-contain p-1" />
        </div>
      </div>
      <button
        @click="toggleSidebar"
        class="p-2 hover:bg-white/40 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-white/30"
        :title="isMinimized ? 'Expandir' : 'Minimizar'"
      >
        <font-awesome-icon
          :icon="isMinimized ? ['fas', 'chevron-right'] : ['fas', 'chevron-left']"
          class="text-slate-700"
        />
      </button>
    </div>

    <!-- Menu Items - quando minimizado mostra apenas ícones -->
    <nav
      class="flex-1 p-2 md:p-4 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:min-h-0 md:min-w-0 relative z-10"
    >
      <ul class="flex md:flex-col flex-row space-x-2 md:space-x-0 md:space-y-2 items-center md:items-stretch md:min-w-0">
        <!-- Create (Featured - First Item) -->
        <li
          @click="selectMenu('vitrini-template')"
          :class="[
            'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 md:min-w-0',
            activeMenu === 'vitrini-template'
              ? 'backdrop-blur-sm bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-600/40 border-2 border-purple-400/60 text-purple-800 shadow-xl'
              : 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-600/20 text-slate-800 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-purple-600/30 hover:backdrop-blur-sm border-2 border-purple-400/40 hover:border-purple-400/60 shadow-lg hover:shadow-xl',
            isMinimized ? 'p-3 flex justify-center' : 'px-4 md:px-5 py-3 md:py-3.5'
          ]"
          :title="isMinimized ? 'Create' : ''"
        >
          <div :class="[isMinimized ? 'flex justify-center' : 'flex flex-col md:flex-row items-center justify-center md:justify-start', 'md:min-w-0']">
            <font-awesome-icon 
              :icon="['fas', 'magic']" 
              :class="[
                'flex-shrink-0 transition-all duration-300',
                isMinimized ? 'text-xl' : 'text-xl md:text-2xl',
                activeMenu === 'vitrini-template' ? 'text-purple-700 opacity-100' : 'text-purple-600 opacity-10'
              ]" 
            />
            <span v-if="!isMinimized" :class="['text-sm md:text-base md:ml-3 mt-0.5 md:mt-0 font-bold min-w-0 truncate', activeMenu === 'vitrini-template' ? 'text-purple-800' : 'text-purple-700']">
              Create
            </span>
          </div>
        </li>

        <!-- Vitrini Drive -->
        <li
          @click="selectMenu('vitrini-drive')"
          :class="[
            'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 md:min-w-0',
            activeMenu === 'vitrini-drive'
              ? 'backdrop-blur-sm bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 border border-indigo-400/40 text-indigo-700 shadow-lg'
              : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
            isMinimized ? 'p-3 flex justify-center' : 'px-3 md:px-4 py-2 md:py-3'
          ]"
          :title="isMinimized ? 'Vitrini Drive' : ''"
        >
          <div :class="[isMinimized ? 'flex justify-center' : 'flex flex-col md:flex-row items-center justify-center md:justify-start', 'md:min-w-0']">
            <font-awesome-icon 
              :icon="['fas', 'hdd']" 
              :class="[
                'flex-shrink-0 transition-all duration-300',
                isMinimized ? 'text-xl' : 'text-lg md:text-xl',
                activeMenu === 'vitrini-drive' ? 'text-indigo-600 opacity-100' : 'text-slate-600 opacity-10'
              ]" 
            />
            <span v-if="!isMinimized" :class="['text-xs md:text-base md:ml-3 mt-0.5 md:mt-0 font-medium min-w-0 truncate', activeMenu === 'vitrini-drive' ? 'text-indigo-700 font-semibold' : 'text-slate-700']">
              <span class="hidden md:inline">Vitrini Drive</span>
              <span class="md:hidden">Drive</span>
            </span>
          </div>
        </li>

        <!-- Account (Mobile) -->
        <li class="md:hidden relative">
          <button
            @click.stop="toggleAccountMobile"
            :class="[
              'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 w-full',
              showAccountMobile
                ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
              'px-3 py-2'
            ]"
            title="Account"
          >
            <div class="flex flex-col items-center justify-center">
              <font-awesome-icon 
                :icon="['fas', 'user-circle']" 
                :class="[
                  'text-lg transition-all duration-300',
                  showAccountMobile ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                ]" 
              />
              <span :class="['text-xs mt-0.5 font-medium', showAccountMobile ? 'text-blue-700 font-semibold' : 'text-slate-700']">Account</span>
            </div>
          </button>
          
          <!-- Mobile Submenu for Account -->
          <Teleport to="body">
            <transition name="slide-down">
              <div
                v-if="showAccountMobile"
                class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[60] md:hidden"
                style="margin-bottom: 4rem;"
              >
                <div class="backdrop-blur-xl bg-white/30 border-2 border-white/40 rounded-xl shadow-2xl p-2 min-w-[200px]">
                  <button
                    @click.stop="selectMenu('dashboard'); showAccountMobile = false"
                    :class="[
                      'w-full px-4 py-3 rounded-lg mb-2 transition-all duration-300 flex items-center space-x-3',
                      activeMenu === 'dashboard'
                        ? 'bg-blue-500/30 border border-blue-400/40 text-blue-700'
                        : 'bg-white/20 border border-white/30 text-slate-700 hover:bg-white/30'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'chart-line']" :class="['text-base transition-opacity duration-300', activeMenu === 'dashboard' ? 'opacity-100' : 'opacity-10']" />
                    <span class="text-sm font-medium">Dashboard</span>
                  </button>
                  <button
                    @click.stop="selectMenu('tiktok-tips'); showAccountMobile = false"
                    :class="[
                      'w-full px-4 py-3 rounded-lg mb-2 transition-all duration-300 flex items-center space-x-3',
                      activeMenu === 'tiktok-tips'
                        ? 'bg-pink-500/30 border border-pink-400/40 text-pink-700'
                        : 'bg-white/20 border border-white/30 text-slate-700 hover:bg-white/30'
                    ]"
                  >
                    <font-awesome-icon :icon="['fab', 'tiktok']" :class="['text-base transition-opacity duration-300', activeMenu === 'tiktok-tips' ? 'opacity-100' : 'opacity-10']" />
                    <span class="text-sm font-medium">TikTok Tips</span>
                  </button>
                  <button
                    @click.stop="selectMenu('pricing'); showAccountMobile = false"
                    :class="[
                      'w-full px-4 py-3 rounded-lg mb-2 transition-all duration-300 flex items-center space-x-3',
                      activeMenu === 'pricing'
                        ? 'bg-amber-500/30 border border-amber-400/40 text-amber-700'
                        : 'bg-white/20 border border-white/30 text-slate-700 hover:bg-white/30'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'tags']" :class="['text-base transition-opacity duration-300', activeMenu === 'pricing' ? 'opacity-100' : 'opacity-10']" />
                    <span class="text-sm font-medium">Pricing</span>
                  </button>
                  <button
                    @click.stop="selectMenu('billing'); showAccountMobile = false"
                    :class="[
                      'w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3',
                      activeMenu === 'billing'
                        ? 'bg-green-500/30 border border-green-400/40 text-green-700'
                        : 'bg-white/20 border border-white/30 text-slate-700 hover:bg-white/30'
                    ]"
                  >
                    <font-awesome-icon :icon="['fas', 'credit-card']" :class="['text-base transition-opacity duration-300', activeMenu === 'billing' ? 'opacity-100' : 'opacity-10']" />
                    <span class="text-sm font-medium">Billing</span>
                  </button>
                </div>
              </div>
            </transition>
          </Teleport>
        </li>

        <!-- Vitrini Drive (Mobile) -->
        <li class="md:hidden">
          <button
            @click.stop="selectMenu('vitrini-drive')"
            :class="[
              'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 w-full',
              activeMenu === 'vitrini-drive'
                ? 'backdrop-blur-sm bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 border border-indigo-400/40 text-indigo-700 shadow-lg'
                : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
              'px-3 py-2'
            ]"
            title="Vitrini Drive"
          >
            <div class="flex flex-col items-center justify-center">
              <font-awesome-icon 
                :icon="['fas', 'hdd']" 
                :class="[
                  'text-lg transition-all duration-300',
                  activeMenu === 'vitrini-drive' ? 'text-indigo-600 opacity-100' : 'text-slate-600 opacity-10'
                ]" 
              />
              <span :class="['text-xs mt-0.5 font-medium', activeMenu === 'vitrini-drive' ? 'text-indigo-700 font-semibold' : 'text-slate-700']">Drive</span>
            </div>
          </button>
        </li>

        <!-- Create (Mobile - Featured) -->
        <li class="md:hidden">
          <button
            @click.stop="selectMenu('vitrini-template')"
            :class="[
              'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 w-full',
              activeMenu === 'vitrini-template'
                ? 'backdrop-blur-sm bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-600/40 border-2 border-purple-400/60 text-purple-800 shadow-xl'
                : 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-600/20 text-purple-700 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-purple-600/30 hover:backdrop-blur-sm border-2 border-purple-400/40 hover:border-purple-400/60 shadow-lg hover:shadow-xl',
              'px-3 py-2.5'
            ]"
            title="Create"
          >
            <div class="flex flex-col items-center justify-center">
              <font-awesome-icon 
                :icon="['fas', 'magic']" 
                :class="[
                  'text-lg transition-all duration-300',
                  activeMenu === 'vitrini-template' ? 'text-purple-700 opacity-100' : 'text-purple-600 opacity-10'
                ]" 
              />
              <span :class="['text-xs mt-0.5 font-bold', activeMenu === 'vitrini-template' ? 'text-purple-800' : 'text-purple-700']">Create</span>
            </div>
          </button>
        </li>

        <!-- Creation Section (Expandable) -->
        <li class="md:mt-4 hidden md:block min-w-0">
          <div
            v-if="!isMinimized"
            @click.stop="toggleCreationSection"
            class="px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors flex items-center justify-between"
          >
            <span class="text-xs font-semibold">Creation</span>
            <font-awesome-icon 
              :icon="['fas', 'chevron-down']" 
              class="text-xs transition-transform duration-300"
              :class="{ 'rotate-180': isCreationExpanded }"
            />
          </div>
          <ul 
            v-show="isCreationExpanded || isMinimized" 
            class="mt-2 space-y-1 transition-opacity duration-300 ease-in-out"
            :class="(isCreationExpanded || isMinimized) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <li
              @click="selectMenu('model-mannequin')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'model-mannequin'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Model Mannequin' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'user-circle']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'model-mannequin' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'model-mannequin' ? 'text-blue-700 font-semibold' : 'text-slate-700']" title="Model Mannequin">Manequin</span>
              </div>
            </li>
            <li
              @click="selectMenu('studio-mannequin')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'studio-mannequin'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 border border-indigo-400/40 text-indigo-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Studio Manequin' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'camera']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'studio-mannequin' ? 'text-indigo-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'studio-mannequin' ? 'text-indigo-700 font-semibold' : 'text-slate-700']" title="Studio Manequin">Studio</span>
              </div>
            </li>
            <li
              @click="selectMenu('product-presentation')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'product-presentation'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Product Thumb' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'tshirt']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'product-presentation' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'product-presentation' ? 'text-blue-700 font-semibold' : 'text-slate-700']" title="Product Thumb">Thumbnail</span>
              </div>
            </li>
            <li
              @click="selectMenu('video-creation')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'video-creation'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Product Clip' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'video']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'video-creation' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'video-creation' ? 'text-blue-700 font-semibold' : 'text-slate-700']" title="Product Clip">Clip</span>
              </div>
            </li>
            <li
              @click="selectMenu('track-motion')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'track-motion'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400/40 text-emerald-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Control Motion' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'film']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'track-motion' ? 'text-emerald-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'track-motion' ? 'text-emerald-700 font-semibold' : 'text-slate-700']" title="Control Motion">Control Motion</span>
              </div>
            </li>
            <li
              @click="selectMenu('face-swap')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'face-swap'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-pink-500/30 to-purple-600/30 border border-pink-400/40 text-pink-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Face Swap' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'user-friends']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'face-swap' ? 'text-pink-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'face-swap' ? 'text-pink-700 font-semibold' : 'text-slate-700']" title="Face Swap">Face Swap</span>
              </div>
            </li>
            <li
              @click="selectMenu('makeup')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'makeup'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-rose-500/30 to-pink-600/30 border border-rose-400/40 text-rose-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Makeup' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'palette']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'makeup' ? 'text-rose-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'makeup' ? 'text-rose-700 font-semibold' : 'text-slate-700']" title="Makeup">Makeup</span>
              </div>
            </li>
          </ul>
        </li>

        <!-- Creation Button (Mobile) -->
        <li class="md:hidden relative">
          <button
            @click.stop="toggleCreationMenu"
            :class="[
              'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 w-full',
              showCreationMenu
                ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
              'px-3 py-2'
            ]"
            title="Creation"
          >
            <div class="flex flex-col items-center justify-center">
              <font-awesome-icon 
                :icon="['fas', 'plus']" 
                :class="[
                  'text-lg transition-all duration-300',
                  showCreationMenu ? 'text-blue-600 opacity-100 rotate-45' : 'text-slate-600 opacity-10'
                ]" 
              />
              <span :class="['text-xs mt-0.5 font-medium', showCreationMenu ? 'text-blue-700 font-semibold' : 'text-slate-700']">Creation</span>
            </div>
          </button>
          
          <!-- Circular Menu for Creation -->
          <Teleport to="body">
            <transition name="circular-menu">
              <div
                v-if="showCreationMenu"
                class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[60] md:hidden"
                style="margin-bottom: 4rem;"
              >
                <div class="relative w-72 h-72 pointer-events-none">
                  <!-- Menu Items in Circle -->
                  <transition-group name="menu-item" tag="div" class="relative w-full h-full">
                    <button
                      v-for="(item, index) in creationItems"
                      :key="item.id"
                      @click.stop="selectMenu(item.id)"
                      :class="[
                        'absolute rounded-full backdrop-blur-xl bg-white/30 border-2 border-white/40 shadow-2xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto',
                        activeMenu === item.id ? 'bg-blue-500/40 border-blue-400/60' : 'hover:bg-white/40'
                      ]"
                      :style="getCircularMenuPosition(index, creationItems.length, 90)"
                      :title="item.title"
                    >
                      <font-awesome-icon 
                        :icon="item.icon" 
                        :class="[
                          'text-base transition-all duration-300 mb-0.5',
                          activeMenu === item.id ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                        ]" 
                      />
                      <span :class="['text-[8px] font-medium', activeMenu === item.id ? 'text-blue-700' : 'text-slate-700']">{{ item.shortLabel }}</span>
                    </button>
                  </transition-group>
                </div>
              </div>
            </transition>
          </Teleport>
        </li>

        <!-- Edition Section (Expandable) -->
        <li class="md:mt-4 hidden md:block min-w-0">
          <div
            v-if="!isMinimized"
            @click.stop="toggleEditionSection"
            class="px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors flex items-center justify-between"
          >
            <span class="text-xs font-semibold">Edition</span>
            <font-awesome-icon 
              :icon="['fas', 'chevron-down']" 
              class="text-xs transition-transform duration-300"
              :class="{ 'rotate-180': isEditionExpanded }"
            />
          </div>
          <ul 
            v-show="isEditionExpanded || isMinimized" 
            class="mt-2 space-y-1 transition-opacity duration-300 ease-in-out"
            :class="(isEditionExpanded || isMinimized) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <li
              @click="selectMenu('video-editor')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'video-editor'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-purple-600/30 border border-purple-400/40 text-purple-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Video Editor' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'edit']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'video-editor' ? 'text-purple-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'video-editor' ? 'text-purple-700 font-semibold' : 'text-slate-700']" title="Video Editor">Video Editor</span>
              </div>
            </li>
          </ul>
        </li>

        <!-- Account Section (Expandable) - Contains Dashboard, Pricing, Billing (below Edition) -->
        <li class="md:mt-4 hidden md:block min-w-0">
          <div
            v-if="!isMinimized"
            @click.stop="toggleAccountSection"
            class="px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors flex items-center justify-between"
          >
            <span class="text-xs font-semibold">Account</span>
            <font-awesome-icon 
              :icon="['fas', 'chevron-down']" 
              class="text-xs transition-transform duration-300"
              :class="{ 'rotate-180': isAccountExpanded }"
            />
          </div>
          <div
            class="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
            :class="isAccountExpanded || isMinimized ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'"
          >
            <ul class="mt-2 space-y-1">
            <!-- Dashboard -->
            <li
              @click="selectMenu('dashboard')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'dashboard'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Dashboard' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'chart-line']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'dashboard' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'dashboard' ? 'text-blue-700 font-semibold' : 'text-slate-700']">Dashboard</span>
              </div>
            </li>
            <!-- TikTok Tips -->
            <li
              @click="selectMenu('tiktok-tips')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'tiktok-tips'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-pink-500/30 to-rose-600/30 border border-pink-400/40 text-pink-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'TikTok Tips' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fab', 'tiktok']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'tiktok-tips' ? 'text-pink-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'tiktok-tips' ? 'text-pink-700 font-semibold' : 'text-slate-700']">TikTok Tips</span>
              </div>
            </li>
            <!-- Pricing -->
            <li
              @click="selectMenu('pricing')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'pricing'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/40 text-amber-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Pricing' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'tags']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'pricing' ? 'text-amber-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'pricing' ? 'text-amber-700 font-semibold' : 'text-slate-700']">Pricing</span>
              </div>
            </li>
            <!-- Billing -->
            <li
              @click="selectMenu('billing')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'billing'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-green-500/30 to-green-600/30 border border-green-400/40 text-green-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Billing' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'credit-card']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'billing' ? 'text-green-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'billing' ? 'text-green-700 font-semibold' : 'text-slate-700']">Billing</span>
              </div>
            </li>
          </ul>
          </div>
        </li>

        <!-- Edition Button (Mobile) -->
        <li class="md:hidden relative">
          <button
            @click.stop="toggleEditionMenu"
            :class="[
              'cursor-pointer rounded-xl transition-all duration-300 flex-shrink-0 w-full',
              showEditionMenu
                ? 'backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-purple-600/30 border border-purple-400/40 text-purple-700 shadow-lg'
                : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
              'px-3 py-2'
            ]"
            title="Edition"
          >
            <div class="flex flex-col items-center justify-center">
              <font-awesome-icon 
                :icon="['fas', 'edit']" 
                :class="[
                  'text-lg transition-all duration-300',
                  showEditionMenu ? 'text-purple-600 opacity-100 rotate-45' : 'text-slate-600 opacity-10'
                ]" 
              />
              <span :class="['text-xs mt-0.5 font-medium', showEditionMenu ? 'text-purple-700 font-semibold' : 'text-slate-700']">Edition</span>
            </div>
          </button>
          
          <!-- Circular Menu for Edition -->
          <Teleport to="body">
            <transition name="circular-menu">
              <div
                v-if="showEditionMenu"
                class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[60] md:hidden"
                style="margin-bottom: 4rem;"
              >
                <div class="relative w-48 h-48 pointer-events-none">
                  <!-- Video Editor Item in Circle -->
                  <button
                    @click.stop="selectMenu('video-editor')"
                    :class="[
                      'absolute rounded-full backdrop-blur-xl bg-white/30 border-2 border-white/40 shadow-2xl w-14 h-14 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto',
                      activeMenu === 'video-editor' ? 'bg-purple-500/40 border-purple-400/60' : 'hover:bg-white/40'
                    ]"
                    :style="getCircularMenuPosition(0, 1, 70)"
                    title="Video Editor"
                  >
                    <font-awesome-icon 
                      :icon="['fas', 'edit']" 
                      :class="[
                        'text-base transition-all duration-300 mb-0.5',
                        activeMenu === 'video-editor' ? 'text-purple-600 opacity-100' : 'text-slate-600 opacity-10'
                      ]" 
                    />
                    <span :class="['text-[8px] font-medium', activeMenu === 'video-editor' ? 'text-purple-700' : 'text-slate-700']">Editor</span>
                  </button>
                </div>
              </div>
            </transition>
          </Teleport>
        </li>

        <!-- Admin Section (only for admin users) -->
        <li v-if="user?.role === 'admin'" class="md:mt-4 hidden md:block min-w-0">
          <div
            v-if="!isMinimized"
            class="px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider"
          >
            <span class="text-xs font-semibold">Admin</span>
          </div>
          <ul class="mt-2 space-y-1">
            <li
              @click="selectMenu('admin-statistics')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'admin-statistics'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-400/40 text-red-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Admin Statistics' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'chart-bar']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'admin-statistics' ? 'text-red-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'admin-statistics' ? 'text-red-700 font-semibold' : 'text-slate-700']" title="Statistics">Statistics</span>
              </div>
            </li>
            <li
              @click="selectMenu('show-vitrini')"
              :class="[
                'cursor-pointer rounded-xl transition-all duration-300',
                activeMenu === 'show-vitrini'
                  ? 'backdrop-blur-sm bg-gradient-to-r from-orange-500/30 to-orange-600/30 border border-orange-400/40 text-orange-700 shadow-lg'
                  : 'text-slate-700 hover:bg-white/40 hover:backdrop-blur-sm border border-transparent hover:border-white/30',
                isMinimized ? 'p-3 flex justify-center' : 'px-4 py-3 ml-2'
              ]"
              :title="isMinimized ? 'Show Vitrini' : ''"
            >
              <div :class="[isMinimized ? 'flex justify-center' : 'flex items-center', 'min-w-0']">
                <font-awesome-icon 
                  :icon="['fas', 'check-circle']" 
                  :class="[
                    'flex-shrink-0 text-xl transition-all duration-300',
                    activeMenu === 'show-vitrini' ? 'text-orange-600 opacity-100' : 'text-slate-600 opacity-10'
                  ]" 
                />
                <span v-if="!isMinimized" :class="['ml-3 text-base font-medium truncate', activeMenu === 'show-vitrini' ? 'text-orange-700 font-semibold' : 'text-slate-700']" title="Show Vitrini">Show Vitrini</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- User Card (Desktop only) - Fixed at bottom -->
    <div class="hidden md:block p-4 border-t border-white/30 relative z-10 flex-shrink-0 mt-auto">
      <div
        v-if="!isMinimized"
        class="backdrop-blur-sm bg-white/30 border border-white/40 rounded-xl p-4 hover:bg-white/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
      >
        <div class="flex items-center space-x-3 mb-3">
          <div v-if="user?.picture" class="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400/40 shadow-lg">
            <img :src="user.picture" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center border-2 border-blue-400/40 shadow-lg">
            <font-awesome-icon :icon="['fas', 'user']" class="text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ user?.name || 'Usuário' }}</p>
            <p class="text-xs text-slate-600 truncate">{{ user?.email || '' }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 text-xs backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-lg px-3 py-1.5">
            <font-awesome-icon :icon="['fas', 'credit-card']" class="text-blue-600" />
            <span class="text-slate-700 font-medium">{{ (user?.credits || 0).toLocaleString('pt-BR') }} créditos</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click.stop="selectMenu('settings')"
              class="p-2 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-white/30"
              :class="activeMenu === 'settings' ? 'bg-blue-500/20 border-blue-400/30' : ''"
              title="Configurações"
            >
              <font-awesome-icon 
                :icon="['fas', 'cog']" 
                :class="['transition-all duration-300', activeMenu === 'settings' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10']"
              />
            </button>
            <button
              @click.stop="logout"
              class="p-2 hover:bg-red-500/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-red-400/30"
              title="Sair"
            >
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="text-slate-600 opacity-10 hover:opacity-100 hover:text-red-600 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center space-y-2"
      >
        <div v-if="user?.picture" class="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-all duration-300 border-2 border-blue-400/40 shadow-lg hover:shadow-xl"
             :title="user?.name">
          <img :src="user.picture" :alt="user.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 border-2 border-blue-400/40 shadow-lg hover:shadow-xl"
             :title="user?.name || 'Usuário'">
          <font-awesome-icon :icon="['fas', 'user']" class="text-white" />
        </div>
        <button
          @click.stop="selectMenu('settings')"
          class="p-2 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-white/30"
          :class="activeMenu === 'settings' ? 'bg-blue-500/20 border-blue-400/30' : ''"
          title="Configurações"
        >
          <font-awesome-icon 
            :icon="['fas', 'cog']" 
            :class="['transition-all duration-300', activeMenu === 'settings' ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-10']"
          />
        </button>
      </div>
    </div>

    <!-- Overlay for Circular Menus (Mobile) -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showCreationMenu || showEditionMenu || showAccountMobile"
          @click="closeAllMenus"
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden"
        ></div>
      </transition>
    </Teleport>
  </aside>
</template>

<script setup>
const props = defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['menu-change'])

// Estado do sidebar (minimizado/maximizado)
const isMinimized = useState('sidebarMinimized', () => false)

// Dados do usuário logado e logout (usar apenas uma instância)
const { user, logout: authLogout } = useAuth()

// Creation items for mobile horizontal menu
const creationItems = [
  { id: 'model-mannequin', icon: ['fas', 'user-circle'], title: 'Model Mannequin', shortLabel: 'Model' },
  { id: 'studio-mannequin', icon: ['fas', 'camera'], title: 'Studio Manequin', shortLabel: 'Studio' },
  { id: 'product-presentation', icon: ['fas', 'tshirt'], title: 'Product Thumb', shortLabel: 'Thumb' },
  { id: 'video-creation', icon: ['fas', 'video'], title: 'Product Clip', shortLabel: 'Clip' },
  { id: 'track-motion', icon: ['fas', 'film'], title: 'Control Motion', shortLabel: 'Motion' },
  { id: 'face-swap', icon: ['fas', 'user-friends'], title: 'Face Swap', shortLabel: 'Face' },
  { id: 'makeup', icon: ['fas', 'palette'], title: 'Makeup', shortLabel: 'Makeup' },
]

// Mobile circular menu states
const showCreationMenu = ref(false)
const showEditionMenu = ref(false)
const showAccountMobile = ref(false)

// Desktop expandable sections states
const isAccountExpanded = ref(true) // Default expanded
const isCreationExpanded = ref(true) // Default expanded
const isEditionExpanded = ref(true) // Default expanded

// Toggle sidebar
const toggleSidebar = () => {
  isMinimized.value = !isMinimized.value
}

// Toggle creation menu
const toggleCreationMenu = () => {
  showCreationMenu.value = !showCreationMenu.value
  if (showCreationMenu.value) {
    showEditionMenu.value = false
  }
}

// Toggle edition menu
const toggleEditionMenu = () => {
  showEditionMenu.value = !showEditionMenu.value
  if (showEditionMenu.value) {
    showCreationMenu.value = false
    showAccountMobile.value = false
  }
}

// Toggle account mobile menu
const toggleAccountMobile = () => {
  showAccountMobile.value = !showAccountMobile.value
  if (showAccountMobile.value) {
    showCreationMenu.value = false
    showEditionMenu.value = false
  }
}

// Toggle account section (desktop)
const toggleAccountSection = () => {
  isAccountExpanded.value = !isAccountExpanded.value
}

// Toggle creation section (desktop)
const toggleCreationSection = () => {
  isCreationExpanded.value = !isCreationExpanded.value
}

// Toggle edition section (desktop)
const toggleEditionSection = () => {
  isEditionExpanded.value = !isEditionExpanded.value
}

// Close all menus
const closeAllMenus = () => {
  showCreationMenu.value = false
  showEditionMenu.value = false
  showAccountMobile.value = false
}

// Calculate circular menu position
const getCircularMenuPosition = (index, total, radius) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // Start from top
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
  }
}

// Selecionar menu
const selectMenu = (menuId) => {
  emit('menu-change', menuId)
  closeAllMenus()
}

// Logout
const logout = () => {
  authLogout()
}
</script>

<style scoped>
.circular-menu-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circular-menu-leave-active {
  transition: all 0.2s ease-in;
}

.circular-menu-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
}

.circular-menu-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
}

.circular-menu-enter-to,
.circular-menu-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.menu-item-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-item-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
}

.menu-item-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
</style>
