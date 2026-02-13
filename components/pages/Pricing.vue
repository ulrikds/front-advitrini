<template>
  <div class="h-full overflow-y-auto">
    <!-- Header (sem card) -->
    <div class="mb-4 sm:mb-6 flex-shrink-0 relative z-10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="backdrop-blur-sm bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-400/40 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'dollar-sign']" class="text-amber-600 text-lg sm:text-xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-400 mb-1">
              Pricing & Credits
            </h1>
            <p class="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-amber-500 text-xs" />
              <span>View all pricing information and credit costs</span>
            </p>
          </div>
        </div>
        <!-- Credit Rate Info -->
        <div v-if="pricing" class="w-full sm:w-auto bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <p class="text-xs text-blue-700 mb-1">Credit Rate</p>
          <p class="text-sm font-bold text-blue-900">
            1 cent = 10 credits<br>
            <span class="text-xs font-normal">(1 credit = ${{ (pricing.creditRate || 0.001).toFixed(4) }})</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-48 sm:h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-600">Loading pricing information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="flex items-start sm:items-center space-x-3">
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-red-600 text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <h3 class="text-red-800 font-semibold text-sm sm:text-base">Error loading pricing</h3>
          <p class="text-red-600 text-xs sm:text-sm mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Pricing Table - Desktop -->
    <div v-if="pricing && !isLoading && !error" class="hidden md:block bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">AI Model</th>
              <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Output</th>
              <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Configuration</th>
              <th class="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price (USD)</th>
              <th class="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price (Credits)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Control Motion Video -->
            <tr class="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2 lg:space-x-3">
                  <font-awesome-icon :icon="['fas', 'film']" class="text-emerald-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Kling 2.6 Motion</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">720p</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.controlMotion?.p720?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-emerald-700">{{ pricing.controlMotion?.p720?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>
            <tr class="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">1080p</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.controlMotion?.p1080?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-emerald-700">{{ pricing.controlMotion?.p1080?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>

            <!-- Veo Video - Fast Mode -->
            <tr class="bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'video']" class="text-yellow-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Veo 3.1 (Fast)</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">Without Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.fast?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-yellow-700">{{ pricing.veoVideo?.fast?.base?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>
            <tr class="bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">With Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.fast?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-yellow-700">{{ pricing.veoVideo?.fast?.withAudio?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>

            <!-- Veo Video - Normal Mode 1080p -->
            <tr class="bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'video']" class="text-blue-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Veo 3.1 (Normal)</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">1080p - Without Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p1080?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p1080?.base?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>
            <tr class="bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">1080p - With Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p1080?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p1080?.withAudio?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>

            <!-- Veo Video - Normal Mode 4K -->
            <tr class="bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">4K - Without Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p4k?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p4k?.base?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>
            <tr class="bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm text-gray-700">Video</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">4K - With Audio</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p4k?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p4k?.withAudio?.creditsPerSecond || 0 }} credits/s</span>
              </td>
            </tr>

            <!-- Gemini 2.5 Normal -->
            <tr class="bg-purple-50/50 hover:bg-purple-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'brain']" class="text-purple-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Gemini 2.5</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-sm text-gray-700">Text/Image</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">Normal</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.gemini?.normal?.price?.toFixed(2) || '0.00' }}</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-purple-700">{{ pricing.gemini?.normal?.credits || 0 }} credits</span>
              </td>
            </tr>

            <!-- Gemini 2.5 Flash -->
            <tr class="bg-purple-50/50 hover:bg-purple-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap"></td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-sm text-gray-700">Text/Image</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">Normal Flash</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.gemini?.flash?.price?.toFixed(2) || '0.00' }}</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-purple-700">{{ pricing.gemini?.flash?.credits || 0 }} credits</span>
              </td>
            </tr>

            <!-- Mannequin -->
            <tr class="bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-indigo-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Gemini</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-sm text-gray-700">Image</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">-</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.mannequin?.price?.toFixed(2) || '0.00' }}</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-indigo-700">{{ pricing.mannequin?.credits || 0 }} credits</span>
              </td>
            </tr>

            <!-- Product Presentation -->
            <tr class="bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'tshirt']" class="text-indigo-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Gemini</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-sm text-gray-700">Image</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">-</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.presentation?.price?.toFixed(2) || '0.00' }}</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-indigo-700">{{ pricing.presentation?.credits || 0 }} credits</span>
              </td>
            </tr>

            <!-- Storytelling -->
            <tr class="bg-pink-50/50 hover:bg-pink-50 transition-colors">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <font-awesome-icon :icon="['fas', 'book']" class="text-pink-600 text-base lg:text-lg" />
                  <span class="font-semibold text-sm lg:text-base text-gray-900">Gemini</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-sm text-gray-700">Text</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4">
                <span class="text-xs lg:text-sm font-medium text-gray-900">-</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-gray-900">${{ pricing.storytelling?.price?.toFixed(2) || '0.00' }}</span>
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 text-right">
                <span class="text-xs lg:text-sm font-semibold text-pink-700">{{ pricing.storytelling?.credits || 0 }} credits</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pricing Cards - Mobile -->
    <div v-if="pricing && !isLoading && !error" class="md:hidden space-y-4">
      <!-- Control Motion -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-emerald-50/50 p-4 border-b border-emerald-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'film']" class="text-emerald-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Kling 2.6 Motion</h3>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">720p</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.controlMotion?.p720?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-emerald-700">{{ pricing.controlMotion?.p720?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">1080p</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.controlMotion?.p1080?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-emerald-700">{{ pricing.controlMotion?.p1080?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Veo Fast -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-yellow-50/50 p-4 border-b border-yellow-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'video']" class="text-yellow-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Veo 3.1 (Fast)</h3>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">Without Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.fast?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-yellow-700">{{ pricing.veoVideo?.fast?.base?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">With Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.fast?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-yellow-700">{{ pricing.veoVideo?.fast?.withAudio?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Veo Normal -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-blue-50/50 p-4 border-b border-blue-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'video']" class="text-blue-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Veo 3.1 (Normal)</h3>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">1080p - Without Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p1080?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p1080?.base?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">1080p - With Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p1080?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p1080?.withAudio?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">4K - Without Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p4k?.base?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p4k?.base?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">4K - With Audio</p>
              <p class="text-xs text-gray-600">Video</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.veoVideo?.normal?.p4k?.withAudio?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
              <p class="text-xs font-semibold text-blue-700">{{ pricing.veoVideo?.normal?.p4k?.withAudio?.creditsPerSecond || 0 }} credits/s</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gemini -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-purple-50/50 p-4 border-b border-purple-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'brain']" class="text-purple-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Gemini 2.5</h3>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-500">Normal</p>
              <p class="text-xs text-gray-600">Text/Image</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.gemini?.normal?.price?.toFixed(2) || '0.00' }}</p>
              <p class="text-xs font-semibold text-purple-700">{{ pricing.gemini?.normal?.credits || 0 }} credits</p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">Normal Flash</p>
              <p class="text-xs text-gray-600">Text/Image</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.gemini?.flash?.price?.toFixed(2) || '0.00' }}</p>
              <p class="text-xs font-semibold text-purple-700">{{ pricing.gemini?.flash?.credits || 0 }} credits</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mannequin -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-indigo-50/50 p-4 border-b border-indigo-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-indigo-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Mannequin (Gemini)</h3>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">-</p>
              <p class="text-xs text-gray-600">Image</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.mannequin?.price?.toFixed(2) || '0.00' }}</p>
              <p class="text-xs font-semibold text-indigo-700">{{ pricing.mannequin?.credits || 0 }} credits</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Presentation -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-indigo-50/50 p-4 border-b border-indigo-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-indigo-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Product Presentation (Gemini)</h3>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">-</p>
              <p class="text-xs text-gray-600">Image</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.presentation?.price?.toFixed(2) || '0.00' }}</p>
              <p class="text-xs font-semibold text-indigo-700">{{ pricing.presentation?.credits || 0 }} credits</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Storytelling -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-pink-50/50 p-4 border-b border-pink-100">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'book']" class="text-pink-600 text-lg" />
            <h3 class="font-semibold text-gray-900">Storytelling (Gemini)</h3>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="text-xs text-gray-500">-</p>
              <p class="text-xs text-gray-600">Text</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-gray-900">${{ pricing.storytelling?.price?.toFixed(2) || '0.00' }}</p>
              <p class="text-xs font-semibold text-pink-700">{{ pricing.storytelling?.credits || 0 }} credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const backendStorage = useBackendStorage()
const pricing = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Load pricing on mount
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    pricing.value = await backendStorage.fetchPricing()
  } catch (err) {
    console.error('Error loading pricing:', err)
    error.value = err.message || 'Failed to load pricing information'
  } finally {
    isLoading.value = false
  }
})
</script>
