<template>
  <div
    v-if="file"
    @click.self="$emit('close')"
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm bg-black/40"
  >
    <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl max-w-xl w-full max-h-[75vh] overflow-auto">
      <div class="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h3 class="text-sm sm:text-base font-bold text-gray-900 truncate pr-2">{{ file.name }}</h3>
        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0 text-gray-800"
          aria-label="Close"
        >
          <font-awesome-icon :icon="['fas', 'times']" class="text-sm sm:text-base" />
        </button>
      </div>
      <div class="p-3 sm:p-4">
        <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          <div v-if="file.type === 'video' || file.type === 'control-motion'" class="w-full bg-white">
            <video
              :src="file.url"
              controls
              class="w-full rounded-none max-h-[50vh] object-contain bg-white"
            />
          </div>
          <div v-else class="w-full bg-white">
            <img
              :src="file.url"
              :alt="file.name"
              class="w-full rounded-none max-h-[50vh] object-contain bg-white mx-auto block"
            />
          </div>
        </div>
        <div class="mt-3 space-y-1.5 text-xs sm:text-sm text-gray-800">
          <p><strong class="text-gray-900">Type:</strong> {{ fileTypeLabel }}</p>
          <p v-if="file.description"><strong class="text-gray-900">Description:</strong> {{ file.description }}</p>
          <p><strong class="text-gray-900">Created at:</strong> {{ formattedDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
})

defineEmits(['close'])

const fileTypeLabel = computed(() => {
  const labels = {
    mannequin: 'Mannequin',
    presentation: 'Presentation',
    video: 'Video',
    'control-motion': 'Control Motion',
  }
  return labels[props.file?.type] || props.file?.type || ''
})

const formattedDate = computed(() => {
  const dateString = props.file?.createdAt
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>
