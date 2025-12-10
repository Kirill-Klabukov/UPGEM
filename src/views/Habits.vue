<template>
  <div class="habits-page">
    <div class="page-header">
      <div>
        <h1>✅ Daily Habits</h1>
        <p class="subtitle">Build consistency, earn rewards</p>
      </div>
      <button class="primary-btn" @click="openModal()">
        <span>+</span> New Habit
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-chip">
        <span class="stat-icon">✅</span>
        <span class="stat-value">{{ completedToday }}/{{ habits.length }}</span>
        <span class="stat-label">Today</span>
      </div>
      <div class="stat-chip streak">
        <span class="stat-icon">🔥</span>
        <span class="stat-value">{{ gamification.streak }}</span>
        <span class="stat-label">Streak</span>
      </div>
      <div class="stat-chip">
        <span class="stat-icon">⚡</span>
        <span class="stat-value">{{ todayXP }}</span>
        <span class="stat-label">XP Today</span>
      </div>
    </div>

    <!-- Templates -->
    <div class="template-row" v-if="habitTemplates.length">
      <p class="template-title">Quick templates</p>
      <div class="template-chips">
        <button v-for="tpl in habitTemplates" :key="tpl.name" class="template-chip" @click="useTemplate(tpl)">
          <span>{{ tpl.icon }}</span>
          <div class="tpl-text">
            <strong>{{ tpl.name }}</strong>
            <small>{{ tpl.hint }}</small>
          </div>
          <span class="tpl-xp">+{{ tpl.xp }} XP</span>
        </button>
      </div>
    </div>

    <!-- Habits List -->
    <div class="habits-container">
      <div v-if="habits.length === 0" class="empty-state">
        <div class="empty-icon">✨</div>
        <h3>No habits yet</h3>
        <p>Create your first habit to start building consistency!</p>
        <button class="primary-btn" @click="openModal()">+ Create Habit</button>
      </div>

      <div v-else class="habits-list">
        <div 
          v-for="habit in habits" 
          :key="habit.id" 
          :class="['habit-card', { completed: habit.completedToday }]"
        >
          <button 
            class="habit-check" 
            @click="toggleHabit(habit)"
            :class="{ checked: habit.completedToday }"
          >
            <span v-if="habit.completedToday">✓</span>
          </button>
          
          <div class="habit-content">
            <div class="habit-header">
              <h3>{{ habit.name }}</h3>
              <span class="habit-xp">+{{ habit.xp }} XP</span>
            </div>
            <p v-if="habit.description" class="habit-description">{{ habit.description }}</p>
            <div class="habit-meta">
              <span class="habit-category" :style="{ background: getCategoryColor(habit.category) }">
                {{ habit.category }}
              </span>
              <span class="habit-streak" v-if="habit.streak > 0">
                🔥 {{ habit.streak }} day streak
              </span>
            </div>
          </div>

          <div class="habit-actions">
            <button class="action-btn" @click="openModal(habit)" title="Edit">✏️</button>
            <button class="action-btn delete" @click="deleteHabit(habit.id)" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Habit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingHabit ? '✏️ Edit Habit' : '✨ New Habit' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveHabit" class="habit-form">
          <div class="form-group">
            <label>Habit Name *</label>
            <input v-model="formData.name" placeholder="e.g., Morning meditation" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" placeholder="Why is this habit important?"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="formData.category">
                <option value="Health">💪 Health</option>
                <option value="Learning">📚 Learning</option>
                <option value="Productivity">🎯 Productivity</option>
                <option value="Mindfulness">🧘 Mindfulness</option>
                <option value="Social">👥 Social</option>
                <option value="Creative">🎨 Creative</option>
                <option value="Other">📌 Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>XP Reward</label>
              <input type="number" v-model.number="formData.xp" min="5" max="100" step="5" />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="primary-btn">
              {{ editingHabit ? '💾 Save Changes' : '✨ Create Habit' }}
            </button>
            <button type="button" class="secondary-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGamificationStore } from '../stores/gamification'

interface Habit {
  id: string
  name: string
  description: string
  category: string
  xp: number
  completedToday: boolean
  streak: number
  createdAt: string
}

interface HabitTemplate {
  name: string
  description: string
  category: string
  xp: number
  icon: string
  hint: string
}

const gamification = useGamificationStore()

const habits = ref<Habit[]>([])
const showModal = ref(false)
const editingHabit = ref<Habit | null>(null)
const formData = ref({
  name: '',
  description: '',
  category: 'Health',
  xp: 15,
})

