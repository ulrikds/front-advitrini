<template>
  <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -ml-24 -mt-24" />
    <div class="absolute bottom-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl -mr-16 -mb-16" />

    <div class="relative z-10">
      <div class="flex items-start gap-3 mb-4">
        <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-pink-500/30 border border-emerald-400/40 flex items-center justify-center">
          <font-awesome-icon :icon="['fas', 'magic']" class="text-emerald-600 text-lg sm:text-xl" />
        </div>
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-slate-800">
            The easiest way to get followers on TikTok
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
            Create your virtual influencer, copy trending dance moves, and post. Three steps.
          </p>
        </div>
      </div>

      <!-- Steps -->
      <div class="space-y-4 sm:space-y-5">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/50 border border-white/60 hover:border-emerald-300/50 transition-colors"
        >
          <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500/20 border-2 border-pink-400/40 flex items-center justify-center text-pink-700 font-bold text-sm sm:text-base">
            {{ index + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-800 text-sm sm:text-base">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">
              {{ step.description }}
            </p>
            <NuxtLink
              :to="step.link"
              class="inline-flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              <span>{{ step.cta }}</span>
              <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-[10px] sm:text-xs" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- CTA footer -->
      <div class="mt-5 sm:mt-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-400/30">
        <p class="text-sm font-medium text-slate-700">
          <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-amber-500 mr-2" />
          <span class="font-semibold text-slate-800">Pro tip:</span> Use a dance video that’s already trending. Your influencer copies the motion in Control Motion—then you post the result on TikTok. It’s the fastest path to new followers.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    id: 'mannequin',
    title: 'Create a mannequin of your influencer',
    description: 'Build your virtual influencer with our Mannequin creator. Use a real face or design one—this will be the character that dances on TikTok.',
    link: { path: '/app', query: { menu: 'model-mannequin' } },
    cta: 'Create mannequin',
  },
  {
    id: 'dance',
    title: 'Find a dance video for your influencer to copy',
    description: 'Pick a trending dance or any short dance clip (up to 30 seconds). This will be the motion your influencer will perform.',
    link: { path: '/app', query: { menu: 'track-motion' } },
    cta: 'Go to Control Motion',
  },
  {
    id: 'launch',
    title: 'Copy the motion and launch on TikTok',
    description: 'In Control Motion, use your mannequin and the dance video. Generate the clip, then download and post it on TikTok. Post at the best times above for more reach.',
    link: { path: '/app', query: { menu: 'track-motion' } },
    cta: 'Open Control Motion',
  },
]
</script>
