<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <template v-if="route.path !== '/login'">
      <AppHeader :is-dark="isDarkMode" @toggle-theme="toggleTheme" />
    </template>
    <main class="main-content" :class="{ 'full-page': route.path === '/login' }">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
          </transition>
        </router-view>
      </div>
    </main>
    <FloatingActionButton v-if="showFAB" @action="handleQuickAction" />
    
    <!-- Mobile Bottom Nav -->
    <nav v-if="showMobileNav" class="mobile-nav">
      <router-link to="/" class="mobile-nav-item" exact-active-class="active">
        <span>📊</span>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/skills" class="mobile-nav-item" active-class="active">
        <span>🎯</span>
        <span>Skills</span>
      </router-link>
      <router-link to="/calendar" class="mobile-nav-item" active-class="active">
        <span>📅</span>
        <span>Calendar</span>
      </router-link>
      <router-link to="/settings" class="mobile-nav-item" active-class="active">
        <span>⚙️</span>
        <span>Settings</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemesStore } from './stores/themes'
import { useCustomizationStore } from './stores/customization'
import AppHeader from './components/AppHeader.vue'
import FloatingActionButton from './components/FloatingActionButton.vue'

const themesStore = useThemesStore()
const customizationStore = useCustomizationStore()
const isDarkMode = ref(false)
const router = useRouter()
const route = useRoute()

const showFAB = computed(() => {
  return route.path !== '/login'
})

const showMobileNav = computed(() => {
  return route.path !== '/login' && window.innerWidth <= 768
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  updateThemeClass()
}

const updateThemeClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

const handleQuickAction = (type: string) => {
  switch (type) {
    case 'skill':
      router.push('/skills')
      break
    case 'habit':
      router.push('/habits')
      break
    case 'practice':
      // TODO: Open practice log modal
      break
    case 'export':
      exportData()
      break
  }
}

const exportData = () => {
  const data = {
    skills: localStorage.getItem('skills') || '[]',
    habits: localStorage.getItem('habits') || '[]',
    settings: localStorage.getItem('settings') || '{}',
    exported: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skilled-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = savedTheme ? savedTheme === 'dark' : prefersDark
  updateThemeClass()

  // Apply customization styles
  const settings = customizationStore.getSettings()
  if (settings.backgroundImage) {
    document.body.style.backgroundImage = `url('${settings.backgroundImage}')`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundPosition = 'center'
  }
  // Apply filter effects (opacity + gamma + blur)
  const opacity = settings.backgroundOpacity
  const gamma = settings.backgroundGamma
  const blur = settings.backgroundBlur
  const filter = `opacity(${opacity}) brightness(${gamma}) blur(${blur}px)`
  if (settings.backgroundImage) {
    document.body.style.filter = filter
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      updateThemeClass()
    }
  })

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for quick actions
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      // TODO: Open command palette
    }
    // Ctrl/Cmd + N for new skill
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault()
      router.push('/skills')
    }
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --primary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background: #f8fafc;
  --surface: #ffffff;
  --surface-secondary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius: 12px;
  --border-radius-lg: 16px;
}

.dark-mode {
  --background: #0f172a;
  --surface: #1e293b;
  --surface-secondary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

html.dark-mode {
  color-scheme: dark;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  transition: background-color var(--transition-normal), color var(--transition-normal);
  line-height: 1.6;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--background);
  transition: background-color var(--transition-normal);
  padding-bottom: 80px; /* Space for mobile nav */
}

.main-content.full-page {
  padding-bottom: 0;
}

.content-wrapper {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Mobile Bottom Navigation */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border-color);
  padding: 8px 16px;
  z-index: 100;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
    justify-content: space-around;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s;
}

.mobile-nav-item span:first-child {
  font-size: 20px;
}

.mobile-nav-item.active {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

/* Smooth page transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all var(--transition-normal);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Selection styling */
::selection {
  background-color: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal);
}

.animate-slide-up {
  animation: slideUp var(--transition-normal);
}

/* Compact UI density */
.compact-mode .dashboard .stat-card,
.compact-mode .goal-card,
.compact-mode .dashboard-section,
.compact-mode .skill-card,
.compact-mode .habit-card,
.compact-mode .settings-section,
.compact-mode .insight-card {
  padding: 14px !important;
  border-radius: 12px;
}

.compact-mode .main-content .content-wrapper {
  padding: 16px;
}

.compact-mode .goal-edit input,
.compact-mode .goal-inputs input,
.compact-mode .theme-btn,
.compact-mode .action-btn {
  padding: 8px 12px;
}
</style>

