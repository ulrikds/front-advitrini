<template>
  <div class="min-h-screen">
    <!-- Header -->
    
    <!-- Storage Usage -->
    <div class="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Video Storage -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-purple-500/10" :style="{ width: `${storageUsage.video.percent}%` }"></div>
        <div class="relative flex items-center justify-between z-10">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-500/20 rounded-lg text-purple-700">
              <font-awesome-icon :icon="['fas', 'video']" class="text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-800">Video Storage</h3>
              <p class="text-xs text-slate-600 mt-0.5">
                <span :class="{'text-red-600 font-bold': storageUsage.video.percent >= 100}">{{ storageUsage.video.used }}</span> 
                / {{ storageUsage.video.limit === Infinity ? '∞' : storageUsage.video.limit }} items
              </p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold text-slate-700">{{ Math.round(storageUsage.video.percent) }}%</span>
          </div>
        </div>
      </div>

      <!-- Image Storage -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-500/10" :style="{ width: `${storageUsage.image.percent}%` }"></div>
        <div class="relative flex items-center justify-between z-10">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-500/20 rounded-lg text-blue-700">
              <font-awesome-icon :icon="['fas', 'image']" class="text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-800">Image Storage</h3>
              <p class="text-xs text-slate-600 mt-0.5">
                <span :class="{'text-red-600 font-bold': storageUsage.image.percent >= 100}">{{ storageUsage.image.used }}</span> 
                / {{ storageUsage.image.limit === Infinity ? '∞' : storageUsage.image.limit }} items
              </p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold text-slate-700">{{ Math.round(storageUsage.image.percent) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Files Card -->
    <div v-if="recentFiles.length > 0" class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="flex items-center justify-between mb-3 sm:mb-4">
        <h2 class="text-base sm:text-lg font-semibold text-slate-800">Recent Files</h2>
        <button
          @click="selectFolder('all')"
          class="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View All
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="file in recentFiles"
          :key="file.id"
          @click="viewFile(file)"
          class="group relative cursor-pointer rounded-xl overflow-hidden backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <!-- Thumbnail -->
          <div class="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-200/50 to-slate-300/50">
            <!-- Video/Control Motion -->
            <div v-if="file.type === 'video' || file.type === 'control-motion'" class="w-full h-full relative">
              <!-- Video thumbnail -->
              <video
                v-if="file.url"
                :src="file.url"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                muted
                preload="metadata"
                @loadedmetadata="handleVideoLoaded"
              ></video>
              <!-- Fallback gradient if no video URL -->
              <div v-else class="w-full h-full bg-gradient-to-br from-purple-500/20 to-amber-500/20"></div>
              <!-- Play icon overlay -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="backdrop-blur-sm bg-black/40 rounded-full p-3 sm:p-4 border border-white/40 transition-all duration-300 group-hover:bg-black/60 group-hover:scale-110">
                  <font-awesome-icon :icon="['fas', 'play-circle']" class="text-3xl sm:text-4xl text-white" />
                </div>
              </div>
            </div>
            <!-- Image files -->
            <img
              v-else-if="file.url || file.thumbnail"
              :src="file.url || file.thumbnail"
              :alt="file.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              @error="handleImageError($event)"
            />
            <!-- Fallback for files without image -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="backdrop-blur-sm bg-white/30 rounded-full p-6 border border-white/40">
                <font-awesome-icon :icon="getFileTypeClass(file.type).icon" :class="['text-4xl', getFileTypeClass(file.type).text]" />
              </div>
            </div>
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="backdrop-blur-sm bg-white/30 rounded-full p-3 border border-white/40">
                  <font-awesome-icon :icon="['fas', 'eye']" class="text-2xl text-white" />
                </div>
              </div>
            </div>
            <!-- File type badge -->
            <div class="absolute top-2 right-2">
              <span
                :class="[
                  'px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border',
                  getFileTypeClass(file.type).badge
                ]"
              >
                {{ getFileTypeLabel(file.type) }}
              </span>
            </div>
          </div>
          <!-- File info -->
          <div class="p-2 sm:p-3">
            <p class="font-semibold text-slate-800 text-xs sm:text-sm truncate" :title="file.name">
              {{ file.name }}
            </p>
            <p class="text-xs text-slate-600 mt-0.5 sm:mt-1">
              {{ formatDate(file.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- System Folders -->
    <div class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
        <h2 class="text-base sm:text-lg font-semibold text-slate-800">Filter Archives</h2>
        <div v-if="selectedFiles.length > 0" class="flex items-center gap-2 flex-wrap">
          <span class="text-xs sm:text-sm text-slate-600">{{ selectedFiles.length }} selected</span>
          <button
            @click="showMoveToFolderModal = true"
            class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-blue-700 font-medium"
          >
            Move to Folder
          </button>
          <button
            @click="clearSelection"
            class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm backdrop-blur-sm bg-slate-500/20 border border-slate-400/30 rounded-lg hover:bg-slate-500/30 transition-all duration-300 text-slate-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div class="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
        <!-- "All" Folder -->
        <button
          @click="selectFolder('all')"
          @dragover.prevent="handleDragOver($event, 'all')"
          @drop.prevent="handleDrop($event, 'all')"
          @dragleave="handleDragLeave"
          :class="[
            'flex-shrink-0 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 border-2 relative group',
            activeFolder === 'all'
              ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border-blue-400/50 shadow-lg'
              : 'backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40',
            dragOverFolder === 'all' ? 'ring-4 ring-blue-400/50 bg-blue-500/20 scale-105' : ''
          ]"
        >
          <div class="flex flex-col items-center space-y-1 sm:space-y-2">
            <div
              :class="[
                'p-1.5 sm:p-2 md:p-3 rounded-lg',
                activeFolder === 'all'
                  ? 'bg-blue-500/20 border border-blue-400/30'
                  : 'bg-slate-500/20 border border-slate-400/30'
              ]"
            >
              <font-awesome-icon
                :icon="['fas', 'folder-open']"
                :class="[
                  'text-sm sm:text-base md:text-xl',
                  activeFolder === 'all' ? 'text-blue-600' : 'text-slate-600'
                ]"
              />
            </div>
            <div class="text-center">
              <p
                :class="[
                  'font-semibold text-[10px] sm:text-xs md:text-sm',
                  activeFolder === 'all' ? 'text-blue-700' : 'text-slate-700'
                ]"
              >
                All
              </p>
              <p class="text-[9px] sm:text-xs text-slate-600">{{ allFiles.length }} files</p>
            </div>
          </div>
        </button>

        <!-- System Folders -->
        <button
          v-for="folder in systemFolders"
          :key="folder.id"
          @click="selectFolder(folder.id)"
          @dragover.prevent="handleDragOver($event, folder.id)"
          @drop.prevent="handleDrop($event, folder.id)"
          @dragleave="handleDragLeave"
          :class="[
            'flex-shrink-0 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 border-2',
            activeFolder === folder.id
              ? 'backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border-blue-400/50 shadow-lg'
              : 'backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40',
            dragOverFolder === folder.id ? 'ring-4 ring-blue-400/50 bg-blue-500/20 scale-105' : ''
          ]"
        >
          <div class="flex flex-col items-center space-y-1 sm:space-y-2">
            <div
              :class="[
                'p-1.5 sm:p-2 md:p-3 rounded-lg',
                activeFolder === folder.id
                  ? 'bg-blue-500/20 border border-blue-400/30'
                  : 'bg-slate-500/20 border border-slate-400/30'
              ]"
            >
              <font-awesome-icon
                :icon="folder.icon"
                :class="[
                  'text-sm sm:text-base md:text-xl',
                  activeFolder === folder.id ? 'text-blue-600' : 'text-slate-600'
                ]"
              />
            </div>
            <div class="text-center">
              <p
                :class="[
                  'font-semibold text-[10px] sm:text-xs md:text-sm',
                  activeFolder === folder.id ? 'text-blue-700' : 'text-slate-700'
                ]"
              >
                {{ folder.name }}
              </p>
              <p class="text-[9px] sm:text-xs text-slate-600">{{ folder.count }} files</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Grid Layout: My Folders (1/3) and All Files (2/3) -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <!-- My Folders (1/3) -->
      <div class="lg:col-span-1">
        <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 h-full">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <h2 class="text-base sm:text-lg font-semibold text-slate-800">My Folders</h2>
            <button
              @click="showCreateFolderModal = true"
              class="p-1.5 sm:p-2 backdrop-blur-sm bg-indigo-500/20 border border-indigo-400/30 rounded-lg hover:bg-indigo-500/30 transition-all duration-300 text-indigo-700"
              title="Create Folder"
            >
              <font-awesome-icon :icon="['fas', 'folder-plus']" class="text-sm sm:text-base" />
            </button>
          </div>
          <div v-if="customFolders.length > 0" class="space-y-2 sm:space-y-3">
            <button
              v-for="folder in customFolders"
              :key="folder.id"
              @click="selectFolder(folder.id)"
              @contextmenu.prevent="showFolderContextMenu($event, folder)"
              @dragover.prevent="handleDragOver($event, folder.id)"
              @drop.prevent="handleDrop($event, folder.id)"
              @dragleave="handleDragLeave"
              :class="[
                'w-full p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 border-2 relative group',
                activeFolder === folder.id
                  ? 'backdrop-blur-sm bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 border-indigo-400/50 shadow-lg'
                  : 'backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40',
                dragOverFolder === folder.id ? 'ring-4 ring-indigo-400/50 bg-indigo-500/20 scale-105' : ''
              ]"
              :style="{ 
                borderColor: activeFolder === folder.id ? folder.color + '80' : undefined,
                ringColor: dragOverFolder === folder.id ? folder.color + '50' : undefined
              }"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="p-2 sm:p-3 rounded-lg border flex-shrink-0"
                  :style="{
                    backgroundColor: folder.color + '20',
                    borderColor: folder.color + '40'
                  }"
                >
                  <font-awesome-icon
                    :icon="['fas', folder.icon || 'folder-open']"
                    class="text-lg sm:text-xl"
                    :style="{ color: folder.color }"
                  />
                </div>
                <div class="flex-1 min-w-0 text-left">
                  <p
                    :class="[
                      'font-semibold text-sm sm:text-base truncate',
                      activeFolder === folder.id ? 'text-indigo-700' : 'text-slate-700'
                    ]"
                  >
                    {{ folder.name }}
                  </p>
                  <p class="text-xs sm:text-sm text-slate-600">{{ folder.count }} files</p>
                </div>
              </div>
              <!-- Menu de contexto -->
              <div
                v-if="contextMenuFolder?.id === folder.id && showContextMenu"
                class="absolute top-full left-0 mt-2 z-50 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-2xl p-2 min-w-[150px]"
                @click.stop
              >
                <button
                  @click="editFolder(folder)"
                  class="w-full text-left px-3 py-2 rounded-lg hover:bg-white/40 transition-all duration-300 text-slate-700 text-sm"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" class="mr-2" />
                  Edit
                </button>
                <button
                  @click="confirmDeleteFolder(folder)"
                  class="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 text-red-700 text-sm"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" class="mr-2" />
                  Delete
                </button>
              </div>
            </button>
          </div>
          <div v-else class="text-center py-8 text-slate-600">
            <font-awesome-icon :icon="['fas', 'folder-open']" class="text-3xl mb-3 opacity-50" />
            <p class="text-sm">No custom folders yet</p>
            <button
              @click="showCreateFolderModal = true"
              class="mt-3 px-3 py-1.5 backdrop-blur-sm bg-indigo-500/20 border border-indigo-400/30 rounded-lg hover:bg-indigo-500/30 transition-all duration-300 text-indigo-700 font-medium text-xs sm:text-sm"
            >
              Create Folder
            </button>
          </div>
        </div>
      </div>

      <!-- All Files (2/3) -->
      <div class="lg:col-span-3 min-w-0">
    <!-- Files Table -->
    <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full min-w-0">
      <div class="p-4 sm:p-6 border-b border-white/20">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
          <h2 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
            {{ getFolderName(activeFolder) }}
          </h2>
          <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <!-- Search -->
            <div class="relative flex-1 sm:flex-none">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search files..."
                class="w-full sm:w-auto pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-800 placeholder-slate-500"
              />
              <font-awesome-icon
                :icon="['fas', 'search']"
                class="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm"
              />
            </div>
            <!-- Refresh Button -->
            <button
              @click="loadFiles"
              :disabled="loading"
              class="px-2 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl bg-white/30 border border-white/40 rounded-lg sm:rounded-xl shadow-lg hover:bg-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh"
            >
              <font-awesome-icon
                :icon="['fas', 'sync-alt']"
                :class="['text-blue-600 text-sm sm:text-base', loading ? 'animate-spin' : '']"
              />
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div></div>
          <div class="flex items-center gap-2">
            <span class="text-xs sm:text-sm text-slate-600">
              {{ activeFolder === 'all' ? `${allFilteredFiles.length} file(s) total` : `${filteredFiles.length} file(s)` }}
              <span v-if="activeFolder === 'all' && totalPages > 1" class="ml-2">
                (Page {{ currentPage }} of {{ totalPages }})
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12 sm:py-16">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-blue-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="allFilteredFiles.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <div class="p-4 sm:p-6 rounded-full backdrop-blur-sm bg-slate-500/10 border border-slate-400/20 mb-3 sm:mb-4">
          <font-awesome-icon :icon="['fas', 'folder-open']" class="text-3xl sm:text-4xl text-slate-400" />
        </div>
        <p class="text-base sm:text-lg font-semibold text-slate-700 mb-2">No files found</p>
        <p class="text-xs sm:text-sm text-slate-600">
          {{ searchQuery ? 'Try adjusting your search' : 'This folder is empty' }}
        </p>
      </div>

      <!-- Table - Desktop: fit without horizontal scroll -->
      <template v-else>
        <div class="hidden md:block w-full min-w-0 overflow-x-auto overflow-y-hidden">
          <table class="w-full table-fixed min-w-0">
            <thead class="backdrop-blur-sm bg-white/20 border-b border-white/20">
              <tr>
                <th class="w-10 px-2 sm:px-3 py-2 sm:py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="selectedFiles.length === filteredFiles.length && filteredFiles.length > 0"
                    @change="toggleSelectAll"
                    @click.stop
                    class="rounded"
                  />
                </th>
                <th class="min-w-0 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Name
                </th>
                <th class="w-24 sm:w-28 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th class="w-20 sm:w-24 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                  Size
                </th>
                <th class="w-24 sm:w-28 px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden xl:table-cell">
                  Date
                </th>
                <th class="w-28 sm:w-32 px-2 sm:px-3 py-2 sm:py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr
                v-for="file in filteredFiles"
                :key="file.id"
                @click="!isDragging && viewFile(file)"
                draggable="true"
                @dragstart="handleDragStart($event, file)"
                @dragend="handleDragEnd"
                :class="[
                  'hover:bg-white/20 transition-colors duration-200',
                  selectedFiles.includes(file.id) ? 'bg-blue-500/10' : '',
                  draggingFile?.id === file.id ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
                ]"
              >
                <td class="px-2 sm:px-3 py-2 sm:py-3 align-middle" @click.stop>
                  <input
                    type="checkbox"
                    :checked="selectedFiles.includes(file.id)"
                    @change="toggleFileSelection(file.id)"
                    @click.stop
                    class="rounded"
                  />
                </td>
                <td class="px-2 sm:px-3 py-2 sm:py-3 min-w-0">
                  <div class="flex items-center gap-2 min-w-0">
                    <div
                      :class="[
                        'p-1 sm:p-1.5 rounded-lg flex-shrink-0',
                        getFileTypeClass(file.type).bg,
                        getFileTypeClass(file.type).border
                      ]"
                    >
                      <font-awesome-icon
                        :icon="getFileTypeClass(file.type).icon"
                        :class="['text-sm lg:text-base', getFileTypeClass(file.type).text]"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="font-semibold text-sm text-slate-800 truncate" :title="file.name">{{ file.name }}</p>
                      <p v-if="file.description" class="text-xs text-slate-600 truncate" :title="file.description">
                        {{ file.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-2 sm:px-3 py-2 sm:py-3">
                  <span
                    :class="[
                      'px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap inline-block max-w-full truncate',
                      getFileTypeClass(file.type).badge
                    ]"
                    :title="getFileTypeLabel(file.type)"
                  >
                    {{ getFileTypeLabel(file.type) }}
                  </span>
                </td>
                <td class="px-2 sm:px-3 py-2 sm:py-3 text-xs text-slate-600 truncate hidden lg:table-cell" :title="file.size || file.resolution || '-'">
                  {{ file.size || file.resolution || '-' }}
                </td>
                <td class="px-2 sm:px-3 py-2 sm:py-3 text-xs text-slate-600 hidden xl:table-cell">
                  {{ formatDate(file.createdAt) }}
                </td>
                <td class="px-2 sm:px-3 py-2 sm:py-3 text-right align-middle" @click.stop>
                  <div class="flex items-center justify-end gap-0.5 sm:gap-1">
                    <button
                      @click.stop="viewFile(file)"
                      class="p-1 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-md hover:bg-blue-500/30 transition-all duration-300"
                      title="View"
                    >
                      <font-awesome-icon :icon="['fas', 'eye']" class="text-blue-600 text-xs" />
                    </button>
                    <button
                      @click.stop="downloadFile(file)"
                      class="p-1 backdrop-blur-sm bg-emerald-500/20 border border-emerald-400/30 rounded-md hover:bg-emerald-500/30 transition-all duration-300"
                      title="Download"
                    >
                      <font-awesome-icon :icon="['fas', 'download']" class="text-emerald-600 text-xs" />
                    </button>
                    <button
                      @click.stop="confirmDelete(file)"
                      class="p-1 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-md hover:bg-red-500/30 transition-all duration-300"
                      title="Delete"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" class="text-red-600 text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards - Mobile -->
        <div class="md:hidden p-4 space-y-3">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          @click="!isDragging && viewFile(file)"
          draggable="true"
          @dragstart="handleDragStart($event, file)"
          @dragend="handleDragEnd"
          :class="[
            'backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4 transition-all duration-200',
            selectedFiles.includes(file.id) ? 'bg-blue-500/10 border-blue-400/40' : 'hover:bg-white/30',
            draggingFile?.id === file.id ? 'opacity-50' : ''
          ]"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start space-x-3 flex-1 min-w-0">
              <div class="flex-shrink-0">
                <input
                  type="checkbox"
                  :checked="selectedFiles.includes(file.id)"
                  @change="toggleFileSelection(file.id)"
                  @click.stop
                  class="rounded mt-1"
                />
              </div>
              <div
                :class="[
                  'p-2 rounded-lg flex-shrink-0',
                  getFileTypeClass(file.type).bg,
                  getFileTypeClass(file.type).border
                ]"
              >
                <font-awesome-icon
                  :icon="getFileTypeClass(file.type).icon"
                  :class="['text-lg', getFileTypeClass(file.type).text]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-slate-800 truncate">{{ file.name }}</p>
                <p v-if="file.description" class="text-xs text-slate-600 truncate mt-0.5">
                  {{ file.description }}
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      getFileTypeClass(file.type).badge
                    ]"
                  >
                    {{ getFileTypeLabel(file.type) }}
                  </span>
                  <span class="text-xs text-slate-600">{{ formatDate(file.createdAt) }}</span>
                </div>
                <p v-if="file.size || file.resolution" class="text-xs text-slate-600 mt-1">
                  {{ file.size || file.resolution }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0" @click.stop>
              <!-- Visualizar -->
              <button
                @click.stop="viewFile(file)"
                class="p-1.5 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-md hover:bg-blue-500/30 transition-all duration-300"
                title="View"
              >
                <font-awesome-icon :icon="['fas', 'eye']" class="text-blue-600 text-xs" />
              </button>
              <!-- Download -->
              <button
                @click.stop="downloadFile(file)"
                class="p-1.5 backdrop-blur-sm bg-emerald-500/20 border border-emerald-400/30 rounded-md hover:bg-emerald-500/30 transition-all duration-300"
                title="Download"
              >
                <font-awesome-icon :icon="['fas', 'download']" class="text-emerald-600 text-xs" />
              </button>
              <!-- Delete -->
              <button
                @click.stop="confirmDelete(file)"
                class="p-1.5 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-md hover:bg-red-500/30 transition-all duration-300"
                title="Delete"
              >
                <font-awesome-icon :icon="['fas', 'trash']" class="text-red-600 text-xs" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </template>

      <!-- Pagination (only for "All Files") -->
      <div v-if="activeFolder === 'all' && totalPages > 1" class="p-4 sm:p-6 border-t border-white/20">
        <div class="flex items-center justify-center gap-2 sm:gap-3">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <span class="px-4 py-2 text-sm sm:text-base text-slate-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </div>
      </div>
    </div>

    <!-- Create/Edit Folder Modal -->
    <div
      v-if="showCreateFolderModal || editingFolder"
      @click.self="closeFolderModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
    >
      <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          {{ editingFolder ? 'Edit Folder' : 'Create New Folder' }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Folder Name</label>
            <input
              v-model="newFolderName"
              type="text"
              placeholder="Folder name"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Color</label>
            <div class="flex items-center gap-2">
              <input
                v-model="newFolderColor"
                type="color"
                class="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                v-model="newFolderColor"
                type="text"
                class="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-2">Icon</label>
            <select
              v-model="newFolderIcon"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="folder-open">Folder</option>
              <option value="images">Images</option>
              <option value="video">Video</option>
              <option value="star">Star</option>
              <option value="bookmark">Bookmark</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
          <button
            @click="closeFolderModal"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-300 text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            @click="saveFolder"
            :disabled="!newFolderName || savingFolder"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-white font-medium disabled:opacity-50"
          >
            {{ savingFolder ? 'Saving...' : (editingFolder ? 'Save' : 'Create') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Move to Folder Modal -->
    <div
      v-if="showMoveToFolderModal"
      @click.self="showMoveToFolderModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Move to Folder</h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
          Select a folder to move {{ selectedFiles.length }} file(s)
        </p>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <button
            v-for="folder in allFolders"
            :key="folder.id"
            @click="moveFilesToFolder(folder.id)"
            class="w-full text-left px-4 py-3 backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-3"
          >
            <div
              class="p-2 rounded-lg border"
              :style="{
                backgroundColor: folder.color + '20',
                borderColor: folder.color + '40'
              }"
            >
              <font-awesome-icon
                :icon="['fas', folder.icon || 'folder']"
                :style="{ color: folder.color }"
              />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-slate-800">{{ folder.name }}</p>
              <p class="text-xs text-slate-600">{{ folder.count }} files</p>
            </div>
          </button>
        </div>
        <div class="flex items-center justify-end mt-4 sm:mt-6">
          <button
            @click="showMoveToFolderModal = false"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm backdrop-blur-sm bg-slate-500/20 border border-slate-400/30 rounded-lg hover:bg-slate-500/30 transition-all duration-300 text-slate-700 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- View Modal (smaller, separate component) -->
    <DriveFileViewer
      v-if="viewingFile"
      :file="viewingFile"
      @close="viewingFile = null"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="fileToDelete"
      @click.self="fileToDelete = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Confirm Deletion</h3>
        <p class="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Are you sure you want to delete <strong>{{ fileToDelete.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end space-x-2 sm:space-x-3">
          <button
            @click="fileToDelete = null"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm backdrop-blur-sm bg-slate-500/20 border border-slate-400/30 rounded-lg hover:bg-slate-500/30 transition-all duration-300 text-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteFile"
            :disabled="deleting"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-red-700 font-medium disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Folder Confirmation Modal -->
    <div
      v-if="folderToDelete"
      @click.self="folderToDelete = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Confirm Deletion</h3>
        <p class="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Are you sure you want to delete the folder <strong>{{ folderToDelete.name }}</strong>? Files inside will not be deleted, only removed from the folder.
        </p>
        <div class="flex items-center justify-end space-x-2 sm:space-x-3">
          <button
            @click="folderToDelete = null"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm backdrop-blur-sm bg-slate-500/20 border border-slate-400/30 rounded-lg hover:bg-slate-500/30 transition-all duration-300 text-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            @click="deleteFolderConfirm"
            :disabled="deleting"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-red-700 font-medium disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :type="toastType"
      :title="toastTitle"
      :message="toastMessage"
      :duration="3000"
      @close="showToast = false"
    />
  </div>
</template>

<script setup>
const {
  fetchMannequins,
  fetchPresentations,
  fetchVideos,
  fetchControlMotionVideos,
  fetchFaceSwapResults,
  fetchFolders,
  deleteMannequin,
  deletePresentation,
  deleteVideo,
  deleteControlMotionVideo,
  deleteFaceSwapRecord,
  createFolder,
  updateFolder,
  deleteFolder,
  addFileToFolder,
  removeFileFromFolder
} = useBackendStorage()

const { user } = useAuth()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// Helper function to get storage limit by plan
const getStorageLimits = (role) => {
  const limits = {
    free: { video: 10, image: 50 },
    gold: { video: 100, image: 1000 },
    diamante: { video: 300, image: 5000 },
    diamond: { video: 300, image: 5000 },
    admin: { video: Infinity, image: Infinity },
    custom: { video: 100, image: 1000 }
  }
  return limits[role] || limits.free
}

const storageUsage = computed(() => {
  const videoCount = videos.value.length + controlMotionVideos.value.length
  const imageCount = mannequins.value.length + presentations.value.length + faceSwapResults.value.length
  
  const role = user.value?.role || 'free'
  const limit = getStorageLimits(role)
  
  return {
    video: {
      used: videoCount,
      limit: limit.video,
      percent: limit.video === Infinity ? 0 : Math.min(100, (videoCount / limit.video) * 100)
    },
    image: {
      used: imageCount,
      limit: limit.image,
      percent: limit.image === Infinity ? 0 : Math.min(100, (imageCount / limit.image) * 100)
    }
  }
})

// Estado
const loading = ref(false)
const searchQuery = ref('')
const activeFolder = ref('all')
const viewingFile = ref(null)
const fileToDelete = ref(null)
const deleting = ref(false)
const selectedFiles = ref([])
const showCreateFolderModal = ref(false)
const showMoveToFolderModal = ref(false)
const editingFolder = ref(null)
const savingFolder = ref(false)
const folderToDelete = ref(null)
const showContextMenu = ref(false)
const contextMenuFolder = ref(null)
const draggingFile = ref(null)
const dragOverFolder = ref(null)
const isDragging = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Toast
const showToast = ref(false)
const toastType = ref('success')
const toastTitle = ref('')
const toastMessage = ref('')

// Formulário de pasta
const newFolderName = ref('')
const newFolderColor = ref('#3b82f6')
const newFolderIcon = ref('folder-open')

// Dados
const mannequins = ref([])
const presentations = ref([])
const videos = ref([])
const controlMotionVideos = ref([])
const faceSwapResults = ref([])
const folders = ref([])

// System folders
const systemFolders = computed(() => [
  {
    id: 'mannequin',
    name: 'Mannequins',
    icon: ['fas', 'user'],
    count: mannequins.value.length
  },
  {
    id: 'presentation',
    name: 'Presentations',
    icon: ['fas', 'image'],
    count: presentations.value.length
  },
  {
    id: 'video',
    name: 'Videos',
    icon: ['fas', 'video'],
    count: videos.value.length
  },
  {
    id: 'control-motion',
    name: 'Control Motion',
    icon: ['fas', 'film'],
    count: controlMotionVideos.value.length
  },
  {
    id: 'face-swap',
    name: 'Face Swap',
    icon: ['fas', 'user-friends'],
    count: faceSwapResults.value.length
  }
])

// Pastas personalizadas
const customFolders = computed(() => {
  return folders.value.map(folder => ({
    ...folder,
    count: folder.files?.length || 0,
    icon: folder.icon || 'folder-open'
  }))
})

// Todas as pastas (sistema + personalizadas)
const allFolders = computed(() => [
  ...systemFolders.value.map(f => ({ ...f, color: '#3b82f6', icon: f.icon[1] })),
  ...customFolders.value
])

// Normalizar arquivos para formato comum
const allFiles = computed(() => {
  const files = []
  
  // Manequins
  mannequins.value.forEach(item => {
    files.push({
      id: item.id,
      name: item.name || 'Unnamed Mannequin',
      description: item.description || item.type || '',
      type: 'mannequin',
      url: item.fullBodyImageUrl || item.generatedImage || '',
      thumbnail: item.faceThumbnailUrl || item.fullBodyImageUrl || item.generatedImage || '',
      createdAt: item.createdAt,
      original: item
    })
  })
  
  // Presentations
  presentations.value.forEach(item => {
    files.push({
      id: item.id,
      name: item.productName || 'Unnamed Presentation',
      description: item.productDescription || item.presentationType || '',
      type: 'presentation',
      url: item.generatedImageUrl || item.generatedImage || '',
      createdAt: item.createdAt,
      original: item
    })
  })
  
  // Videos
  videos.value.forEach(item => {
    files.push({
      id: item.id,
      name: item.title || 'Untitled Video',
      description: item.prompt || '',
      type: 'video',
      url: item.generatedVideoUrl || item.generatedVideo || '',
      resolution: item.resolution || '',
      duration: item.duration || '',
      size: item.duration ? `${item.duration}s` : '',
      createdAt: item.createdAt,
      original: item
    })
  })
  
  // Control Motion Videos
  controlMotionVideos.value.forEach(item => {
    files.push({
      id: item.id,
      name: item.title || 'Untitled Control Motion',
      description: '',
      type: 'control-motion',
      url: item.generatedVideoUrl || item.generatedVideo || '',
      resolution: item.resolution || '',
      createdAt: item.createdAt,
      original: item
    })
  })

  // Face Swap results
  faceSwapResults.value.forEach(item => {
    files.push({
      id: item.id,
      name: `Face Swap ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}`.trim() || 'Face Swap',
      description: 'Face & hair swap result',
      type: 'face-swap',
      url: item.resultImageUrl || '',
      thumbnail: item.resultImageUrl || '',
      createdAt: item.createdAt,
      original: item
    })
  })
  
  return files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Recent files (last 4)
const recentFiles = computed(() => {
  return allFiles.value.slice(0, 4)
})

// Filtrar arquivos (sem paginação)
const allFilteredFiles = computed(() => {
  let files = allFiles.value
  
  // Se estiver em uma pasta personalizada, mostrar apenas arquivos dessa pasta
  if (activeFolder.value !== 'all' && !['mannequin', 'presentation', 'video', 'control-motion', 'face-swap'].includes(activeFolder.value)) {
    const folder = folders.value.find(f => f.id === activeFolder.value)
    if (folder && folder.files) {
      const folderFileIds = folder.files.map(f => f.fileId)
      files = files.filter(file => folderFileIds.includes(file.id))
    } else {
      files = []
    }
  } else if (activeFolder.value !== 'all') {
    // Filtrar por tipo de pasta do sistema
    files = files.filter(file => file.type === activeFolder.value)
  }
  
  // Filtrar por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    files = files.filter(file =>
      file.name.toLowerCase().includes(query) ||
      (file.description && file.description.toLowerCase().includes(query))
    )
  }
  
  return files
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(allFilteredFiles.value.length / itemsPerPage)
})

// Filtrar arquivos com paginação (apenas para "All Files")
const filteredFiles = computed(() => {
  let files = allFilteredFiles.value
  
  // Aplicar paginação apenas para "All Files"
  if (activeFolder.value === 'all') {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    files = files.slice(startIndex, endIndex)
  }
  
  return files
})

// Helper functions
const getFolderName = (folderId) => {
  if (folderId === 'all') return 'All Files'
  const systemFolder = systemFolders.value.find(f => f.id === folderId)
  if (systemFolder) return systemFolder.name
  const customFolder = customFolders.value.find(f => f.id === folderId)
  if (customFolder) return customFolder.name
  return 'Files'
}

const getFileTypeClass = (type) => {
  const classes = {
    mannequin: {
      icon: ['fas', 'user'],
      bg: 'bg-blue-500/20',
      border: 'border-blue-400/30',
      text: 'text-blue-600',
      badge: 'bg-blue-500/20 text-blue-700 border border-blue-400/30'
    },
    presentation: {
      icon: ['fas', 'image'],
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-400/30',
      text: 'text-emerald-600',
      badge: 'bg-emerald-500/20 text-emerald-700 border border-emerald-400/30'
    },
    video: {
      icon: ['fas', 'video'],
      bg: 'bg-purple-500/20',
      border: 'border-purple-400/30',
      text: 'text-purple-600',
      badge: 'bg-purple-500/20 text-purple-700 border border-purple-400/30'
    },
    'control-motion': {
      icon: ['fas', 'film'],
      bg: 'bg-amber-500/20',
      border: 'border-amber-400/30',
      text: 'text-amber-600',
      badge: 'bg-amber-500/20 text-amber-700 border border-amber-400/30'
    },
    'face-swap': {
      icon: ['fas', 'user-friends'],
      bg: 'bg-pink-500/20',
      border: 'border-pink-400/30',
      text: 'text-pink-600',
      badge: 'bg-pink-500/20 text-pink-700 border border-pink-400/30'
    }
  }
  return classes[type] || classes.mannequin
}

const getFileTypeLabel = (type) => {
  const labels = {
    mannequin: 'Mannequin',
    presentation: 'Presentation',
    video: 'Video',
    'control-motion': 'Control Motion',
    'face-swap': 'Face Swap'
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Ações
const selectFolder = (folderId) => {
  activeFolder.value = folderId
  selectedFiles.value = []
  showContextMenu.value = false
  currentPage.value = 1 // Reset to first page when changing folder
}

// Pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top of files table
    const filesTable = document.querySelector('.backdrop-blur-xl.bg-white\\/30.border')
    if (filesTable) {
      filesTable.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const toggleFileSelection = (fileId) => {
  const index = selectedFiles.value.indexOf(fileId)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(fileId)
  }
}

const toggleSelectAll = () => {
  if (selectedFiles.value.length === filteredFiles.value.length) {
    selectedFiles.value = []
  } else {
    selectedFiles.value = filteredFiles.value.map(f => f.id)
  }
}

const clearSelection = () => {
  selectedFiles.value = []
}

const viewFile = (file) => {
  viewingFile.value = file
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const handleVideoLoaded = (event) => {
  // Video thumbnail loaded successfully
  // The browser will automatically show the first frame
  if (event.target) {
    event.target.currentTime = 0.1 // Seek to a small time to show a frame
  }
}

const downloadFile = async (file) => {
  if (!file.url) {
    alert('No file available to download.')
    return
  }
  try {
    const isVideo = file.type === 'video' || file.type === 'control-motion'
    const extension = isVideo ? 'mp4' : 'png'
    const filename = `${(file.name || 'file').replace(/\s+/g, '_')}.${extension}`

    // URLs do GCS bloqueiam fetch direto por CORS — usar backend como proxy
    const isGcsUrl = file.url.startsWith('https://storage.googleapis.com/')

    if (isGcsUrl) {
      if (isVideo) {
        const response = await fetch(`${API_URL}/api/download-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: file.url }),
          credentials: 'include'
        })
        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err.error || response.statusText)
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const response = await fetch(`${API_URL}/api/download-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: file.url }),
          credentials: 'include'
        })
        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err.error || response.statusText)
        }
        const { base64 } = await response.json()
        const byteChars = atob(base64)
        const byteNumbers = new Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i)
        const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/png' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } else {
      const response = await fetch(file.url, { credentials: 'include' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('Error downloading file:', error)
    alert(error.message || 'Error downloading file. Please try again.')
  }
}

const confirmDelete = (file) => {
  fileToDelete.value = file
}

const deleteFile = async () => {
  if (!fileToDelete.value) return
  
  deleting.value = true
  try {
    let success = false
    
    switch (fileToDelete.value.type) {
      case 'mannequin':
        success = await deleteMannequin(fileToDelete.value.id)
        break
      case 'presentation':
        success = await deletePresentation(fileToDelete.value.id)
        break
      case 'video':
        success = await deleteVideo(fileToDelete.value.id)
        break
      case 'control-motion':
        success = await deleteControlMotionVideo(fileToDelete.value.id)
        break
      case 'face-swap':
        success = await deleteFaceSwapRecord(fileToDelete.value.id)
        break
    }
    
    if (success) {
      await loadFiles()
      fileToDelete.value = null
      selectedFiles.value = selectedFiles.value.filter(id => id !== fileToDelete.value?.id)
    } else {
      alert('Error deleting file. Please try again.')
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    alert('Error deleting file. Please try again.')
  } finally {
    deleting.value = false
  }
}

// Gerenciamento de pastas
const closeFolderModal = () => {
  showCreateFolderModal.value = false
  editingFolder.value = null
  newFolderName.value = ''
  newFolderColor.value = '#3b82f6'
  newFolderIcon.value = 'folder-open'
}

const saveFolder = async () => {
  if (!newFolderName.value.trim()) return
  
  savingFolder.value = true
  try {
    if (editingFolder.value) {
      await updateFolder(editingFolder.value.id, newFolderName.value, newFolderColor.value, newFolderIcon.value)
    } else {
      await createFolder(newFolderName.value, newFolderColor.value, newFolderIcon.value)
    }
    await loadFiles()
    closeFolderModal()
  } catch (error) {
    console.error('Error saving folder:', error)
    alert('Error saving folder. Please try again.')
  } finally {
    savingFolder.value = false
  }
}

const editFolder = (folder) => {
  editingFolder.value = folder
  newFolderName.value = folder.name
  newFolderColor.value = folder.color || '#3b82f6'
  newFolderIcon.value = folder.icon || 'folder-open'
  showContextMenu.value = false
}

const confirmDeleteFolder = (folder) => {
  folderToDelete.value = folder
  showContextMenu.value = false
}

const deleteFolderConfirm = async () => {
  if (!folderToDelete.value) return
  
  deleting.value = true
  try {
    await deleteFolder(folderToDelete.value.id)
    await loadFiles()
    if (activeFolder.value === folderToDelete.value.id) {
      activeFolder.value = 'all'
    }
    folderToDelete.value = null
  } catch (error) {
    console.error('Error deleting folder:', error)
    alert('Error deleting folder. Please try again.')
  } finally {
    deleting.value = false
  }
}

const showFolderContextMenu = (event, folder) => {
  contextMenuFolder.value = folder
  showContextMenu.value = true
  // Fechar menu ao clicar fora
  setTimeout(() => {
    const closeMenu = (e) => {
      if (!e.target.closest('.backdrop-blur-xl')) {
        showContextMenu.value = false
        document.removeEventListener('click', closeMenu)
      }
    }
    document.addEventListener('click', closeMenu)
  }, 100)
}

// Toast helper
const showToastMessage = (type, title, message) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
}

const moveFilesToFolder = async (folderId) => {
  if (selectedFiles.value.length === 0) return
  
  try {
    const folder = folders.value.find(f => f.id === folderId) || 
                   systemFolders.value.find(f => f.id === folderId)
    const folderName = folder?.name || 'folder'
    let movedCount = 0
    
    for (const fileId of selectedFiles.value) {
      const file = allFiles.value.find(f => f.id === fileId)
      if (file) {
        // Check if already in folder (only for custom folders)
        if (folder && folder.files) {
          const fileAlreadyInFolder = folder.files.some(
            f => f.type === file.type && f.fileId === file.id
          )
          if (fileAlreadyInFolder) continue
        }
        
        await addFileToFolder(folderId, file.type, file.id)
        movedCount++
      }
    }
    
    await loadFiles()
    selectedFiles.value = []
    showMoveToFolderModal.value = false
    
    if (movedCount > 0) {
      showToastMessage('success', 'Files moved!', `${movedCount} file(s) moved to ${folderName} successfully.`)
    } else {
      showToastMessage('error', 'No files moved', 'All selected files are already in this folder.')
    }
  } catch (error) {
    console.error('Error moving files:', error)
    const errorMessage = error.message || 'Error moving files. Please try again.'
    showToastMessage('error', 'Error moving', errorMessage)
  }
}

// Drag and Drop handlers
const handleDragStart = (event, file) => {
  isDragging.value = true
  draggingFile.value = file
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', file.id)
  // Adicionar feedback visual
  if (event.target) {
    event.target.style.opacity = '0.5'
  }
}

const handleDragEnd = (event) => {
  isDragging.value = false
  draggingFile.value = null
  dragOverFolder.value = null
  // Restaurar opacidade
  if (event.target) {
    event.target.style.opacity = '1'
  }
}

const handleDragOver = (event, folderId) => {
  event.preventDefault()
  if (draggingFile.value) {
    dragOverFolder.value = folderId
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragLeave = (event) => {
  // Só limpar se realmente saiu do elemento (não apenas entrou em um filho)
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    dragOverFolder.value = null
  }
}

const handleDrop = async (event, folderId) => {
  event.preventDefault()
  dragOverFolder.value = null
  
  if (!draggingFile.value) return
  
  // Don't allow moving to system folders (only custom folders)
  if (['all', 'mannequin', 'presentation', 'video', 'control-motion'].includes(folderId)) {
    showToastMessage('error', 'Action not allowed', 'You can only move files to custom folders. Create a custom folder first.')
    draggingFile.value = null
    return
  }
  
  // Check if file is already in folder
  const folder = folders.value.find(f => f.id === folderId)
  if (folder && folder.files) {
    const fileAlreadyInFolder = folder.files.some(
      f => f.type === draggingFile.value.type && f.fileId === draggingFile.value.id
    )
    if (fileAlreadyInFolder) {
      showToastMessage('error', 'File already exists', 'This file is already in this folder.')
      draggingFile.value = null
      return
    }
  }
  
  // Save values before clearing draggingFile
  const fileToMove = draggingFile.value
  const folderName = folder?.name || 'folder'
  
  try {
    await addFileToFolder(folderId, fileToMove.type, fileToMove.id)
    await loadFiles()
    
    // Visual feedback on success (if element exists)
    if (event.currentTarget) {
      const folderElement = event.currentTarget
      folderElement.classList.add('animate-pulse')
      setTimeout(() => {
        if (folderElement) {
          folderElement.classList.remove('animate-pulse')
        }
      }, 500)
    }
    
    // Show success toast
    showToastMessage('success', 'File moved!', `${fileToMove.name} was moved to ${folderName} successfully.`)
    
    draggingFile.value = null
  } catch (error) {
    console.error('Error moving file:', error)
    const errorMessage = error.message || 'Error moving file. Please try again.'
    showToastMessage('error', 'Error moving', errorMessage)
    draggingFile.value = null
  }
}

// Carregar arquivos
const loadFiles = async () => {
  loading.value = true
  try {
    const [mannequinsData, presentationsData, videosData, controlMotionData, faceSwapData, foldersData] = await Promise.all([
      fetchMannequins(),
      fetchPresentations(),
      fetchVideos(),
      fetchControlMotionVideos(),
      fetchFaceSwapResults(),
      fetchFolders()
    ])
    
    mannequins.value = mannequinsData || []
    presentations.value = presentationsData || []
    videos.value = videosData || []
    controlMotionVideos.value = controlMotionData || []
    faceSwapResults.value = faceSwapData || []
    folders.value = foldersData || []
  } catch (error) {
    console.error('Error loading files:', error)
    alert('Error loading files. Please try again.')
  } finally {
    loading.value = false
  }
}

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

// Watch for folder changes to reset pagination
watch(activeFolder, () => {
  currentPage.value = 1
})

// Load files on mount
onMounted(() => {
  loadFiles()
})

// Fechar menu de contexto ao clicar fora
onMounted(() => {
  document.addEventListener('click', () => {
    if (showContextMenu.value) {
      showContextMenu.value = false
    }
  })
})
</script>
