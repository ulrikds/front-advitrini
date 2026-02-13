<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-3">
            <div class="backdrop-blur-sm bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/40 p-3 rounded-xl shadow-lg">
              <font-awesome-icon :icon="['fas', 'magic']" class="text-blue-600 text-xl" />
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent">
              VitrinAI
            </h1>
          </div>
          
          <!-- Join App Button -->
          <button
            @click="joinApp"
            class="backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/40 text-blue-700 px-6 py-3 rounded-xl hover:from-blue-500/40 hover:to-blue-600/40 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 font-semibold"
          >
            <font-awesome-icon :icon="['fas', 'rocket']" />
            <span>Join App</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Slides container with vertical scroll -->
    <div 
      ref="slidesContainer"
      class="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth pt-20"
      @scroll="handleScroll"
      @wheel="handleWheel"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Slide 1: Main Presentation -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 0 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-300 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div class="mb-8 animate-fade-in">
            <h1 class="text-7xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent mb-6">
              VitrinAI
            </h1>
            <p class="text-3xl text-slate-700 font-medium mb-4">
              Transform your showcase with Artificial Intelligence
            </p>
            <p class="text-xl text-slate-600 max-w-2xl mx-auto">
              Create professional presentations of products, models and advertising campaigns with the power of AI
            </p>
          </div>
          
          <div class="mt-12 flex flex-col items-center gap-4">
            <div class="flex items-center gap-2 text-slate-600 animate-bounce">
              <span class="text-sm font-medium">Scroll down</span>
              <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-xl" />
            </div>
          </div>
        </div>
      </section>

      <!-- Slide 2: About the Project -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 1 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-white">
          <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div class="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-15"></div>
        </div>
        
        <div class="relative z-10 px-6 max-w-6xl mx-auto">
          <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-12">
            <h2 class="text-5xl font-bold bg-gradient-to-r from-blue-700 to-slate-700 bg-clip-text text-transparent mb-8 text-center">
              About VitrinAI
            </h2>
            
            <div class="grid md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl shadow-lg flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-800 mb-2">AI Innovation</h3>
                    <p class="text-slate-600">
                      We use the most advanced artificial intelligence technologies to create high-quality visual content.
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl shadow-lg flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'rocket']" class="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-800 mb-2">Fast and Efficient</h3>
                    <p class="text-slate-600">
                      Generate professional presentations in minutes, not hours. Save time and resources.
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl shadow-lg flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'palette']" class="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-800 mb-2">Full Customization</h3>
                    <p class="text-slate-600">
                      Customize every detail of your creations to reflect your brand identity.
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl shadow-lg flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-800 mb-2">Secure and Reliable</h3>
                    <p class="text-slate-600">
                      Your data and creations are protected with the highest security standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Slide 3: Features -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 2 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-slate-100">
          <div class="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.1),transparent_50%)]"></div>
          <div class="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-blue-200 rounded-full blur-3xl opacity-15"></div>
        </div>
        
        <div class="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <h2 class="text-5xl font-bold bg-gradient-to-r from-blue-700 to-slate-700 bg-clip-text text-transparent mb-12 text-center">
            Main Features
          </h2>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'shopping-bag']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Model Mannequin</h3>
              <p class="text-slate-600 text-center">
                Create customized mannequin models to present your products in a professional and attractive way.
              </p>
            </div>
            
            <!-- Feature 2 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'tshirt']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Product Presentation</h3>
              <p class="text-slate-600 text-center">
                Present your products with high-quality AI-generated images, highlighting every detail.
              </p>
            </div>
            
            <!-- Feature 3 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'video']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Video Creation</h3>
              <p class="text-slate-600 text-center">
                Produce professional promotional videos using advanced AI technology for visual storytelling.
              </p>
            </div>
            
            <!-- Feature 4 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'bullhorn']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Advertising Piece</h3>
              <p class="text-slate-600 text-center">
                Create impactful advertising pieces that capture attention and convert visitors into customers.
              </p>
            </div>
            
            <!-- Feature 5 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'book']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Storytelling</h3>
              <p class="text-slate-600 text-center">
                Tell engaging stories about your products using narratives created with artificial intelligence.
              </p>
            </div>
            
            <!-- Feature 6 -->
            <div class="backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/50">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl shadow-lg mb-6 w-fit mx-auto">
                <font-awesome-icon :icon="['fas', 'chart-line']" class="text-blue-600 text-4xl" />
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Dashboard</h3>
              <p class="text-slate-600 text-center">
                Track your credit consumption and manage all your creations in an intuitive panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Slide 4: How It Works -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 3 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-300 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div class="relative z-10 px-6 max-w-5xl mx-auto w-full">
          <h2 class="text-5xl font-bold bg-gradient-to-r from-blue-700 to-slate-700 bg-clip-text text-transparent mb-16 text-center">
            How It Works
          </h2>
          
          <div class="space-y-12">
            <div class="flex items-start gap-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-full w-16 h-16 flex items-center justify-center shadow-lg flex-shrink-0">
                <span class="text-2xl font-bold text-blue-700">1</span>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">Choose Your Creation</h3>
                <p class="text-slate-600 text-lg">
                  Select the type of content you want to create: mannequin model, product presentation, video, advertising piece or storytelling.
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-full w-16 h-16 flex items-center justify-center shadow-lg flex-shrink-0">
                <span class="text-2xl font-bold text-blue-700">2</span>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">Configure Parameters</h3>
                <p class="text-slate-600 text-lg">
                  Customize your creation with available options: style, colors, format, text and other specific settings.
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-full w-16 h-16 flex items-center justify-center shadow-lg flex-shrink-0">
                <span class="text-2xl font-bold text-blue-700">3</span>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">Generate with AI</h3>
                <p class="text-slate-600 text-lg">
                  Our AI processes your request and generates the content in minutes. Track progress in real time.
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-xl p-8">
              <div class="backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 rounded-full w-16 h-16 flex items-center justify-center shadow-lg flex-shrink-0">
                <span class="text-2xl font-bold text-blue-700">4</span>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-slate-800 mb-3">Download and Use</h3>
                <p class="text-slate-600 text-lg">
                  After generation, download your content and use it in your campaigns, social media or showcases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Slide 5: Pricing -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 4 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white via-amber-50 to-slate-100">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
          <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20"></div>
          <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-slate-300 rounded-full blur-3xl opacity-15"></div>
        </div>
        
        <div class="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <h2 class="text-5xl font-bold bg-gradient-to-r from-amber-700 to-slate-700 bg-clip-text text-transparent mb-12 text-center">
            Pricing & Credits
          </h2>
          
          <div v-if="pricingLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p class="text-slate-600">Loading pricing information...</p>
          </div>

          <div v-else-if="pricingError" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p class="text-red-600">{{ pricingError }}</p>
          </div>

          <div v-else-if="pricing" class="space-y-8">
            <!-- Credit Rate -->
            <div class="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6 text-center">
              <p class="text-slate-600 mb-2">Credit Conversion Rate</p>
              <p class="text-2xl font-bold text-amber-700">
                1 cent = 10 credits
              </p>
              <p class="text-sm text-slate-500 mt-1">
                (1 credit = ${{ (pricing.creditRate || 0.001).toFixed(4) }})
              </p>
            </div>

            <!-- Control Motion Video -->
            <div class="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6">
              <h3 class="text-2xl font-bold text-slate-800 mb-4 text-center">Control Motion Video</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="(price, res) in {
                    '720p': pricing.controlMotion?.p720,
                    '1080p': pricing.controlMotion?.p1080,
                  }"
                  :key="res"
                  class="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center"
                >
                  <h4 class="font-bold text-emerald-900 mb-2">{{ res }}</h4>
                  <p class="text-sm text-emerald-700">${{ price?.pricePerSecond?.toFixed(4) || '0.0000' }}/s</p>
                  <p class="text-lg font-bold text-emerald-900">{{ price?.creditsPerSecond || 0 }} credits/s</p>
                </div>
              </div>
            </div>

            <!-- Fixed Pricing -->
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6 text-center">
                <h3 class="text-xl font-bold text-slate-800 mb-2">Mannequin</h3>
                <p class="text-3xl font-bold text-purple-700">${{ pricing.mannequin?.price?.toFixed(2) || '0.00' }}</p>
                <p class="text-lg text-purple-600">{{ pricing.mannequin?.credits || 0 }} credits</p>
              </div>
              <div class="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6 text-center">
                <h3 class="text-xl font-bold text-slate-800 mb-2">Product Presentation</h3>
                <p class="text-3xl font-bold text-indigo-700">${{ pricing.presentation?.price?.toFixed(2) || '0.00' }}</p>
                <p class="text-lg text-indigo-600">{{ pricing.presentation?.credits || 0 }} credits</p>
              </div>
              <div class="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6 text-center">
                <h3 class="text-xl font-bold text-slate-800 mb-2">Storytelling</h3>
                <p class="text-3xl font-bold text-pink-700">${{ pricing.storytelling?.price?.toFixed(2) || '0.00' }}</p>
                <p class="text-lg text-pink-600">{{ pricing.storytelling?.credits || 0 }} credits</p>
              </div>
            </div>

            <div class="text-center mt-8">
              <button
                @click="goToPricing"
                class="backdrop-blur-xl bg-amber-500/30 hover:bg-amber-500/40 border-2 border-amber-400/40 text-amber-700 font-bold py-3 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <font-awesome-icon :icon="['fas', 'arrow-right']" class="mr-2" />
                View Full Pricing Details
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Slide 6: Call to Action -->
      <section 
        class="min-h-screen snap-start flex items-center justify-center relative overflow-hidden"
        :class="currentSlide === 5 ? 'opacity-100' : 'opacity-90'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-slate-700">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h2 class="text-6xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p class="text-2xl text-blue-100 mb-12">
            Transform your ideas into reality with the power of Artificial Intelligence
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              @click="goToDashboard"
              class="backdrop-blur-xl bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <font-awesome-icon :icon="['fas', 'rocket']" class="mr-2" />
              Explore Features
            </button>
            <button
              @click="goToSettings"
              class="backdrop-blur-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <font-awesome-icon :icon="['fas', 'cog']" class="mr-2" />
              Settings
            </button>
          </div>
          
          <div class="mt-16 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <p class="text-blue-100 text-lg mb-4">
              Manage your credits and track your consumption in the Dashboard
            </p>
            <div class="flex items-center justify-center gap-4 text-white">
              <font-awesome-icon :icon="['fas', 'chart-line']" class="text-2xl" />
              <span class="text-xl font-semibold">{{ user?.credits || 0 }} credits available</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Slide indicators (dots) -->
    <div class="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
      <button
        v-for="(slide, index) in totalSlides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 rounded-full transition-all duration-300',
          currentSlide === index 
            ? 'bg-blue-600 w-3 h-8 shadow-lg' 
            : 'bg-white/40 hover:bg-white/60 w-3 h-3'
        ]"
        :title="`Slide ${index + 1}`"
      />
    </div>

    <!-- Keyboard navigation -->
    <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
      <button
        @click="previousSlide"
        :disabled="currentSlide === 0"
        :class="[
          'backdrop-blur-xl bg-white/30 border border-white/40 rounded-full p-4 shadow-xl transition-all duration-300',
          currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/40 hover:scale-110'
        ]"
        title="Previous slide"
      >
        <font-awesome-icon :icon="['fas', 'chevron-up']" class="text-slate-700 text-xl" />
      </button>
      <button
        @click="nextSlide"
        :disabled="currentSlide === totalSlides - 1"
        :class="[
          'backdrop-blur-xl bg-white/30 border border-white/40 rounded-full p-4 shadow-xl transition-all duration-300',
          currentSlide === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/40 hover:scale-110'
        ]"
        title="Next slide"
      >
        <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-slate-700 text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, checkAuth } = useAuth()

