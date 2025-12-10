<template>
  <div class="settings">
    <div class="page-header">
      <h1>⚙️ Settings</h1>
      <p class="subtitle">Customize your UPGEM experience</p>
    </div>

    <!-- Profile Section -->
    <div class="settings-section profile-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <span>{{ userInitials }}</span>
        </div>
        <div class="profile-info">
          <h3>{{ username }}</h3>
          <p>Level {{ gamification.level }} • {{ gamification.stats.totalXP }} XP</p>
        </div>
        <button class="edit-profile-btn" @click="editUsername">✏️</button>
      </div>
    </div>

    <!-- Appearance -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">🎨</span>
        <h3>Appearance</h3>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <label>Color Theme</label>
          <p>Select your preferred visual theme</p>
        </div>
        <div class="themes-grid">
          <button 
            v-for="t in availableThemes" 
            :key="t.id"
            :class="['theme-card', { active: themesStore.currentTheme.id === t.id }]"
            @click="themesStore.setTheme(t.id)"
            :title="t.name"
          >
            <div class="theme-preview">
              <div class="theme-colors">
                <span class="color-swatch" :style="{ background: t.primary }"></span>
                <span class="color-swatch" :style="{ background: t.secondary }"></span>
                <span class="color-swatch" :style="{ background: t.accent }"></span>
              </div>
              <span class="theme-name">{{ t.name }}</span>
            </div>
          </button>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Accent Color</label>
          <p>Personalize your interface</p>
        </div>
        <div class="color-picker">
          <button 
            v-for="color in accentColors" 
            :key="color.value"
            :class="['color-btn', { active: accentColor === color.value }]"
            :style="{ background: color.gradient }"
            @click="setAccentColor(color.value)"
            :title="color.name"
          ></button>
          <!-- Custom color picker -->
          <div class="custom-color-wrapper">
            <input 
              type="color" 
              v-model="customAccentColor"
              @input="setCustomAccentColor"
              class="custom-color-input"
              title="Custom color"
            />
            <span class="custom-label">Custom</span>
          </div>
        </div>
      </div>

      <!-- Background Customization -->
      <div class="setting-item full-width">
        <div class="setting-info">
          <label>🖼️ Background Customization</label>
          <p>Upload custom background image with effects</p>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Background Image</label>
          <p>Upload an image for your background (max 5MB)</p>
        </div>
        <div class="image-upload-container">
          <input 
            type="file" 
            ref="bgImageInput"
            accept="image/*"
            @change="handleBackgroundImageUpload"
            style="display: none"
          />
          <button class="secondary-btn" @click="() => bgImageInput?.click()">
            📸 Upload Image
          </button>
          <button v-if="backgroundImage" class="secondary-btn danger" @click="removeBackgroundImage">
            ✕ Remove
          </button>
          <span v-if="backgroundImage" class="image-info">✓ Background set</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Background Opacity</label>
          <p>Control how transparent the background is</p>
        </div>
        <div class="slider-container">
          <input 
            type="range" 
            :value="bgOpacity" 
            min="0" 
            max="100" 
            step="1"
            @input="(e) => updateBackgroundOpacity(Number((e.target as HTMLInputElement).value))"
          />
          <span class="slider-value">{{ bgOpacity }}%</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Background Gamma (Brightness)</label>
          <p>Adjust image brightness (0.5 = dark, 2.0 = bright)</p>
        </div>
        <div class="slider-container">
          <input 
            type="range" 
            :value="bgGamma" 
            min="0.5" 
            max="2" 
            step="0.1"
            @input="(e) => updateBackgroundGamma(Number((e.target as HTMLInputElement).value))"
          />
          <span class="slider-value">{{ bgGamma.toFixed(1) }}x</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Background Blur</label>
          <p>Apply blur effect to background (0-20px)</p>
        </div>
        <div class="slider-container">
          <input 
            type="range" 
            :value="bgBlur" 
            min="0" 
            max="20" 
            step="1"
            @input="(e) => updateBackgroundBlur(Number((e.target as HTMLInputElement).value))"
          />
          <span class="slider-value">{{ bgBlur }}px</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>🎨 Custom Accent Color</label>
          <p>Set a custom hex color for accents</p>
        </div>
        <div class="color-picker-container">
          <input 
            type="text" 
            v-model="customAccentColor" 
            placeholder="#FF5733"
            class="text-input"
          />
          <button @click="setCustomAccentColor" class="action-btn">
            Apply Color
          </button>
        </div>
      </div>
    </div>

    <!-- Productivity & Goals -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">🚀</span>
        <h3>Productivity & Goals</h3>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Daily XP Goal</label>
          <p>Target XP to hit each day</p>
        </div>
        <div class="goal-inputs">
          <input type="number" v-model.number="goalDailyInput" min="50" step="10" />
          <span class="goal-unit">XP</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Weekly XP Goal</label>
          <p>Stretch goal for the week</p>
        </div>
        <div class="goal-inputs">
          <input type="number" v-model.number="goalWeeklyInput" min="200" step="25" />
          <span class="goal-unit">XP</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Interface Density</label>
          <p>Choose tighter or roomier spacing</p>
        </div>
        <div class="theme-selector">
          <button :class="['theme-btn', { active: uiDensity === 'comfortable' }]" @click="setDensity('comfortable')">Comfortable</button>
          <button :class="['theme-btn', { active: uiDensity === 'compact' }]" @click="setDensity('compact')">Compact</button>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Apply Goals</label>
          <p>Save XP targets for dashboard tracking</p>
        </div>
        <button class="action-btn primary" @click="saveGoalSettings">Save Goals</button>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">🔒</span>
        <h3>Security & Privacy</h3>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <label>Master Password</label>
          <p>{{ hasPassword ? 'Password protection enabled' : 'No password protection' }}</p>
        </div>
        <button v-if="!hasPassword" @click="enablePassword" class="action-btn primary">
          Enable Password
        </button>
        <button v-else @click="changePassword" class="action-btn">
          Change Password
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Data Encryption</label>
          <p>All sensitive data is encrypted locally with ChaCha20-Poly1305</p>
        </div>
        <span class="badge success">🔐 Active</span>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Auto-Lock</label>
          <p>Lock app after inactivity</p>
        </div>
        <select v-model="autoLockMinutes" class="select-input">
          <option :value="0">Never</option>
          <option :value="5">5 minutes</option>
          <option :value="15">15 minutes</option>
          <option :value="30">30 minutes</option>
          <option :value="60">1 hour</option>
        </select>
      </div>
    </div>

    <!-- Notifications -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">🔔</span>
        <h3>Notifications</h3>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <label>Browser Notifications</label>
          <p>Get reminders for habits and milestones</p>
        </div>
        <button @click="requestNotifications" :disabled="notificationsEnabled" class="action-btn">
          {{ notificationsEnabled ? '✓ Enabled' : 'Enable' }}
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Daily Reminder</label>
          <p>Get reminded to check your habits</p>
        </div>
        <div class="toggle-switch">
          <input type="checkbox" id="dailyReminder" v-model="dailyReminder" />
          <label for="dailyReminder"></label>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Achievement Alerts</label>
          <p>Celebrate when you unlock achievements</p>
        </div>
        <div class="toggle-switch">
          <input type="checkbox" id="achievementAlerts" v-model="achievementAlerts" />
          <label for="achievementAlerts"></label>
        </div>
      </div>
    </div>

    <!-- Gamification -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">🎮</span>
        <h3>Gamification</h3>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>XP Animations</label>
          <p>Show animations when earning XP</p>
        </div>
        <div class="toggle-switch">
          <input type="checkbox" id="xpAnimations" v-model="xpAnimations" />
          <label for="xpAnimations"></label>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Level Up Sounds</label>
          <p>Play sound effects on level up</p>
        </div>
        <div class="toggle-switch">
          <input type="checkbox" id="levelSounds" v-model="levelSounds" />
          <label for="levelSounds"></label>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Reset Progress</label>
          <p class="warning-text">Start fresh with a new journey</p>
        </div>
        <button @click="resetProgress" class="action-btn danger">
          🔄 Reset XP & Level
        </button>
      </div>
    </div>

    <!-- Data Management -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">💾</span>
        <h3>Data Management</h3>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <label>Export Data</label>
          <p>Download a backup of all your data</p>
        </div>
        <div class="button-group">
          <button @click="exportJSON" class="action-btn">
            📄 Export JSON
          </button>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <label>Import Data</label>
          <p>Restore from a backup file</p>
        </div>
        <input 
          ref="fileInput" 
          type="file" 
          accept=".json" 
          @change="handleImport" 
          style="display: none"
        />
        <button @click="triggerImport" class="action-btn">
          📥 Import Backup
        </button>
      </div>

      <div class="setting-item danger-zone">
        <div class="setting-info">
          <label class="danger-label">Delete All Data</label>
          <p>Permanently remove all your data. This cannot be undone.</p>
        </div>
        <button @click="deleteAllData" class="action-btn danger">
          🗑️ Delete Everything
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="settings-section">
      <div class="section-header">
        <span class="section-icon">💎</span>
        <h3>About UPGEM</h3>
      </div>
      
      <div class="about-card">
        <div class="about-logo">💎</div>
        <div class="about-content">
          <h4>UPGEM</h4>
          <p class="version">Version 1.0.0</p>
          <p class="tagline">Level Up Your Life</p>
          <div class="about-features">
            <span class="feature-tag">🔒 End-to-end encrypted</span>
            <span class="feature-tag">📱 Local-first</span>
            <span class="feature-tag">🚫 No telemetry</span>
            <span class="feature-tag">💻 Open Source</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGamificationStore } from '../stores/gamification'
