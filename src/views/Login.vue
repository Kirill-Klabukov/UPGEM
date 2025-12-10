<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-gem">💎</div>
        <h1>UPGEM</h1>
        <p class="tagline">Level Up Your Skills</p>
        <p class="subtitle">{{ isFirstTime ? 'Welcome! Let\'s get started' : 'Welcome back!' }}</p>
      </div>

      <div v-if="isFirstTime" class="welcome-options">
        <h3>Choose how to start:</h3>
        
        <button @click="enterDemoMode" class="option-button demo">
          <div class="option-icon">🎮</div>
          <div class="option-content">
            <strong>Demo Mode</strong>
            <small>Try it out with sample data</small>
          </div>
          <div class="option-arrow">→</div>
        </button>

        <button @click="continueWithoutPassword" class="option-button quick-start">
          <div class="option-icon">🚀</div>
          <div class="option-content">
            <strong>Quick Start</strong>
            <small>Fresh start - no setup needed</small>
          </div>
          <div class="option-arrow">→</div>
        </button>

        <button @click="showPasswordSetup = true" class="option-button secure">
          <div class="option-icon">🔒</div>
          <div class="option-content">
            <strong>Secure Mode</strong>
            <small>Protect your data with encryption</small>
          </div>
          <div class="option-arrow">→</div>
        </button>
      </div>

      <form v-else-if="showPasswordSetup || !isFirstTime" @submit.prevent="handleLogin" class="login-form">
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          <span class="success-icon">✓</span>
          {{ success }}
        </div>

        <div v-if="showPasswordSetup" class="setup-info">
          <p>🔐 Create a master password to encrypt your data</p>
        </div>

        <div class="form-group">
          <label for="password">{{ showPasswordSetup ? 'Create Master Password' : 'Master Password' }}</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="showPasswordSetup ? 'Create a strong password' : 'Enter your master password'"
              :required="!isFirstTime"
            />
            <button type="button" @click="showPassword = !showPassword" class="toggle-password">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <small v-if="showPasswordSetup">Min 12 characters with uppercase, lowercase, and numbers</small>
        </div>

        <div v-if="showPasswordSetup" class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">⏳ {{ showPasswordSetup ? 'Setting up...' : 'Unlocking...' }}</span>
          <span v-else>{{ showPasswordSetup ? '🔐 Secure & Start' : '💎 Enter UPGEM' }}</span>
        </button>

        <button v-if="isFirstTime && showPasswordSetup" type="button" @click="showPasswordSetup = false" class="back-button">
          ← Back to options
        </button>
      </form>

      <div class="login-footer">
        <div class="features">
          <span>🔒 Encrypted</span>
          <span>📱 Offline-first</span>
          <span>🚫 No tracking</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const isFirstTime = ref(false)
const showPasswordSetup = ref(false)

onMounted(() => {
  // Check if this is the first time user is opening the app
  const hasSetup = localStorage.getItem('skillEdSetup')
  const hasPassword = localStorage.getItem('skillEdPassword')
  isFirstTime.value = !hasSetup
  
  // If user already chose no password, auto-login
  if (hasSetup === 'no-password') {
    authStore.skipPassword()
    router.push('/')
  }
})

const continueWithoutPassword = () => {
  localStorage.setItem('skillEdSetup', 'no-password')
  authStore.skipPassword()
  router.push('/')
}

const enterDemoMode = () => {
  // Set demo mode flag
  localStorage.setItem('skillEdSetup', 'demo-mode')
  localStorage.setItem('upgem_isDemoMode', 'true')
  
  // Load demo data
  loadDemoData()
  
  authStore.skipPassword()
  router.push('/')
}

