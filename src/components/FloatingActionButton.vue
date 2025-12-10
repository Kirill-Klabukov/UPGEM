<template>
  <div class="fab-container">
    <transition name="fab-menu">
      <div v-if="isOpen" class="fab-menu">
        <button @click="$emit('action', 'skill')" class="fab-menu-item" title="Add Skill">
          <span class="fab-icon">🎯</span>
          <span class="fab-label">Add Skill</span>
        </button>
        <button @click="$emit('action', 'habit')" class="fab-menu-item" title="Add Habit">
          <span class="fab-icon">✅</span>
          <span class="fab-label">Add Habit</span>
        </button>
        <button @click="$emit('action', 'practice')" class="fab-menu-item" title="Log Practice">
          <span class="fab-icon">⏱️</span>
          <span class="fab-label">Log Practice</span>
        </button>
        <button @click="$emit('action', 'export')" class="fab-menu-item" title="Export Data">
          <span class="fab-icon">📤</span>
          <span class="fab-label">Export Data</span>
        </button>
      </div>
    </transition>
    
    <button @click="toggleFAB" class="fab-button" :class="{ active: isOpen }">
      <span class="fab-icon">{{ isOpen ? '✕' : '➕' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleFAB = () => {
  isOpen.value = !isOpen.value
}

defineEmits<{
  action: [type: string]
}>()
</script>

<style scoped>
.fab-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
}

.fab-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.fab-button.active {
  transform: rotate(45deg);
}

.fab-button .fab-icon {
  font-size: 28px;
  color: white;
  transition: transform 0.3s ease;
}

.fab-menu {
  position: absolute;
  bottom: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fab-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  background: var(--surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.fab-menu-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.fab-menu-item .fab-icon {
  font-size: 20px;
}

.fab-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .fab-container {
    bottom: 20px;
    right: 20px;
  }
  
  .fab-button {
    width: 56px;
    height: 56px;
  }
  
  .fab-button .fab-icon {
    font-size: 24px;
  }
}
</style>
