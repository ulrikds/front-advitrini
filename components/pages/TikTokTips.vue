<template>
  <div class="min-h-screen space-y-6 sm:space-y-8">
    <!-- Page header -->
    <div class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex-shrink-0">
      <div class="flex items-center space-x-3 sm:space-x-4">
        <div class="backdrop-blur-sm bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
          <font-awesome-icon :icon="['fab', 'tiktok']" class="text-pink-600 text-lg sm:text-xl" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-pink-700 to-rose-700 bg-clip-text text-transparent">
            TikTok Tips
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 font-medium">
            Best times to post and the easiest path to grow your followers
          </p>
        </div>
      </div>
    </div>

    <!-- Easiest way to get followers (new component) -->
    <TikTokInfluencerPath />

    <!-- Best times to post -->
    <DashboardTikTokTips />
  </div>
</template>