const habitTemplates: HabitTemplate[] = [
  { name: 'Morning Stretch', description: '5-10 minutes of light stretching', category: 'Health', xp: 15, icon: '🤸', hint: 'Start the day loose' },
  { name: 'Read 10 pages', description: 'Spend time reading a book', category: 'Learning', xp: 20, icon: '📚', hint: 'Knowledge drip' },
  { name: 'Meditate 10m', description: 'Calm focus session', category: 'Mindfulness', xp: 15, icon: '🧘', hint: 'Find your center' },
  { name: 'Walk 20 min', description: 'Light walk to move and think', category: 'Health', xp: 15, icon: '🚶', hint: 'Get steps in' },
  { name: 'Inbox Zero', description: 'Clear inbox and plan next day', category: 'Productivity', xp: 20, icon: '📧', hint: 'End-of-day tidy' },
]

const completedToday = computed(() => habits.value.filter(h => h.completedToday).length)
const todayXP = computed(() => habits.value.filter(h => h.completedToday).reduce((sum, h) => sum + h.xp, 0))

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Health: 'linear-gradient(135deg, #10b981, #34d399)',
    Learning: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    Productivity: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    Mindfulness: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    Social: 'linear-gradient(135deg, #ec4899, #f472b6)',
    Creative: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    Other: 'linear-gradient(135deg, #6b7280, #9ca3af)',
  }
  return colors[category] || colors.Other
}

const openModal = (habit?: Habit) => {
  if (habit) {
    editingHabit.value = habit
    formData.value = { ...habit }
  } else {
    editingHabit.value = null
    formData.value = { name: '', description: '', category: 'Health', xp: 15 }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingHabit.value = null
}

const saveHabit = () => {
  if (editingHabit.value) {
    const idx = habits.value.findIndex(h => h.id === editingHabit.value!.id)
    if (idx !== -1) {
      habits.value[idx] = { ...habits.value[idx], ...formData.value }
    }
  } else {
    habits.value.push({
      id: Date.now().toString(),
      ...formData.value,
      completedToday: false,
      streak: 0,
      createdAt: new Date().toISOString(),
    })
    gamification.addXP(25, 'Created new habit')
  }
  saveToStorage()
  closeModal()
}

const useTemplate = (template: HabitTemplate) => {
  formData.value = {
    name: template.name,
    description: template.description,
    category: template.category,
    xp: template.xp,
  }
  editingHabit.value = null
  showModal.value = true
}

const toggleHabit = (habit: Habit) => {
  habit.completedToday = !habit.completedToday
  
  if (habit.completedToday) {
    habit.streak++
    gamification.addXP(habit.xp, `Completed: ${habit.name}`)
    gamification.completeHabit()
  } else {
    habit.streak = Math.max(0, habit.streak - 1)
  }
  
  saveToStorage()
}

const deleteHabit = (id: string) => {
  if (confirm('Delete this habit?')) {
    habits.value = habits.value.filter(h => h.id !== id)
    saveToStorage()
  }
}

const saveToStorage = () => {
  localStorage.setItem('upgem_habits', JSON.stringify(habits.value))
}

const loadFromStorage = () => {
  const saved = localStorage.getItem('upgem_habits')
  if (saved) {
    habits.value = JSON.parse(saved)
    
    // Reset daily completions if new day
    const lastReset = localStorage.getItem('upgem_habits_lastReset')
    const today = new Date().toDateString()
    if (lastReset !== today) {
      habits.value.forEach(h => h.completedToday = false)
      localStorage.setItem('upgem_habits_lastReset', today)
      saveToStorage()
    }
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.habits-page {
  max-width: 900px;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.template-row {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
}

.template-title {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.template-chips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.template-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--surface-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tpl-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tpl-text strong {
  font-size: 14px;
  color: var(--text-primary);
}

.tpl-text small {
  color: var(--text-secondary);
  font-size: 12px;
}

.tpl-xp {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  flex: 1;
  min-width: 140px;
}

.stat-chip.streak {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
  border-color: rgba(245, 158, 11, 0.3);
}

.stat-icon {
  font-size: 24px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Habits List */
.habits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.habit-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.habit-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.habit-card.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
  border-color: rgba(16, 185, 129, 0.3);
}

.habit-check {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  background: var(--background);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.habit-check.checked {
  background: linear-gradient(135deg, #10b981, #34d399);
  border-color: transparent;
  animation: checkPop 0.4s ease;
}

@keyframes checkPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.habit-content {
  flex: 1;
}

.habit-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.habit-header h3 {
  margin: 0;
  font-size: 17px;
  color: var(--text-primary);
}

.habit-xp {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.habit-description {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.habit-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.habit-category {
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.habit-streak {
  font-size: 12px;
  color: var(--text-secondary);
}

.habit-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: var(--surface-secondary);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--border-color);
  transform: scale(1.1);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: var(--surface);
  border: 2px dashed var(--border-color);
  border-radius: 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.empty-state p {
  margin: 0 0 24px 0;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--surface);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--surface-secondary);
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--border-color);
}

.habit-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--background);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.secondary-btn {
  flex: 1;
  padding: 12px 24px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: var(--border-color);
}
</style>
