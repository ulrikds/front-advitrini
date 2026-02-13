<template>
  <Transition name="toast">
    <div
      v-if="show"
      class="fixed top-4 right-4 z-[100] max-w-md w-full"
    >
      <div class="backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
        
        <div class="relative z-10 flex items-start space-x-4">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div
              v-if="type === 'loading'"
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="iconColorClass"
            >
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-current"></div>
            </div>
            <div
              v-else-if="type === 'success'"
              class="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 border border-emerald-300"
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-emerald-600 text-2xl" />
            </div>
            <div
              v-else-if="type === 'error'"
              class="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 border border-red-300"
            >
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-600 text-2xl" />
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 border border-blue-300"
            >
              <font-awesome-icon :icon="icon" class="text-blue-600 text-2xl" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ title }}</h3>
            <p v-if="message" class="text-sm text-gray-700 leading-relaxed">{{ message }}</p>
            <div v-if="progress !== null" class="mt-3">
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="progressBarColorClass"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <p class="text-xs text-gray-600 mt-1 font-medium">{{ progress }}% complete</p>
            </div>
          </div>
          
          <!-- Close Button -->
          <button
            v-if="closable"
            @click="close"
            class="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-sm" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'loading', 'success', 'error', 'info'
    validator: (value) => ['loading', 'success', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  },
  icon: {
    type: Array,
    default: () => ['fas', 'info-circle']
  },
  closable: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: null // null = não fecha automaticamente
  }
})

const emit = defineEmits(['close'])

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'loading':
      return 'bg-blue-100 border border-blue-300'
    case 'success':
      return 'bg-emerald-100 border border-emerald-300'
    case 'error':
      return 'bg-red-100 border border-red-300'
    default:
      return 'bg-blue-100 border border-blue-300'
  }
})

const progressBarColorClass = computed(() => {
  switch (props.type) {
    case 'loading':
      return 'bg-blue-500'
    case 'success':
      return 'bg-emerald-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-blue-500'
  }
})

const close = () => {
  emit('close')
}

// Auto close if duration is set
watch(() => props.show, (newValue) => {
  if (newValue && props.duration && props.duration > 0) {
    setTimeout(() => {
      if (props.show) {
        close()
      }
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>