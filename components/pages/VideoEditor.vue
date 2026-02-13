<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-4 sm:mb-6 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="backdrop-blur-sm bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'edit']" class="text-purple-600 text-lg sm:text-xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-slate-700 bg-clip-text text-transparent mb-1">
              Video Editor
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-purple-500 text-xs" />
              <span>Edit, cut, and combine your videos</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Selection -->
    <div class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Select Main Video</h2>
      <div v-if="!selectedMainVideo" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="video in availableVideos"
            :key="video.id"
            @click="selectMainVideo(video)"
            class="cursor-pointer backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-3 sm:p-4 hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            <div class="aspect-video bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
              <video
                v-if="video.url"
                :src="video.url"
                class="w-full h-full object-cover"
                @loadedmetadata="updateVideoDuration($event, video)"
              ></video>
              <div v-else class="w-full h-full flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'video']" class="text-purple-600 text-4xl" />
              </div>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ formatDuration(video.duration || 0) }}
              </div>
            </div>
            <p class="font-semibold text-sm text-slate-800 truncate">{{ video.title || video.name || 'Untitled Video' }}</p>
            <p class="text-xs text-slate-600 mt-1">{{ formatDate(video.createdAt) }}</p>
          </div>
        </div>
        <div v-if="availableVideos.length === 0" class="text-center py-8 text-slate-600">
          <font-awesome-icon :icon="['fas', 'video']" class="text-4xl mb-3 opacity-50" />
          <p class="text-sm">No videos available. Create videos first.</p>
        </div>
      </div>
      <div v-else class="flex items-center justify-between backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-3 sm:p-4">
        <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div class="aspect-video w-24 sm:w-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex-shrink-0 overflow-hidden">
            <video
              v-if="selectedMainVideo.url"
              :src="selectedMainVideo.url"
              class="w-full h-full object-cover"
            ></video>
            <div v-else class="w-full h-full flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'video']" class="text-purple-600 text-2xl" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm sm:text-base text-slate-800 truncate">{{ selectedMainVideo.title || selectedMainVideo.name || 'Untitled Video' }}</p>
            <p class="text-xs sm:text-sm text-slate-600">Duration: {{ formatDuration(selectedMainVideo.duration || 0) }}</p>
          </div>
        </div>
        <button
          @click="selectedMainVideo = null; timelineSegments = []"
          class="px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-red-700 font-medium text-xs sm:text-sm"
        >
          Change Video
        </button>
      </div>
    </div>

    <!-- Video Preview -->
    <div v-if="selectedMainVideo" class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Video Preview</h2>
      <div class="relative flex justify-center">
        <div class="relative w-full max-w-[1000px]">
          <video
            ref="previewVideo"
            :src="selectedMainVideo.url"
            class="w-full h-auto rounded-lg shadow-lg bg-black max-h-[520px] object-contain"
            controls
            @timeupdate="updateCurrentTime"
            @loadedmetadata="onVideoLoaded"
            style="max-width: 1000px; max-height: 520px;"
          ></video>
          <div class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">
            Current: {{ formatTime(currentVideoTime) }} / {{ formatDuration(totalDuration) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Editor -->
    <div v-if="selectedMainVideo" class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="flex items-center justify-between mb-3 sm:mb-4">
        <h2 class="text-base sm:text-lg font-semibold text-slate-800">Timeline Editor</h2>
        <div class="flex items-center gap-2 sm:gap-3">
          <div v-if="cutStartTime !== null" class="text-xs sm:text-sm text-purple-700 font-medium">
            Start: {{ formatTime(cutStartTime) }}
          </div>
          <button
            @click="toggleCutMode"
            :class="[
              'p-2 sm:p-3 backdrop-blur-sm border rounded-lg sm:rounded-xl transition-all duration-300',
              isCutModeActive
                ? 'bg-purple-500/30 border-purple-400/40 text-purple-700 shadow-lg'
                : 'bg-purple-500/20 border-purple-400/30 text-purple-700 hover:bg-purple-500/30'
            ]"
            :title="isCutModeActive ? 'Click on timeline to mark cut positions' : 'Enable cut mode'"
          >
            <font-awesome-icon :icon="['fas', 'cut']" class="text-base sm:text-lg" />
          </button>
          <button
            v-if="cutStartTime !== null"
            @click="cancelCut"
            class="p-2 sm:p-3 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded-lg sm:rounded-xl hover:bg-red-500/30 transition-all duration-300 text-red-700"
            title="Cancel cut"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-base sm:text-lg" />
          </button>
        </div>
      </div>

      <!-- Timeline Visualization -->
      <div class="mb-4">
        <div 
          ref="timelineContainer"
          @click="handleTimelineClick"
          @mousemove="handleTimelineMouseMove"
          @mouseleave="handleTimelineMouseLeave"
          :class="[
            'relative h-20 sm:h-24 bg-slate-100/50 rounded-lg overflow-hidden border border-slate-200/50',
            isCutModeActive ? 'cursor-crosshair' : 'cursor-pointer'
          ]"
        >
          <!-- Time markers -->
          <div class="absolute inset-0 flex pointer-events-none">
            <div
              v-for="marker in timeMarkers"
              :key="marker"
              class="flex-1 border-l border-slate-300/50 relative"
            >
              <div class="absolute top-0 left-0 text-[8px] sm:text-xs text-slate-600 px-1">
                {{ formatTime(marker) }}
              </div>
            </div>
          </div>
          
          <!-- Current time indicator -->
          <div
            v-if="currentVideoTime > 0"
            class="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-blue-500 z-20 pointer-events-none"
            :style="{ left: `${(currentVideoTime / totalDuration) * 100}%` }"
          >
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
          
          <!-- Cut start marker -->
          <div
            v-if="cutStartTime !== null"
            class="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-purple-500 z-30 pointer-events-none"
            :style="{ left: `${(cutStartTime / totalDuration) * 100}%` }"
          >
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
            <div class="absolute top-6 left-1/2 transform -translate-x-1/2 bg-purple-500/90 text-white text-[8px] sm:text-xs px-1.5 py-0.5 rounded whitespace-nowrap">
              Start
            </div>
          </div>
          
          <!-- Cut end marker (preview) -->
          <div
            v-if="cutEndTime !== null && cutStartTime !== null"
            class="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-purple-400 z-30 pointer-events-none"
            :style="{ left: `${(cutEndTime / totalDuration) * 100}%` }"
          >
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full border-2 border-white shadow-lg"></div>
            <div class="absolute top-6 left-1/2 transform -translate-x-1/2 bg-purple-400/90 text-white text-[8px] sm:text-xs px-1.5 py-0.5 rounded whitespace-nowrap">
              End
            </div>
          </div>
          
          <!-- Preview cut area -->
          <div
            v-if="cutStartTime !== null && cutEndTime !== null"
            class="absolute top-0 bottom-0 bg-purple-500/30 border-2 border-purple-400/60 z-25 pointer-events-none"
            :style="{
              left: `${(Math.min(cutStartTime, cutEndTime) / totalDuration) * 100}%`,
              width: `${(Math.abs(cutEndTime - cutStartTime) / totalDuration) * 100}%`
            }"
          ></div>
          
          <!-- Video segments (existing cuts) -->
          <div class="absolute inset-0 flex items-center pointer-events-none">
            <div
              v-for="(segment, index) in timelineSegments"
              :key="index"
              class="h-full bg-gradient-to-r from-purple-500/40 to-purple-600/40 border border-purple-400/60 rounded flex items-center justify-center relative group"
              :style="{
                width: `${(segment.end - segment.start) / totalDuration * 100}%`,
                marginLeft: `${segment.start / totalDuration * 100}%`
              }"
            >
              <span class="text-[8px] sm:text-xs text-white font-semibold px-1">
                {{ formatDuration(segment.end - segment.start) }}
              </span>
              <button
                @click.stop="removeCutSegment(index)"
                class="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] sm:text-xs pointer-events-auto"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2 text-xs sm:text-sm text-slate-600">
          <span>Total: {{ formatDuration(totalDuration) }}</span>
          <span>After cuts: {{ formatDuration(remainingDuration) }}</span>
        </div>
      </div>

      <!-- Cut Segments List -->
      <div v-if="timelineSegments.length > 0" class="space-y-2">
        <div
          v-for="(segment, index) in timelineSegments"
          :key="index"
          class="backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg p-3 sm:p-4"
        >
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="text-xs sm:text-sm font-semibold text-purple-700">Cut {{ index + 1 }}</span>
              <div class="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                <span>From: {{ formatTime(segment.start) }}</span>
                <span>To: {{ formatTime(segment.end) }}</span>
                <span class="text-purple-700 font-medium">({{ formatDuration(segment.end - segment.start) }})</span>
              </div>
            </div>
            <button
              @click="removeCutSegment(index)"
              class="px-2 sm:px-3 py-1 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded hover:bg-red-500/30 transition-all duration-300 text-red-700 text-xs sm:text-sm"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Videos -->
    <div v-if="selectedMainVideo" class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Add Videos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <button
          @click="showAddVideoModal = true; addVideoPosition = 'start'"
          class="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4 hover:bg-white/30 hover:border-white/40 transition-all duration-300 text-center"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-purple-600 text-2xl mb-2" />
          <p class="font-semibold text-sm text-slate-800">Add at Start</p>
          <p class="text-xs text-slate-600 mt-1">{{ addedVideosStart.length }} video(s)</p>
        </button>
        <button
          @click="showAddVideoModal = true; addVideoPosition = 'end'"
          class="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4 hover:bg-white/30 hover:border-white/40 transition-all duration-300 text-center"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-purple-600 text-2xl mb-2" />
          <p class="font-semibold text-sm text-slate-800">Add at End</p>
          <p class="text-xs text-slate-600 mt-1">{{ addedVideosEnd.length }} video(s)</p>
        </button>
      </div>

      <!-- Added Videos Start -->
      <div v-if="addedVideosStart.length > 0" class="mb-4">
        <h3 class="text-sm font-semibold text-slate-700 mb-2">Videos at Start:</h3>
        <div class="space-y-2">
          <div
            v-for="(video, index) in addedVideosStart"
            :key="`start-${index}`"
            class="flex items-center justify-between backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg p-2 sm:p-3"
          >
            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div class="aspect-video w-16 sm:w-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded flex-shrink-0 overflow-hidden">
                <video
                  v-if="video.url"
                  :src="video.url"
                  class="w-full h-full object-cover"
                ></video>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-xs sm:text-sm text-slate-800 truncate">{{ video.title || video.name || 'Untitled' }}</p>
                <p class="text-xs text-slate-600">{{ formatDuration(video.duration || 0) }}</p>
              </div>
            </div>
            <button
              @click="removeAddedVideo('start', index)"
              class="px-2 py-1 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded hover:bg-red-500/30 transition-all duration-300 text-red-700 text-xs"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </div>

      <!-- Added Videos End -->
      <div v-if="addedVideosEnd.length > 0">
        <h3 class="text-sm font-semibold text-slate-700 mb-2">Videos at End:</h3>
        <div class="space-y-2">
          <div
            v-for="(video, index) in addedVideosEnd"
            :key="`end-${index}`"
            class="flex items-center justify-between backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg p-2 sm:p-3"
          >
            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div class="aspect-video w-16 sm:w-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded flex-shrink-0 overflow-hidden">
                <video
                  v-if="video.url"
                  :src="video.url"
                  class="w-full h-full object-cover"
                ></video>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-xs sm:text-sm text-slate-800 truncate">{{ video.title || video.name || 'Untitled' }}</p>
                <p class="text-xs text-slate-600">{{ formatDuration(video.duration || 0) }}</p>
              </div>
            </div>
            <button
              @click="removeAddedVideo('end', index)"
              class="px-2 py-1 backdrop-blur-sm bg-red-500/20 border border-red-400/30 rounded hover:bg-red-500/30 transition-all duration-300 text-red-700 text-xs"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compile Button -->
    <div v-if="selectedMainVideo" class="mb-4 sm:mb-6 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-slate-800 mb-1">Final Video</h3>
          <p class="text-xs sm:text-sm text-slate-600">
            Total duration: {{ formatDuration(finalVideoDuration) }}
          </p>
        </div>
        <button
          @click="compileVideo"
          :disabled="isCompiling"
          class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-gradient-to-r from-purple-500/30 to-purple-600/30 border border-purple-400/40 text-purple-700 rounded-lg sm:rounded-xl hover:from-purple-500/40 hover:to-purple-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <font-awesome-icon v-if="!isCompiling" :icon="['fas', 'film']" />
          <span v-if="isCompiling" class="animate-spin">⏳</span>
          <span>{{ isCompiling ? 'Compiling...' : 'Compile Video' }}</span>
        </button>
      </div>
    </div>

    <!-- Add Video Modal -->
    <div
      v-if="showAddVideoModal"
      @click.self="showAddVideoModal = false"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
    >
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg sm:text-xl font-bold text-slate-800">
            Add Video at {{ addVideoPosition === 'start' ? 'Start' : 'End' }}
          </h3>
          <button
            @click="showAddVideoModal = false"
            class="p-2 hover:bg-white/40 rounded-lg transition-all duration-300"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-slate-600" />
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            v-for="video in availableVideosForAdding"
            :key="video.id"
            @click="addVideoToTimeline(video)"
            class="cursor-pointer backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-3 sm:p-4 hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            <div class="aspect-video bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
              <video
                v-if="video.url"
                :src="video.url"
                class="w-full h-full object-cover"
              ></video>
              <div v-else class="w-full h-full flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'video']" class="text-purple-600 text-4xl" />
              </div>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ formatDuration(video.duration || 0) }}
              </div>
            </div>
            <p class="font-semibold text-sm text-slate-800 truncate">{{ video.title || video.name || 'Untitled Video' }}</p>
          </div>
        </div>
        <div v-if="availableVideosForAdding.length === 0" class="text-center py-8 text-slate-600">
          <p class="text-sm">No other videos available to add.</p>
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
const backendStorage = useBackendStorage()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// State
const availableVideos = ref([])
const selectedMainVideo = ref(null)
const timelineSegments = ref([]) // Array of { start, end } for cuts
const addedVideosStart = ref([])
const addedVideosEnd = ref([])
const showAddVideoModal = ref(false)
const addVideoPosition = ref('start') // 'start' or 'end'
const isCompiling = ref(false)
const currentVideoTime = ref(0)
const previewVideo = ref(null)
const timelineContainer = ref(null)
const isCutModeActive = ref(false)
const cutStartTime = ref(null)
const cutEndTime = ref(null)

