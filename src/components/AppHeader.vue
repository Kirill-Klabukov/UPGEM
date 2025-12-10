<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <div class="logo-gem">💎</div>
        <span class="logo-text">UPGEM</span>
      </router-link>

      <nav class="header-nav">
        <router-link to="/" class="nav-item" exact-active-class="active">
          <span class="material-icon">📊</span>
          <span class="nav-label">Dashboard</span>
        </router-link>
        <router-link to="/skills" class="nav-item" active-class="active">
          <span class="material-icon">🎯</span>
          <span class="nav-label">Skills</span>
        </router-link>
        <router-link to="/calendar" class="nav-item" active-class="active">
          <span class="material-icon">📅</span>
          <span class="nav-label">Calendar</span>
        </router-link>
      </nav>

      <div class="header-actions">
        <!-- XP & Level Display -->
        <div class="xp-display" v-if="showXP">
          <div class="level-badge">LVL {{ level }}</div>
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: xpProgress + '%' }"></div>
          </div>
          <span class="xp-text">{{ currentXP }}/{{ xpNeeded }} XP</span>
        </div>

        <button class="icon-btn" @click="$emit('toggle-theme')" title="Toggle theme">
          <span>{{ isDark ? '☀️' : '🌙' }}</span>
        </button>
        
        <router-link to="/settings" class="icon-btn" title="Settings">
          <span>⚙️</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const props = defineProps<{
  isDark?: boolean
}>()

defineEmits<{
  'toggle-theme': []
}>()

const gamification = useGamificationStore()

const showXP = computed(() => gamification.stats.totalXP > 0)
const level = computed(() => gamification.stats.level)
const currentXP = computed(() => gamification.currentLevelXP)
const xpNeeded = computed(() => gamification.xpToNextLevel)
const xpProgress = computed(() => gamification.levelProgress)
</script>

<style scoped>
.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-gem {
  font-size: 28px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.header-nav {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: var(--surface-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.material-icon {
  font-size: 18px;
}

.nav-label {
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.xp-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: var(--surface-secondary);
  border-radius: 20px;
  margin-right: 8px;
}

.level-badge {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.xp-bar {
  width: 80px;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #d946ef);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.xp-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 70px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--surface-secondary);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  text-decoration: none;
}

.icon-btn:hover {
  background: var(--border-color);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
  
  .xp-display {
    display: none;
  }
}
</style>

