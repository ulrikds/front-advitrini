<template>
  <div class="min-h-screen">


    <!-- Current Plan Info -->
    <div class="mb-6 sm:mb-8 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Current Plan</h2>
          <p class="text-sm sm:text-base text-slate-600">
            <span class="font-semibold capitalize">{{ user?.role || 'Free' }}</span> Plan
          </p>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Credits: {{ (user?.credits || 0).toLocaleString('en-US') }}
          </p>
        </div>
        <div class="flex items-center space-x-2 text-xs sm:text-sm backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-lg px-3 sm:px-4 py-2">
          <font-awesome-icon :icon="['fas', 'credit-card']" class="text-blue-600" />
          <span class="text-slate-700 font-medium">{{ (user?.credits || 0).toLocaleString('en-US') }} credits available</span>
        </div>
      </div>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <!-- Gold Plan -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Gold Plan</h3>
              <p class="text-sm text-slate-600">Perfect for regular users</p>
            </div>
            <div class="p-3 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30">
              <font-awesome-icon :icon="['fas', 'star']" class="text-2xl text-amber-600" />
            </div>
          </div>
          
          <div class="mb-6">
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl sm:text-4xl font-bold text-slate-800">$10</span>
              <span class="text-sm text-slate-600">USD</span>
            </div>
            <p class="text-lg sm:text-xl font-semibold text-green-600 mb-4">
              10,000 Credits
            </p>
            <div class="space-y-2 text-sm text-slate-700">
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>10,000 credits included</span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>All features unlocked</span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          <button
            @click="purchasePlan('gold')"
            :disabled="isProcessing || user?.role === 'gold'"
            :class="[
              'w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300',
              user?.role === 'gold'
                ? 'bg-slate-300/50 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/40 text-amber-700 hover:from-amber-500/40 hover:to-amber-600/40 shadow-lg hover:shadow-xl transform hover:scale-105',
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="user?.role === 'gold'">Current Plan</span>
            <span v-else-if="isProcessing">Processing...</span>
            <span v-else>Purchase Gold Plan</span>
          </button>
        </div>
      </div>

      <!-- Diamond Plan -->
      <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Diamond Plan</h3>
              <p class="text-sm text-slate-600">Best value for power users</p>
            </div>
            <div class="p-3 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/30">
              <font-awesome-icon :icon="['fas', 'fire']" class="text-2xl text-purple-600" />
            </div>
          </div>
          
          <div class="mb-6">
            <div class="flex items-baseline space-x-2 mb-2">
              <span class="text-3xl sm:text-4xl font-bold text-slate-800">$45</span>
              <span class="text-sm text-slate-600">USD</span>
            </div>
            <p class="text-lg sm:text-xl font-semibold text-green-600 mb-4">
              50,000 Credits
            </p>
            <div class="space-y-2 text-sm text-slate-700">
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>50,000 credits included</span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>All features unlocked</span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>Priority support</span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                <span>Best value - Save $5</span>
              </div>
            </div>
          </div>

          <button
            @click="purchasePlan('diamond')"
            :disabled="isProcessing || user?.role === 'diamond'"
            :class="[
              'w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300',
              user?.role === 'diamond'
                ? 'bg-slate-300/50 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500/30 to-purple-600/30 border border-purple-400/40 text-purple-700 hover:from-purple-500/40 hover:to-purple-600/40 shadow-lg hover:shadow-xl transform hover:scale-105',
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="user?.role === 'diamond'">Current Plan</span>
            <span v-else-if="isProcessing">Processing...</span>
            <span v-else>Purchase Diamond Plan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
      <h3 class="text-lg sm:text-xl font-semibold text-slate-800 mb-4">Payment Information</h3>
      <p class="text-sm text-slate-600 mb-4">
        Secure payment processing. Your payment information is encrypted and secure.
      </p>
      <div class="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
        <font-awesome-icon :icon="['fas', 'lock']" />
        <span>Secure SSL encryption</span>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :type="toastType"
      :title="toastTitle"
      :message="toastMessage"
      :duration="3000"
      @close="showToast = false"
    />
  </div>
</template>

<script setup>
const { user } = useAuth()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl || 'http://localhost:4000'

// State
const isProcessing = ref(false)

// Toast
const showToast = ref(false)
const toastType = ref('success')
const toastTitle = ref('')
const toastMessage = ref('')

// Plan configurations
const plans = {
  gold: {
    name: 'Gold',
    price: 10,
    credits: 10000,
    role: 'gold'
  },
  diamond: {
    name: 'Diamond',
    price: 45,
    credits: 50000,
    role: 'diamond'
  }
}

// Purchase plan
const purchasePlan = async (planType) => {
  if (!plans[planType]) return
  
  const plan = plans[planType]
  
  if (user.value?.role === plan.role) {
    showToastMessage('info', 'Already Subscribed', `You are already on the ${plan.name} plan.`)
    return
  }

  isProcessing.value = true
  showToastMessage('loading', 'Processing Payment', 'Please wait while we process your payment...')

  try {
    // Call backend API to process payment
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation PurchasePlan($input: PurchasePlanInput!) {
            purchasePlan(input: $input) {
              id
              role
              credits
            }
          }
        `,
        variables: {
          input: {
            planType: planType,
            amount: plan.price,
            credits: plan.credits
          }
        }
      })
    })

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    showToastMessage('success', 'Plan Purchased!', `You have successfully purchased the ${plan.name} plan and received ${plan.credits.toLocaleString('en-US')} credits.`)
    
    // Refresh user data
    await navigateTo('/app?menu=billing')
    window.location.reload() // Reload to get updated user data
  } catch (error) {
    console.error('Error purchasing plan:', error)
    showToastMessage('error', 'Purchase Error', error.message || 'Failed to process payment. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

const showToastMessage = (type, title, message) => {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message
  showToast.value = true
  if (type !== 'loading') {
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}
</script>