const slidesContainer = ref(null)
const currentSlide = ref(0)
const totalSlides = 6
const isScrolling = ref(false)
const touchStartY = ref(0)

// Pricing state
const pricing = ref(null)
const pricingLoading = ref(false)
const pricingError = ref(null)
const backendStorage = useBackendStorage()

// Join App function
const joinApp = async () => {
  // Check if user is already authenticated
  await checkAuth()
  
  if (isAuthenticated.value) {
    // If authenticated, go to app
    navigateTo('/app')
  } else {
    // If not authenticated, go to login
    navigateTo('/login')
  }
}

// Go to a specific slide
const goToSlide = (index) => {
  if (index < 0 || index >= totalSlides) return
  
  currentSlide.value = index
  const slideElement = slidesContainer.value?.children[index]
  if (slideElement) {
    slideElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Next slide
const nextSlide = () => {
  if (currentSlide.value < totalSlides - 1) {
    goToSlide(currentSlide.value + 1)
  }
}

// Previous slide
const previousSlide = () => {
  if (currentSlide.value > 0) {
    goToSlide(currentSlide.value - 1)
  }
}

// Detect which slide is visible
const handleScroll = () => {
  if (isScrolling.value) return
  
  const container = slidesContainer.value
  if (!container) return
  
  const scrollTop = container.scrollTop
  const slideHeight = container.clientHeight
  const slideIndex = Math.round(scrollTop / slideHeight)
  
  if (slideIndex !== currentSlide.value && slideIndex >= 0 && slideIndex < totalSlides) {
    currentSlide.value = slideIndex
  }
}

// Mouse wheel scroll navigation
const handleWheel = (e) => {
  if (isScrolling.value) return
  
  e.preventDefault()
  isScrolling.value = true
  
  if (e.deltaY > 0) {
    nextSlide()
  } else {
    previousSlide()
  }
  
  setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

// Touch navigation (mobile)
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e) => {
  if (isScrolling.value) return
  
  const touchEndY = e.changedTouches[0].clientY
  const diff = touchStartY.value - touchEndY
  
  if (Math.abs(diff) > 50) {
    isScrolling.value = true
    if (diff > 0) {
      nextSlide()
    } else {
      previousSlide()
    }
    
    setTimeout(() => {
      isScrolling.value = false
    }, 1000)
  }
}

// Keyboard navigation
const handleKeyDown = (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault()
    previousSlide()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goToSlide(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goToSlide(totalSlides - 1)
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Navigation to other pages
const goToDashboard = () => {
  navigateTo('/app?menu=dashboard')
}

const goToSettings = () => {
  navigateTo('/app?menu=settings')
}

const goToPricing = () => {
  navigateTo('/app?menu=pricing')
}

// Load pricing on mount
onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  
  // Load pricing information
  try {
    pricingLoading.value = true
    pricingError.value = null
    pricing.value = await backendStorage.fetchPricing()
  } catch (err) {
    console.error('Error loading pricing:', err)
    pricingError.value = err.message || 'Failed to load pricing information'
  } finally {
    pricingLoading.value = false
  }
})
</script>

<style scoped>
/* Scrollbar personalizada */
.overflow-y-scroll::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Animação de fade-in */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

/* Snap scroll suave */
.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}
</style>