// Toast
const showToast = ref(false)
const toastType = ref('success')
const toastTitle = ref('')
const toastMessage = ref('')

// Computed
const totalDuration = computed(() => {
  return selectedMainVideo.value?.duration || 0
})

const remainingDuration = computed(() => {
  if (!selectedMainVideo.value) return 0
  let duration = totalDuration.value
  timelineSegments.value.forEach(segment => {
    duration -= (segment.end - segment.start)
  })
  return Math.max(0, duration)
})

const finalVideoDuration = computed(() => {
  let duration = remainingDuration.value
  addedVideosStart.value.forEach(video => {
    duration += (video.duration || 0)
  })
  addedVideosEnd.value.forEach(video => {
    duration += (video.duration || 0)
  })
  return duration
})

const timeMarkers = computed(() => {
  const markers = []
  const step = totalDuration.value / 10
  for (let i = 0; i <= 10; i++) {
    markers.push(i * step)
  }
  return markers
})

const availableVideosForAdding = computed(() => {
  if (!selectedMainVideo.value) return availableVideos.value
  return availableVideos.value.filter(v => v.id !== selectedMainVideo.value.id)
})

// Methods
const loadVideos = async () => {
  try {
    const [videos, controlMotionVideos] = await Promise.all([
      backendStorage.fetchVideos(),
      backendStorage.fetchControlMotionVideos()
    ])
    
    const allVideos = [
      ...(videos || []).map(v => ({
        ...v,
        url: v.generatedVideoUrl || v.generatedVideo,
        title: v.title,
        name: v.title,
        type: 'video'
      })),
      ...(controlMotionVideos || []).map(v => ({
        ...v,
        url: v.generatedVideoUrl || v.generatedVideo,
        title: v.title,
        name: v.title,
        type: 'control-motion'
      }))
    ]
    
    availableVideos.value = allVideos
  } catch (error) {
    console.error('Error loading videos:', error)
    showToastMessage('error', 'Error', 'Failed to load videos')
  }
}