const loadDemoData = () => {
  // Demo skills
  const demoSkills = [
    {
      id: '1',
      name: 'Web Development',
      description: 'Learn modern web technologies',
      emoji: '🌐',
      category: 'Technology',
      proficiencyLevel: 65,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalHours: 120,
      habits: ['Daily coding', 'Code review'],
    },
    {
      id: '2',
      name: 'UI/UX Design',
      description: 'Create beautiful user interfaces',
      emoji: '🎨',
      category: 'Design',
      proficiencyLevel: 45,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      lastPracticed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalHours: 60,
      habits: ['Design practice', 'Portfolio work'],
    },
    {
      id: '3',
      name: 'Spanish Language',
      description: 'Improve conversational skills',
      emoji: '🇪🇸',
      category: 'Languages',
      proficiencyLevel: 35,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastPracticed: new Date().toISOString(),
      totalHours: 80,
      habits: ['Daily practice', 'Conversation'],
    },
  ]
  
  // Demo gamification stats
  const demoGamification = {
    xp: 2450,
    level: 5,
    streak: 8,
    achievements: [
      { id: '1', name: '🎯 First Skill', description: 'Add your first skill', category: 'milestones', unlocked: true, unlockedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), icon: '🎯', requirement: { type: 'skills', count: 1 } },
      { id: '2', name: '🔥 Week Warrior', description: 'Maintain 7-day streak', category: 'streaks', unlocked: true, unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), icon: '🔥', requirement: { type: 'streak', count: 7 } },
      { id: '3', name: '💎 Level 5', description: 'Reach level 5', category: 'levels', unlocked: true, unlockedAt: new Date().toISOString(), icon: '💎', requirement: { type: 'level', count: 5 } },
      { id: '4', name: '📚 Knowledge Seeker', description: 'Learn 3 different skills', category: 'milestones', unlocked: true, unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), icon: '📚', requirement: { type: 'skills', count: 3 } },
    ],
    goals: { dailyXP: 100, weeklyXP: 500 },
  }
  
  // Demo learning journal entries
  const demoLearningEntries = [
    {
      id: 'demo-1',
      skillId: '1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lesson: 'Learned React hooks and state management patterns',
      mood: 'excellent',
      energyBefore: 75,
      energyAfter: 90,
      focusLevel: 'high',
      sessionDetails: 'Deep dive into useEffect and custom hooks. Built a todo app.',
      tags: ['react', 'hooks', 'javascript'],
    },
    {
      id: 'demo-2',
      skillId: '1',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lesson: 'TypeScript generics and type inference',
      mood: 'good',
      energyBefore: 60,
      energyAfter: 75,
      focusLevel: 'high',
      sessionDetails: 'Understood complex generic patterns, improved type safety',
      tags: ['typescript', 'types'],
    },
    {
      id: 'demo-3',
      skillId: '2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lesson: 'Color theory and accessibility in design',
      mood: 'good',
      energyBefore: 70,
      energyAfter: 85,
      focusLevel: 'medium',
      sessionDetails: 'Explored WCAG standards and accessible color palettes',
      tags: ['design', 'accessibility', 'ux'],
    },
    {
      id: 'demo-4',
      skillId: '3',
      date: new Date().toISOString().split('T')[0],
      lesson: 'Spanish conversation practice - ordering food',
      mood: 'okay',
      energyBefore: 65,
      energyAfter: 70,
      focusLevel: 'medium',
      sessionDetails: 'Practiced restaurant vocabulary and polite expressions',
      tags: ['spanish', 'conversation', 'vocabulary'],
    },
  ]
  
  // Demo habit tracking (last 30 days)
  const demoHabitTracking = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    // Simulate different completion patterns
    const skill1Chance = i < 10 ? 0.8 : (i < 20 ? 0.6 : 0.9)
    const skill2Chance = i < 15 ? 0.3 : 0.7
    const skill3Chance = 0.95
    
    if (Math.random() < skill1Chance) {
      demoHabitTracking.push({ date, skillId: '1', completed: true, hours: 2 })
    }
    if (Math.random() < skill2Chance) {
      demoHabitTracking.push({ date, skillId: '2', completed: true, hours: 1.5 })
    }
    if (Math.random() < skill3Chance) {
      demoHabitTracking.push({ date, skillId: '3', completed: true, hours: 0.5 })
    }
  }
  
  // Save demo data to localStorage
  localStorage.setItem('skills', JSON.stringify(demoSkills))
  localStorage.setItem('upgem_gamification', JSON.stringify(demoGamification))
  localStorage.setItem('upgem_learningEntries', JSON.stringify(demoLearningEntries))
  localStorage.setItem('upgem_habitTracking', JSON.stringify(demoHabitTracking))
  
  // Set demo username
  localStorage.setItem('upgem_username', 'Demo User')
  localStorage.setItem('upgem_theme', 'system')
  localStorage.setItem('upgem_accent', 'purple')
}

const validatePassword = (pwd: string): string | null => {
  if (pwd.length < 12) {
    return 'Password must be at least 12 characters'
  }
  if (!/[A-Z]/.test(pwd)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(pwd)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[0-9]/.test(pwd)) {
    return 'Password must contain at least one number'
  }
  return null
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    if (showPasswordSetup) {
      // Setting up new password
      const validationError = validatePassword(password.value)
      if (validationError) {
        error.value = validationError
        return
      }

      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }

      // Store password hash (in real app, this would be hashed properly)
      localStorage.setItem('skillEdPassword', btoa(password.value))
      localStorage.setItem('skillEdSetup', 'password')
      
      success.value = 'Password set successfully!'
      authStore.setAuthenticated(true, true)
      
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      // Verifying existing password
      const storedPassword = localStorage.getItem('skillEdPassword')
      if (!storedPassword) {
        error.value = 'No password found. Please set up your account.'
        return
      }

      if (btoa(password.value) !== storedPassword) {
        error.value = 'Incorrect password'
        return
      }

      authStore.setAuthenticated(true, true)
      await router.push('/')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Authentication failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -200px;
  right: -200px;
  animation: float 8s ease-in-out infinite;
}

.login-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  animation: float 6s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
}

.login-card {
  background: var(--surface);
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 440px;
  padding: 48px 40px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-gem {
  font-size: 56px;
  display: block;
  margin-bottom: 16px;
  animation: gemPulse 3s ease-in-out infinite;
}

@keyframes gemPulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(-5deg); }
  50% { transform: scale(1.1) rotate(0deg); }
  75% { transform: scale(1.05) rotate(5deg); }
}

.login-header h1 {
  font-size: 36px;
  margin: 0;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.tagline {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 16px 0;
  font-weight: 500;
}

.subtitle {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
}

.login-header h3 {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  font-weight: 500;
}

.welcome-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--surface);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.option-button:hover {
  transform: translateX(4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.option-button.quick-start:hover {
  border-color: #16a34a;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.option-button.demo:hover {
  border-color: #ca8a04;
  background: linear-gradient(135deg, #fefce8, #fef3c7);
}

.option-button.secure:hover {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.option-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-content strong {
  font-size: 16px;
  color: var(--text-primary);
}

.option-content small {
  font-size: 13px;
  color: var(--text-secondary);
}

.setup-info {
  padding: 12px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 8px;
  margin-bottom: 16px;
}

.setup-info p {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding: 12px;
  padding-right: 48px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.toggle-password {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.toggle-password:hover {
  background: var(--surface-secondary);
}

.form-group input {
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--surface);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group small {
  color: var(--text-secondary);
  font-size: 12px;
}

.error-message {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #dc2626;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.5s ease;
}

.success-message {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #16a34a;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon, .success-icon {
  font-size: 18px;
}

.login-button {
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-button {
  padding: 12px;
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: var(--surface-secondary);
  color: var(--text-primary);
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