import { useThemesStore } from '../stores/themes'
import { useCustomizationStore } from '../stores/customization'
import { exportToJSON, restoreFromBackup } from '../utils/export'
import { requestNotificationPermission } from '../utils/notifications'

const authStore = useAuthStore()
const gamification = useGamificationStore()
const themesStore = useThemesStore()
const customizationStore = useCustomizationStore()

const hasPassword = ref(false)
const notificationsEnabled = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const username = ref('Champion')
const theme = ref('system')
const accentColor = ref('purple')
const autoLockMinutes = ref(0)
const dailyReminder = ref(true)
const achievementAlerts = ref(true)
const xpAnimations = ref(true)
const levelSounds = ref(false)
const goalDailyInput = ref(gamification.goals.dailyXP)
const goalWeeklyInput = ref(gamification.goals.weeklyXP)
const uiDensity = ref(localStorage.getItem('upgem_density') || 'comfortable')

const availableThemes = computed(() => themesStore.themes())

const accentColors = [
  { name: 'Purple', value: 'purple', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { name: 'Blue', value: 'blue', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { name: 'Green', value: 'green', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { name: 'Orange', value: 'orange', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { name: 'Pink', value: 'pink', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { name: 'Red', value: 'red', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
]

const userInitials = computed(() => {
  return username.value.substring(0, 2).toUpperCase()
})

onMounted(() => {
  hasPassword.value = localStorage.getItem('skillEdHasPassword') === 'true'
  notificationsEnabled.value = Notification.permission === 'granted'
  
  // Load saved preferences
  username.value = localStorage.getItem('upgem_username') || 'Champion'
  theme.value = localStorage.getItem('upgem_theme') || 'system'
  accentColor.value = localStorage.getItem('upgem_accent') || 'purple'
  dailyReminder.value = localStorage.getItem('upgem_dailyReminder') !== 'false'
  achievementAlerts.value = localStorage.getItem('upgem_achievementAlerts') !== 'false'
  xpAnimations.value = localStorage.getItem('upgem_xpAnimations') !== 'false'
  levelSounds.value = localStorage.getItem('upgem_levelSounds') === 'true'

  // Sync goals and density
  goalDailyInput.value = gamification.goals.dailyXP
  goalWeeklyInput.value = gamification.goals.weeklyXP
  applyDensity()
})

const editUsername = () => {
  const newName = prompt('Enter your name:', username.value)
  if (newName && newName.trim()) {
    username.value = newName.trim()
    localStorage.setItem('upgem_username', username.value)
  }
}

const setTheme = (newTheme: string) => {
  theme.value = newTheme
  localStorage.setItem('upgem_theme', newTheme)
  
  if (newTheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}

const setAccentColor = (color: string) => {
  accentColor.value = color
  localStorage.setItem('upgem_accent', color)
  // Apply accent color to CSS variables
  document.documentElement.style.setProperty('--accent-selected', color)
}

const setDensity = (density: string) => {
  uiDensity.value = density
  localStorage.setItem('upgem_density', density)
  applyDensity()
}

const applyDensity = () => {
  document.documentElement.classList.toggle('compact-mode', uiDensity.value === 'compact')
}

const saveGoalSettings = () => {
  const daily = Math.max(50, goalDailyInput.value)
  const weekly = Math.max(200, goalWeeklyInput.value)
  goalDailyInput.value = daily
  goalWeeklyInput.value = weekly
  gamification.setGoals(daily, weekly)
  alert('Goals updated')
}

const enablePassword = () => {
  const password = prompt('Create a master password (min 12 characters):')
  if (!password || password.length < 12) {
    alert('Password must be at least 12 characters')
    return
  }
  
  authStore.enablePassword(password)
  hasPassword.value = true
  alert('Password protection enabled!')
}

const changePassword = () => {
  const currentPassword = prompt('Enter current password:')
  if (!currentPassword) return
  
  const storedPassword = localStorage.getItem('skillEdPassword')
  if (btoa(currentPassword) !== storedPassword) {
    alert('Incorrect password')
    return
  }
  
  const newPassword = prompt('Enter new password (min 12 characters):')
  if (!newPassword || newPassword.length < 12) return
  
  localStorage.setItem('skillEdPassword', btoa(newPassword))
  alert('Password changed successfully!')
}

const requestNotifications = async () => {
  const granted = await requestNotificationPermission()
  notificationsEnabled.value = granted
  if (granted) {
    alert('Notifications enabled!')
  }
}

const resetProgress = () => {
  if (confirm('Are you sure you want to reset your XP and level? This cannot be undone.')) {
    gamification.xp = 0
    gamification.level = 1
    gamification.streak = 0
    gamification.stats.totalXP = 0
    alert('Progress has been reset!')
  }
}

const deleteAllData = () => {
  if (confirm('⚠️ Are you sure you want to delete ALL your data? This action is IRREVERSIBLE!')) {
    if (confirm('This is your last chance. All skills, habits, and progress will be permanently deleted.')) {
      localStorage.clear()
      window.location.reload()
    }
  }
}

const exportJSON = () => {
  exportToJSON()
}

const triggerImport = () => {
  fileInput.value?.click()
}

const handleImport = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    await restoreFromBackup(file)
  }
}

// Customization handlers
const bgImageInput = ref<HTMLInputElement | null>(null)
const customAccentColor = ref('')
const bgOpacity = ref(100)
const bgGamma = ref(1)
const bgBlur = ref(0)
const backgroundImage = ref<string | null>(null)

const handleBackgroundImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const imageData = e.target?.result as string
    backgroundImage.value = imageData
    customizationStore.setBackgroundImage(imageData)
  }
  reader.readAsDataURL(file)
}

const removeBackgroundImage = () => {
  backgroundImage.value = null
  customizationStore.setBackgroundImage(null)
  if (bgImageInput.value) {
    bgImageInput.value.value = ''
  }
}

const updateBackgroundOpacity = (value: number) => {
  bgOpacity.value = value
  customizationStore.setBackgroundOpacity(value / 100)
}

const updateBackgroundGamma = (value: number) => {
  bgGamma.value = value
  customizationStore.setBackgroundGamma(value)
}

const updateBackgroundBlur = (value: number) => {
  bgBlur.value = value
  customizationStore.setBackgroundBlur(value)
}

const setCustomAccentColor = () => {
  if (customAccentColor.value.match(/^#[0-9A-F]{6}$/i)) {
    customizationStore.setAccentColor(customAccentColor.value)
    localStorage.setItem('upgem_customAccent', customAccentColor.value)
  } else {
    alert('Please enter a valid hex color (e.g., #FF5733)')
  }
}

onMounted(() => {
  hasPassword.value = localStorage.getItem('skillEdHasPassword') === 'true'
  notificationsEnabled.value = Notification.permission === 'granted'
  
  // Load saved preferences
  username.value = localStorage.getItem('upgem_username') || 'Champion'
  theme.value = localStorage.getItem('upgem_theme') || 'system'
  accentColor.value = localStorage.getItem('upgem_accent') || 'purple'
  dailyReminder.value = localStorage.getItem('upgem_dailyReminder') !== 'false'
  achievementAlerts.value = localStorage.getItem('upgem_achievementAlerts') !== 'false'
  xpAnimations.value = localStorage.getItem('upgem_xpAnimations') !== 'false'
  levelSounds.value = localStorage.getItem('upgem_levelSounds') === 'true'

  // Load customization settings
  customAccentColor.value = localStorage.getItem('upgem_customAccent') || '#6366f1'
  const customSettings = customizationStore.getSettings()
  bgOpacity.value = customSettings.backgroundOpacity * 100
  bgGamma.value = customSettings.backgroundGamma
  bgBlur.value = customSettings.backgroundBlur
  backgroundImage.value = customSettings.backgroundImage || null

  // Sync goals and density
  goalDailyInput.value = gamification.goals.dailyXP
  goalWeeklyInput.value = gamification.goals.weeklyXP
  applyDensity()
})
</script>

<style scoped>
.settings {
  max-width: 900px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 32px;
}

h1 {
  font-size: 28px;
  margin: 0;
  color: var(--text-primary);
}

.subtitle {
  margin: 4px 0 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Profile Section */
.profile-section {
  background: var(--primary-gradient) !important;
  color: white;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.profile-info h3 {
  margin: 0;
  font-size: 20px;
  color: white;
}

.profile-info p {
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.edit-profile-btn {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Settings Section */
.settings-section {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.section-icon {
  font-size: 24px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  gap: 20px;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-info label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 15px;
}

.setting-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.warning-text {
  color: #f59e0b !important;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  gap: 8px;
}

.theme-btn {
  padding: 8px 14px;
  border: 2px solid var(--border-color);
  background: var(--background);
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.theme-btn.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.theme-btn:hover:not(.active) {
  border-color: var(--primary-color);
}

/* Color Picker */
.color-picker {
  display: flex;
  gap: 8px;
}

.color-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-btn.active {
  border-color: var(--text-primary);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-btn:hover:not(.active) {
  transform: scale(1.1);
}

/* Goals */
.goal-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 6px 10px;
}

.goal-inputs input {
  width: 120px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--text-primary);
}

.goal-unit {
  font-weight: 700;
  color: var(--text-secondary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  display: block;
  width: 52px;
  height: 28px;
  background: var(--surface-secondary);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.toggle-switch label::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + label {
  background: var(--primary-gradient);
}

.toggle-switch input:checked + label::after {
  left: calc(100% - 25px);
}

/* Select Input */
.select-input {
  padding: 10px 16px;
  border: 2px solid var(--border-color);
  background: var(--background);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.select-input:focus {
  border-color: var(--primary-color);
}

/* Action Buttons */
.action-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  background: var(--background);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
  color: var(--text-primary);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.action-btn.danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  border-color: transparent;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Danger Zone */
.danger-zone {
  background: rgba(239, 68, 68, 0.05);
  margin: 16px -24px -24px;
  padding: 16px 24px;
  border-radius: 0 0 20px 20px;
}

.danger-label {
  color: #ef4444 !important;
}

/* Badge */
.badge {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.badge.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15));
  color: #10b981;
}

/* About Card */
.about-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--primary-gradient);
  border-radius: 16px;
  color: white;
}

.about-logo {
  font-size: 48px;
}

.about-content h4 {
  margin: 0;
  font-size: 24px;
}

.about-content .version {
  margin: 4px 0;
  opacity: 0.8;
  font-size: 13px;
}

.about-content .tagline {
  margin: 0 0 12px 0;
  font-size: 14px;
  opacity: 0.9;
}

.about-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  width: 100%;
}

.theme-card {
  position: relative;
  padding: 12px;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.theme-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.theme-card.active {
  border-color: var(--primary-color);
  background: var(--surface-secondary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.theme-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.theme-colors {
  display: flex;
  gap: 4px;
}

.color-swatch {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.theme-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .theme-selector,
  .color-picker,
  .themes-grid {
    flex-wrap: wrap;
  }
  
  .themes-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .about-card {
    flex-direction: column;
    text-align: center;
  }
  
  .about-features {
    justify-content: center;
  }
}
</style>
