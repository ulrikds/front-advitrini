<template>
  <div>
    <!-- Color Display & Input -->
    <div class="flex items-center space-x-4">
      <!-- Color Preview -->
      <div
        class="w-20 h-12 border-2 border-gray-200 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        :style="{ backgroundColor: modelValue }"
        @click="showPicker = true"
      >
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <font-awesome-icon :icon="['fas', 'palette']" class="text-white text-lg drop-shadow-lg" />
        </div>
      </div>
      
      <!-- Hex Input -->
      <div class="flex-1 relative">
        <input
          v-model="hexValue"
          type="text"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500 font-mono text-sm"
          placeholder="#3B82F6"
          @input="handleHexInput"
          @blur="validateHex"
          @focus="showPicker = true"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            @click="showPicker = true"
            class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Open color picker"
          >
            <font-awesome-icon :icon="['fas', 'palette']" class="text-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- Color Picker Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showPicker"
          class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[100] p-4"
          @click.self="closePicker"
        >
        <div
          class="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
          @click.stop
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          </div>
          
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0 relative z-10">
            <div class="flex items-center space-x-4">
              <div class="bg-blue-100 border border-blue-300 p-3 rounded-xl shadow-lg">
                <font-awesome-icon :icon="['fas', 'palette']" class="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Select Color</h2>
                <p class="text-gray-700 text-sm font-medium">Choose a color from the palette or enter a hex code</p>
              </div>
            </div>
            <button
              @click="closePicker"
              class="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-6 relative z-10">
            <!-- Current Color Preview -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Selected Color</label>
              <div class="flex items-center space-x-4">
                <div
                  class="w-24 h-24 border-4 border-gray-200 rounded-xl shadow-lg"
                  :style="{ backgroundColor: modelValue }"
                ></div>
                <div class="flex-1">
                  <input
                    v-model="hexValue"
                    type="text"
                    class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/40 transition-all text-gray-900 placeholder-gray-500 font-mono text-lg font-bold"
                    placeholder="#3B82F6"
                    @input="handleHexInput"
                    @blur="validateHex"
                  />
                  <p class="text-xs text-gray-500 mt-2 font-medium">Enter hex code (e.g., #3B82F6)</p>
                </div>
              </div>
            </div>

            <!-- Preset Colors Grid -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Preset Colors</label>
              <div class="grid grid-cols-8 gap-3">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  @click="selectColor(color)"
                  class="w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  :class="modelValue === color ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-2' : 'border-gray-200 hover:border-gray-300'"
                  :style="{ backgroundColor: color }"
                  :title="color"
                >
                  <font-awesome-icon
                    v-if="modelValue === color"
                    :icon="['fas', 'check']"
                    class="text-white text-sm drop-shadow-lg"
                  />
                </button>
              </div>
            </div>

            <!-- Custom Color Input (Native) -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Custom Color Picker</label>
              <div class="flex items-center space-x-4">
                <input
                  ref="colorInput"
                  type="color"
                  :value="modelValue"
                  @input="handleColorInput"
                  class="w-20 h-20 border-2 border-gray-200 rounded-xl cursor-pointer shadow-lg"
                />
                <div class="flex-1">
                  <p class="text-sm text-gray-700 font-medium mb-2">Use the color picker above to select any color</p>
                  <p class="text-xs text-gray-500">Click on the color square to open the native color picker</p>
                </div>
              </div>
            </div>

            <!-- Color Categories -->
            <div class="space-y-4">
              <div v-for="(category, categoryName) in colorCategories" :key="categoryName">
                <label class="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">{{ categoryName }}</label>
                <div class="grid grid-cols-8 gap-2">
                  <button
                    v-for="color in category"
                    :key="color"
                    @click="selectColor(color)"
                    class="w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md"
                    :class="modelValue === color ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-200 hover:border-gray-300'"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  >
                    <font-awesome-icon
                      v-if="modelValue === color"
                      :icon="['fas', 'check']"
                      class="text-white text-xs drop-shadow-lg"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl flex-shrink-0 relative z-10">
            <button
              @click="closePicker"
              class="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              @click="confirmColor"
              class="px-6 py-3 backdrop-blur-sm bg-blue-500/30 border border-blue-400/40 text-blue-700 rounded-xl hover:bg-blue-500/40 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: '#3B82F6'
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const hexValue = ref(props.modelValue)
const colorInput = ref(null)

// Preset colors (common colors)
const presetColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#A855F7', // Violet
  '#F43F5E', // Rose
  '#64748B', // Slate
  '#000000', // Black
  '#FFFFFF', // White
]

// Color categories
const colorCategories = {
  'Blues': ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554', '#0F172A'],
  'Greens': ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#14532D', '#052E16'],
  'Reds': ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#7F1D1D', '#450A0A'],
  'Purples': ['#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE', '#6B21A8', '#581C87', '#581C87', '#3B0764'],
  'Oranges': ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#7C2D12', '#431407'],
  'Grays': ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827', '#0F172A', '#000000'],
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  hexValue.value = newValue
})

// Handle color input (native picker)
const handleColorInput = (event) => {
  const color = event.target.value
  hexValue.value = color
  emit('update:modelValue', color)
}

// Handle hex input
const handleHexInput = (event) => {
  let value = event.target.value.trim()
  
  // Add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
  }
  
  // Limit to 7 characters (#RRGGBB)
  if (value.length > 7) {
    value = value.substring(0, 7)
  }
  
  hexValue.value = value
  
  // Validate and update if valid
  if (isValidHex(value)) {
    emit('update:modelValue', value.toUpperCase())
  }
}

// Validate hex on blur
const validateHex = () => {
  if (!isValidHex(hexValue.value)) {
    // Reset to current modelValue if invalid
    hexValue.value = props.modelValue
  } else {
    emit('update:modelValue', hexValue.value.toUpperCase())
  }
}

// Check if hex is valid
const isValidHex = (hex) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

// Select color from preset or category
const selectColor = (color) => {
  hexValue.value = color
  emit('update:modelValue', color)
}

// Close picker
const closePicker = () => {
  showPicker.value = false
  // Reset hex value to current modelValue if user cancels
  hexValue.value = props.modelValue
}

// Confirm and close picker
const confirmColor = () => {
  validateHex()
  showPicker.value = false
}

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: all 0.3s ease;
}

.modal-enter-from > div {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to > div {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>