const selectMainVideo = (video) => {
  selectedMainVideo.value = { ...video }
  timelineSegments.value = []
  addedVideosStart.value = []
  addedVideosEnd.value = []
  currentVideoTime.value = 0
  cancelCut()
  isCutModeActive.value = false
  // Reset video player when selecting new video
  nextTick(() => {
    if (previewVideo.value) {
      previewVideo.value.currentTime = 0
    }
  })
}

const updateVideoDuration = (event, video) => {
  if (event.target && event.target.duration) {
    video.duration = event.target.duration
  }
}


const removeCutSegment = (index) => {
  timelineSegments.value.splice(index, 1)
}

const addVideoToTimeline = (video) => {
  if (addVideoPosition.value === 'start') {
    addedVideosStart.value.push({ ...video })
  } else {
    addedVideosEnd.value.push({ ...video })
  }
  showAddVideoModal.value = false
}

const removeAddedVideo = (position, index) => {
  if (position === 'start') {
    addedVideosStart.value.splice(index, 1)
  } else {
    addedVideosEnd.value.splice(index, 1)
  }
}

const compileVideo = async () => {
  if (!selectedMainVideo.value) return
  
  isCompiling.value = true
  showToastMessage('loading', 'Compiling Video', 'Please wait while we compile your video...')
  
  try {
    // Prepare compilation data
    const compilationData = {
      mainVideoId: selectedMainVideo.value.id,
      mainVideoType: selectedMainVideo.value.type,
      cuts: timelineSegments.value,
      videosAtStart: addedVideosStart.value.map(v => ({ id: v.id, type: v.type })),
      videosAtEnd: addedVideosEnd.value.map(v => ({ id: v.id, type: v.type }))
    }
    
    // Call backend API to compile video
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CompileVideo($input: CompileVideoInput!) {
            compileVideo(input: $input) {
              id
              url
              duration
              createdAt
            }
          }
        `,
        variables: {
          input: compilationData
        }
      })
    })
    
    const result = await response.json()
    
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    
    showToastMessage('success', 'Video Compiled!', 'Your video has been compiled successfully.')
    
    // Reload videos to show the new compiled video
    await loadVideos()
    
    // Reset editor
    selectedMainVideo.value = null
    timelineSegments.value = []
    addedVideosStart.value = []
    addedVideosEnd.value = []
  } catch (error) {
    console.error('Error compiling video:', error)
    showToastMessage('error', 'Compilation Error', error.message || 'Failed to compile video. Please try again.')
  } finally {
    isCompiling.value = false
  }
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTime = (seconds) => {
  return formatDuration(seconds)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const showToastMessage = (type, title, message) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
  if (type !== 'loading') {
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

// Video player methods
const seekToTime = (event) => {
  if (!previewVideo.value || !timelineContainer.value || !selectedMainVideo.value) return
  
  const rect = timelineContainer.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const targetTime = percentage * totalDuration.value
  
  // Clamp to valid range
  const clampedTime = Math.max(0, Math.min(targetTime, totalDuration.value))
  
  previewVideo.value.currentTime = clampedTime
  currentVideoTime.value = clampedTime
}

// Cut mode methods
const toggleCutMode = () => {
  isCutModeActive.value = !isCutModeActive.value
  if (!isCutModeActive.value) {
    cancelCut()
  }
}

const cancelCut = () => {
  cutStartTime.value = null
  cutEndTime.value = null
}

const getTimeFromEvent = (event) => {
  if (!timelineContainer.value || !selectedMainVideo.value) return null
  const rect = timelineContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const targetTime = percentage * totalDuration.value
  return Math.max(0, Math.min(targetTime, totalDuration.value))
}

const handleTimelineMouseMove = (event) => {
  if (!isCutModeActive.value || cutStartTime.value === null) return
  
  const time = getTimeFromEvent(event)
  if (time !== null) {
    cutEndTime.value = time
  }
}

const handleTimelineMouseLeave = () => {
  // Keep the end time when mouse leaves, so user can see the preview
  // Only clear if they haven't clicked yet
}

const handleTimelineClick = (event) => {
  const clampedTime = getTimeFromEvent(event)
  if (clampedTime === null) return
  
  if (isCutModeActive.value) {
    // Cut mode: mark start or end
    if (cutStartTime.value === null) {
      // First click: mark start
      cutStartTime.value = clampedTime
      cutEndTime.value = clampedTime // Initialize end time to same as start
      // Seek video to start position
      if (previewVideo.value) {
        previewVideo.value.currentTime = clampedTime
        currentVideoTime.value = clampedTime
      }
    } else {
      // Second click: mark end and create cut
      cutEndTime.value = clampedTime
      
      // Ensure start < end
      const start = Math.min(cutStartTime.value, cutEndTime.value)
      const end = Math.max(cutStartTime.value, cutEndTime.value)
      
      // Validate cut
      if (start >= end || end - start < 0.1) {
        showToastMessage('error', 'Invalid Cut', 'End time must be at least 0.1s after start time')
        cancelCut()
        return
      }
      
      // Check for overlaps with existing cuts
      const hasOverlap = timelineSegments.value.some(segment => {
        return (start >= segment.start && start < segment.end) ||
               (end > segment.start && end <= segment.end) ||
               (start <= segment.start && end >= segment.end)
      })
      
      if (hasOverlap) {
        showToastMessage('error', 'Invalid Cut', 'This cut overlaps with an existing cut')
        cancelCut()
        return
      }
      
      // Add cut segment
      timelineSegments.value.push({ start, end })
      timelineSegments.value.sort((a, b) => a.start - b.start)
      
      showToastMessage('success', 'Cut Added', `Cut from ${formatTime(start)} to ${formatTime(end)}`)
      
      // Reset for next cut
      cancelCut()
    }
  } else {
    // Normal mode: just seek
    seekToTime(event)
  }
}

const updateCurrentTime = (event) => {
  if (event.target) {
    currentVideoTime.value = event.target.currentTime
  }
}

const onVideoLoaded = (event) => {
  if (event.target && event.target.duration) {
    if (!selectedMainVideo.value.duration) {
      selectedMainVideo.value.duration = event.target.duration
    }
  }
}

// Load videos on mount
onMounted(() => {
  loadVideos()
})
</script>
