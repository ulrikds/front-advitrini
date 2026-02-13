<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm mb-8">
      <div class="px-8 py-6">
        <div class="flex items-center space-x-4">
          <div class="bg-gradient-to-br from-gray-500 to-gray-600 p-4 rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'cog']" class="text-white text-2xl" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
            <p class="text-sm text-gray-600 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-500 text-xs" />
              <span>Configure your application settings</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Settings Header -->
        <div class="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">API Configuration</h2>
          <p class="text-gray-200 text-sm mt-1">Manage your API keys for different services</p>
        </div>

        <!-- Settings Form -->
        <div class="p-8">
          <!-- Info message for non-custom users -->
          <div v-if="!isCustomRole" class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start space-x-3">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-blue-600 text-xl mt-0.5" />
              <div>
                <h3 class="font-semibold text-blue-900 mb-1">API Key Configuration</h3>
                <p class="text-sm text-blue-800">
                  Você está usando o plano <span class="font-semibold">{{ user?.role?.toUpperCase() || 'FREE' }}</span>. 
                  A API key é gerenciada automaticamente pelo sistema. 
                  Para usar sua própria API key, entre em contato para atualizar seu plano para "Custom".
                </p>
              </div>
            </div>
          </div>

          <!-- Google API Key (only for custom role) -->
          <div v-if="isCustomRole" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API Key <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-3">
              <div class="flex-1 relative">
                <input
                  v-model="googleApiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your Google Gemini API key"
                />
                <button
                  @click="showApiKey = !showApiKey"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  title="Toggle visibility"
                >
                  <font-awesome-icon :icon="['fas', showApiKey ? 'eye-slash' : 'eye']" />
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-400" />
              <span>Your API key will be saved locally and used automatically in creation forms</span>
            </p>
            <p v-if="savedApiKey" class="text-xs text-green-600 mt-1 flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'check-circle']" />
              <span>API key is configured and will be used automatically</span>
            </p>
          </div>

          <!-- Save Button (only for custom role) -->
          <div v-if="isCustomRole" class="flex items-center justify-between pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              <p v-if="savedApiKey" class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500" />
                <span>API key saved successfully</span>
              </p>
              <p v-else class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-yellow-500" />
                <span>No API key configured</span>
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                v-if="savedApiKey"
                @click="clearApiKey"
                class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
                <span>Clear</span>
              </button>
              <button
                @click="saveApiKey"
                :disabled="!googleApiKey || isSaving"
                class="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <font-awesome-icon v-if="!isSaving" :icon="['fas', 'save']" />
                <span v-if="isSaving" class="animate-spin">⏳</span>
                <span>{{ isSaving ? 'Saving...' : 'Save API Key' }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Info Card -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div class="flex items-start space-x-4">
          <div class="bg-blue-100 p-3 rounded-lg flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-blue-600 text-xl" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-blue-900 mb-2">How to get your Google Gemini API Key</h3>
            <ol class="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" class="underline hover:text-blue-600">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key"</li>
              <li>Copy the generated API key</li>
              <li>Paste it in the field above and click "Save API Key"</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Referral System -->
      <div class="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Referral Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">Referral System</h2>
          <p class="text-purple-200 text-sm mt-1">Share your code and earn credits when your referrals upgrade</p>
        </div>

        <!-- Referral Content -->
        <div class="p-8">
          <!-- Your Referral Code -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Your Referral Code
            </label>
            <div class="flex items-center space-x-3">
              <div class="flex-1 relative">
                <input
                  :value="user?.referralCode || 'Loading...'"
                  readonly
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 font-mono text-lg font-semibold text-gray-900"
                />
              </div>
              <button
                @click="copyReferralCode"
                class="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2"
                :title="copiedCode ? 'Copied!' : 'Copy code'"
              >
                <font-awesome-icon :icon="['fas', copiedCode ? 'check' : 'copy']" />
                <span>{{ copiedCode ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-400" />
              <span>Share this code with others. You'll earn credits when they upgrade to Gold or Diamond!</span>
            </p>
          </div>

          <!-- Apply Referral Code -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Apply Referral Code
            </label>
            <div class="flex items-center space-x-3">
              <div class="flex-1 relative">
                <input
                  v-model="referralCodeInput"
                  type="text"
                  placeholder="Enter referral code"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                  :disabled="user?.referredBy || isApplyingCode"
                />
              </div>
              <button
                @click="applyReferralCode"
                :disabled="!referralCodeInput || user?.referredBy || isApplyingCode"
                class="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <font-awesome-icon v-if="!isApplyingCode" :icon="['fas', 'check']" />
                <span v-if="isApplyingCode" class="animate-spin">⏳</span>
                <span>{{ isApplyingCode ? 'Applying...' : 'Apply' }}</span>
              </button>
            </div>
            <p v-if="user?.referredBy" class="text-xs text-green-600 mt-2 flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'check-circle']" />
              <span>You have already applied a referral code</span>
            </p>
            <p v-else class="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-400" />
              <span>Enter a referral code from another user to support them</span>
            </p>
          </div>

          <!-- Claim Referral Rewards Button -->
          <div class="mb-6">
            <button
              @click="claimReferralRewards"
              :disabled="isClaimingRewards || !user?.referrals || user.referrals.length === 0"
              class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <font-awesome-icon v-if="!isClaimingRewards" :icon="['fas', 'gift']" class="text-xl" />
              <span v-if="isClaimingRewards" class="animate-spin">⏳</span>
              <span>{{ isClaimingRewards ? 'Checking referrals...' : 'Claim Referral Rewards' }}</span>
            </button>
            <p class="text-xs text-gray-500 mt-2 text-center">
              Check all your referrals and claim credits for Gold and Diamond accounts
            </p>
          </div>

          <!-- Referral Rewards Info -->
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
            <h3 class="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
              <font-awesome-icon :icon="['fas', 'gift']" />
              <span>Referral Rewards</span>
            </h3>
            <div class="space-y-2 text-sm text-purple-800">
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'star']" class="text-amber-500" />
                <span>When someone you referred upgrades to <strong>Gold</strong>, you earn <strong>500 credits</strong></span>
              </div>
              <div class="flex items-center space-x-2">
                <font-awesome-icon :icon="['fas', 'gem']" class="text-purple-500" />
                <span>When someone you referred upgrades to <strong>Diamond</strong>, you earn <strong>2,500 credits</strong></span>
              </div>
              <div class="mt-3 pt-3 border-t border-purple-200">
                <p class="text-xs text-purple-700 font-medium">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-1" />
                  Each referral account can only give rewards once. Use the button above to claim available rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from '~/composables/useLocalStorage'
import { useAuth } from '~/composables/useAuth'

const storage = useLocalStorage()
const { user } = useAuth()

// Form state
const googleApiKey = ref('')
const showApiKey = ref(false)
const isSaving = ref(false)
const savedApiKey = ref(false)

// Referral state
const referralCodeInput = ref('')
const isApplyingCode = ref(false)
const copiedCode = ref(false)
const isClaimingRewards = ref(false)


// Computed to check if user has custom role
const isCustomRole = computed(() => {
  return user.value?.role === 'custom'
})

// Load saved API keys on mount
onMounted(() => {
  loadApiKey()
})

// Load API key from localStorage
const loadApiKey = () => {
  try {
    const saved = localStorage.getItem('google_api_key')
    if (saved) {
      googleApiKey.value = saved
      savedApiKey.value = true
    }
  } catch (error) {
    console.error('Error loading API key:', error)
  }
}

// Save API key to localStorage
const saveApiKey = () => {
  if (!googleApiKey.value || !googleApiKey.value.trim()) {
    alert('Please enter a valid API key')
    return
  }

  isSaving.value = true

  try {
    localStorage.setItem('google_api_key', googleApiKey.value.trim())
    savedApiKey.value = true
    alert('API key saved successfully! It will be used automatically in creation forms.')
  } catch (error) {
    console.error('Error saving API key:', error)
    alert('Error saving API key. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Clear API key
const clearApiKey = () => {
  if (confirm('Are you sure you want to clear the API key? You will need to enter it manually in creation forms.')) {
    try {
      localStorage.removeItem('google_api_key')
      googleApiKey.value = ''
      savedApiKey.value = false
      alert('API key cleared successfully.')
    } catch (error) {
      console.error('Error clearing API key:', error)
      alert('Error clearing API key. Please try again.')
    }
  }
}

// Copy referral code
const copyReferralCode = async () => {
  if (!user.value?.referralCode) return
  
  try {
    await navigator.clipboard.writeText(user.value.referralCode)
    copiedCode.value = true
    setTimeout(() => {
      copiedCode.value = false
    }, 2000)
  } catch (error) {
    console.error('Error copying code:', error)
    alert('Error copying code. Please try again.')
  }
}

// Apply referral code
const applyReferralCode = async () => {
  if (!referralCodeInput.value || !referralCodeInput.value.trim()) {
    alert('Please enter a referral code')
    return
  }

  if (user.value?.referredBy) {
    alert('You have already applied a referral code')
    return
  }

  isApplyingCode.value = true

  try {
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl || 'http://localhost:4000'

    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation ApplyReferralCode($code: String!) {
            applyReferralCode(code: $code)
          }
        `,
        variables: {
          code: referralCodeInput.value.trim().toUpperCase()
        }
      })
    })

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    if (result.data.applyReferralCode) {
      alert('Referral code applied successfully!')
      referralCodeInput.value = ''
      // Reload user data to get updated referredBy
      const { checkAuth } = useAuth()
      await checkAuth(true) // Force refresh
    }
  } catch (error) {
    console.error('Error applying referral code:', error)
    alert(error.message || 'Error applying referral code. Please try again.')
  } finally {
    isApplyingCode.value = false
  }
}

// Claim referral rewards
const claimReferralRewards = async () => {
  if (!user.value?.referrals || user.value.referrals.length === 0) {
    alert('You have no referrals to claim rewards from')
    return
  }

  isClaimingRewards.value = true

  try {
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl || 'http://localhost:4000'

    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation ClaimReferralRewards {
            claimReferralRewards {
              success
              totalCreditsEarned
              rewardsClaimed
              message
            }
          }
        `
      })
    })

    const result = await response.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    const rewardsData = result.data.claimReferralRewards

    if (rewardsData.success) {
      alert(`Success! ${rewardsData.message}`)
      // Reload user data to get updated credits
      const { checkAuth } = useAuth()
      await checkAuth(true) // Force refresh
    } else {
      alert(rewardsData.message)
    }
  } catch (error) {
    console.error('Error claiming referral rewards:', error)
    alert(error.message || 'Error claiming referral rewards. Please try again.')
  } finally {
    isClaimingRewards.value = false
  }
}

</script>
