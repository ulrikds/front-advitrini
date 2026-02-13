<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
      <img src="/logo_maior.png" alt="VitrinAI" class="w-[600px] h-auto object-contain" />
    </div>

    <div class="max-w-xl w-full bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 relative z-10 text-center">
      <div class="flex justify-center mb-6">
        <img src="/logo_v.png" alt="VitrinAI" class="h-14 w-auto object-contain" />
      </div>

      <h1 class="text-2xl font-bold text-slate-800 mb-2">
        Coming soon
      </h1>
      <p class="text-slate-600 mb-8">
        {{ status?.message || "We're preparing the platform launch. Check back soon!" }}
      </p>

      <div v-if="launchDate" class="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-8">
        <div class="bg-slate-100 rounded-xl p-4">
          <span class="block text-2xl sm:text-3xl font-bold text-slate-800 tabular-nums">{{ countdown.days }}</span>
          <span class="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">Days</span>
        </div>
        <div class="bg-slate-100 rounded-xl p-4">
          <span class="block text-2xl sm:text-3xl font-bold text-slate-800 tabular-nums">{{ countdown.hours }}</span>
          <span class="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">Hours</span>
        </div>
        <div class="bg-slate-100 rounded-xl p-4">
          <span class="block text-2xl sm:text-3xl font-bold text-slate-800 tabular-nums">{{ countdown.minutes }}</span>
          <span class="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">Min</span>
        </div>
        <div class="bg-slate-100 rounded-xl p-4">
          <span class="block text-2xl sm:text-3xl font-bold text-slate-800 tabular-nums">{{ countdown.seconds }}</span>
          <span class="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">Sec</span>
        </div>
      </div>

      <p v-else class="text-slate-500 text-sm mb-6">
        Launch date coming soon.
      </p>

      <button
        type="button"
        @click="reload"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const { status, fetchStatus, launchDate } = usePlatformStatus();

const countdown = ref({
  days: '0',
  hours: '00',
  minutes: '00',
  seconds: '00',
});

let intervalId = null;

function updateCountdown() {
  const target = launchDate.value;
  if (!target || !process.client) return;

  const now = new Date();
  if (now >= target) {
    countdown.value = { days: '0', hours: '00', minutes: '00', seconds: '00' };
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return;
  }

  const diff = target - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdown.value = {
    days: String(days),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

onMounted(async () => {
  await fetchStatus();
  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

function reload() {
  if (process.client) {
    window.location.reload();
  }
}
</script>
