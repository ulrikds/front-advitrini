<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
      <img src="/logo_maior.png" alt="VitrinAI" class="w-[600px] h-auto object-contain" />
    </div>

    <div class="max-w-lg w-full bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 relative z-10 text-center">
      <div class="flex justify-center mb-6">
        <img src="/logo_v.png" alt="VitrinAI" class="h-14 w-auto object-contain" />
      </div>

      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-slate-800 mb-2">
        Fora do ar
      </h1>
      <p class="text-slate-600 mb-6">
        {{ message || 'Estamos fora do ar por problemas técnicos. Por favor, tente novamente mais tarde.' }}
      </p>

      <button
        type="button"
        @click="reload"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Tentar novamente
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const { status, fetchStatus } = usePlatformStatus();

const message = computed(() => status.value?.message || '');

onMounted(async () => {
  await fetchStatus();
});

function reload() {
  if (process.client) {
    window.location.reload();
  }
}
</script>
