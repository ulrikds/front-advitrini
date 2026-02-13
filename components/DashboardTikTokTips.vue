<template>
  <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 bg-pink-400/10 rounded-full blur-3xl -mr-20 -mt-20" />
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-rose-400/5 rounded-full blur-2xl -ml-8 -mb-8" />

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 class="text-lg sm:text-xl font-bold text-slate-800">
          Best times to post on TikTok
        </h2>
        <div class="flex items-center gap-2 backdrop-blur-sm bg-pink-500/15 border border-pink-400/30 px-2.5 py-1.5 rounded-lg">
          <font-awesome-icon :icon="['fab', 'tiktok']" class="text-pink-600 text-sm" />
          <span class="text-xs font-semibold text-pink-700">Peak engagement</span>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-slate-600 mb-4">
        Post during these hours for higher reach. Times are suggestions based on general audience data—test what works for your niche.
      </p>

      <!-- Day cards -->
      <div class="flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        <button
          v-for="day in weekDays"
          :key="day.key"
          type="button"
          class="relative flex-shrink-0 flex flex-col items-stretch rounded-xl border-2 transition-all duration-300 text-left overflow-visible min-h-[3.5rem]"
          :class="[
            expandedDay === day.key
              ? 'bg-pink-500/15 border-pink-400/50 shadow-lg shadow-pink-500/10 min-w-[11rem] sm:min-w-[13rem] p-3 sm:p-4'
              : 'bg-white/40 border-white/50 hover:bg-white/60 hover:border-pink-300/50 p-3 min-w-[4.5rem] sm:min-w-[5.5rem]',
            day.key === todayKey ? 'pt-6 sm:pt-7 ring-2 ring-pink-400/40' : ''
          ]"
          @click="expandedDay = expandedDay === day.key ? expandedDay : day.key"
        >
          <!-- Today badge -->
          <div
            v-if="day.key === todayKey"
            class="absolute -top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          >
            <span class="relative flex h-3 w-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span class="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-md ring-2 ring-white/90" />
            </span>
            <span class="mt-1 text-[10px] sm:text-xs font-bold text-pink-600 uppercase tracking-wider">Today</span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <span
              class="font-semibold text-sm sm:text-base truncate"
              :class="expandedDay === day.key ? 'text-pink-700' : 'text-slate-700'"
            >
              {{ day.label }}
            </span>
            <span v-if="expandedDay !== day.key" class="flex-shrink-0 text-pink-500/80">
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-xs" />
            </span>
            <span v-else class="flex-shrink-0 rounded-full bg-pink-500/25 p-1.5">
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-pink-600 text-xs" />
            </span>
          </div>

          <div v-show="expandedDay === day.key" class="mt-3 pt-3 border-t border-pink-400/25 space-y-2.5">
            <p class="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wide">Best times</p>
            <ul class="space-y-2">
              <li
                v-for="(time, i) in day.times"
                :key="i"
                class="flex items-center gap-2.5 text-sm text-slate-700"
              >
                <span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/20 border border-pink-400/30">
                  <font-awesome-icon :icon="['fas', 'clock']" class="text-pink-600 text-xs" />
                </span>
                <span class="font-medium">{{ time }}</span>
              </li>
            </ul>
          </div>
        </button>
      </div>
      <p class="text-[10px] sm:text-xs text-slate-500 mt-3 text-center sm:text-left">Swipe to see all days</p>
    </div>
  </div>
</template>

<script setup>
const weekDays = [
  { key: 'mon', label: 'Monday', times: ['6am', '10am', '10pm'] },
  { key: 'tue', label: 'Tuesday', times: ['2am', '4am', '9am'] },
  { key: 'wed', label: 'Wednesday', times: ['7am', '8am', '11pm'] },
  { key: 'thu', label: 'Thursday', times: ['9am', '12pm', '7pm'] },
  { key: 'fri', label: 'Friday', times: ['5am', '1pm', '3pm'] },
  { key: 'sat', label: 'Saturday', times: ['11am', '7pm', '8pm'] },
  { key: 'sun', label: 'Sunday', times: ['7am', '8am', '4pm'] },
]

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const todayKey = dayKeys[new Date().getDay()]
const expandedDay = ref(todayKey)
</script>
