<template>
  <div class="skills-page">
    <div class="page-header">
      <div>
        <h1>🎯 My Skills</h1>
        <p class="subtitle">Track your progress and level up</p>
      </div>
      <button class="primary-btn" @click="openModal()">
        <span>+</span> Add Skill
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-chip">
        <span class="stat-icon">🎯</span>
        <span class="stat-value">{{ skills.length }}</span>
        <span class="stat-label">Skills</span>
      </div>
      <div class="stat-chip">
        <span class="stat-icon">⏱️</span>
        <span class="stat-value">{{ totalHours }}h</span>
        <span class="stat-label">Practiced</span>
      </div>
      <div class="stat-chip">
        <span class="stat-icon">✅</span>
        <span class="stat-value">{{ completedHabits }}</span>
        <span class="stat-label">Habits Done</span>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="toolbar">
      <div class="search-box">
        <span>🔍</span>
        <input v-model="searchQuery" placeholder="Search skills..." />
      </div>
      <div class="filter-chips">
        <button 
          v-for="cat in ['All', ...categories]" 
          :key="cat"
          :class="['chip', { active: filterCategory === cat }]"
          @click="filterCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Skills Grid -->
    <div class="skills-grid">
      <div v-if="filteredSkills.length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>No skills yet</h3>
        <p>Start your journey by adding your first skill!</p>
        <button class="primary-btn" @click="openModal()">+ Add Skill</button>
      </div>

      <div v-for="skill in filteredSkills" :key="skill.id" class="skill-card">
        <div class="skill-header">
          <div class="skill-info">
            <h3>{{ skill.name }}</h3>
            <span class="category-badge">{{ skill.category }}</span>
          </div>
          <div class="skill-level">
            <span class="level-badge">LVL {{ getLevel(skill.proficiencyLevel) }}</span>
          </div>
        </div>

        <!-- Progress Ring -->
        <div class="progress-section">
          <div class="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle class="ring-bg" cx="50" cy="50" r="42" />
              <circle 
                class="ring-progress" 
                cx="50" 
                cy="50" 
                r="42"
                :style="{ strokeDashoffset: getProgressOffset(skill.proficiencyLevel) }"
              />
            </svg>
            <div class="ring-text">
              <span class="ring-value">{{ skill.proficiencyLevel }}%</span>
              <span class="ring-label">Progress</span>
            </div>
          </div>
          <div class="skill-stats">
            <div class="stat-row">
              <span>⏱️ {{ skill.totalHours || 0 }}h practiced</span>
            </div>
            <div class="stat-row">
              <span>🔥 {{ skill.streak || 0 }} day streak</span>
            </div>
          </div>
        </div>

        <!-- Description (Markdown) -->
        <div v-if="skill.description" class="skill-description" v-html="renderMarkdown(skill.description)"></div>

        <!-- Skill Habits -->
        <div class="skill-habits">
          <div class="habits-header">
            <h4>📋 Daily Actions</h4>
            <button class="add-habit-btn" @click="addHabitToSkill(skill)">+</button>
          </div>
          <div v-if="skill.habits && skill.habits.length > 0" class="habits-list">
            <div 
              v-for="habit in skill.habits" 
              :key="habit.id" 
              class="habit-item"
              :class="{ completed: habit.completedToday }"
            >
              <button 
                class="habit-check" 
                @click="toggleHabit(skill, habit)"
              >
                {{ habit.completedToday ? '✓' : '' }}
              </button>
              <span class="habit-name">{{ habit.name }}</span>
              <span class="habit-xp">+{{ habit.xp }} XP</span>
            </div>
          </div>
          <p v-else class="no-habits">Add daily actions to level up faster</p>
        </div>

        <!-- Actions -->
        <div class="skill-actions">
          <button class="action-btn practice" @click="logPractice(skill)">
            ⏱️ Log Practice
          </button>
          <button class="action-btn edit" @click="openModal(skill)">
            ✏️ Edit
          </button>
          <button class="action-btn delete" @click="deleteSkill(skill.id)">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Skill Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingSkill ? '✏️ Edit Skill' : '✨ New Skill' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveSkill" class="skill-form">
          <div class="form-group">
            <label>Skill Name *</label>
            <input v-model="formData.name" placeholder="e.g., JavaScript, Piano..." required />
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="formData.category" required>
              <option value="">Select category</option>
              <option value="Programming">💻 Programming</option>
              <option value="Design">🎨 Design</option>
              <option value="Languages">🗣️ Languages</option>
              <option value="Music">🎵 Music</option>
              <option value="Fitness">💪 Fitness</option>
              <option value="Business">💼 Business</option>
              <option value="Art">🎨 Art</option>
              <option value="Science">🔬 Science</option>
              <option value="Writing">✍️ Writing</option>
              <option value="Speaking">🎤 Speaking</option>
              <option value="Leadership">👑 Leadership</option>
              <option value="Negotiation">🤝 Negotiation</option>
              <option value="Cooking">👨‍🍳 Cooking</option>
              <option value="Sports">⚽ Sports</option>
              <option value="Health">❤️ Health</option>
              <option value="Other">📚 Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Description (Markdown supported)</label>
            <textarea 
              v-model="formData.description" 
              placeholder="## Goals&#10;- Learn basics&#10;- Practice daily&#10;&#10;## Resources&#10;- [Tutorial](https://...)"
              rows="6"
            ></textarea>
            <small>Supports **bold**, *italic*, lists, and links</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Current Progress (%)</label>
              <input type="range" v-model.number="formData.proficiencyLevel" min="0" max="100" />
              <span class="range-value">{{ formData.proficiencyLevel }}%</span>
            </div>
            <div class="form-group">
              <label>Hours Practiced</label>
              <input type="number" v-model.number="formData.totalHours" min="0" step="0.5" />
            </div>
          </div>

          <div class="form-group">
            <label>Custom Icon (Emoji)</label>
            <div class="icon-picker">
              <input type="text" v-model="formData.customIcon" placeholder="Pick an emoji (e.g., 🚀, 🎯, 💻)" maxlength="2" />
              <span v-if="formData.customIcon" class="icon-preview">{{ formData.customIcon }}</span>
            </div>
            <small>Popular: 🚀 🎯 💻 🎨 🎵 ⚽ 📚 🏆</small>
          </div>

          <div class="form-group">
            <label>Custom Image</label>
            <div class="image-upload">
              <input 
                type="file" 
                ref="imageInput"
                accept="image/*"
                @change="handleImageUpload"
                style="display: none"
              />
              <button type="button" class="secondary-btn" @click="$refs.imageInput?.click()">
                📸 Upload Image
              </button>
              <span v-if="formData.imageUrl" class="image-preview">✓ Image selected</span>
            </div>
            <small>Max 500KB. This image will be displayed as your skill's thumbnail.</small>
          </div>

          <div class="form-actions">
            <button type="submit" class="primary-btn">
              {{ editingSkill ? '💾 Save Changes' : '✨ Create Skill' }}
            </button>
            <button type="button" class="secondary-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Practice Log Modal -->
    <div v-if="showPracticeModal" class="modal-overlay" @click="showPracticeModal = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h2>⏱️ Log Practice</h2>
          <button class="close-btn" @click="showPracticeModal = false">×</button>
        </div>
        <form @submit.prevent="submitPractice" class="practice-form">
          <p class="practice-skill">{{ currentSkill?.name }}</p>
          <div class="form-group">
            <label>Hours Practiced</label>
            <input type="number" v-model.number="practiceHours" min="0.25" step="0.25" required />
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="practiceNotes" placeholder="What did you practice?"></textarea>
          </div>
          <div class="xp-preview">
            <span>You'll earn:</span>
            <span class="xp-amount">+{{ Math.floor(practiceHours * 20) }} XP</span>
          </div>
          <button type="submit" class="primary-btn full">✓ Log Practice</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSkillStore } from '../stores/skill'
import { useGamificationStore } from '../stores/gamification'

interface SkillHabit {
  id: string
  name: string
  xp: number
  completedToday: boolean
}

interface Skill {
  id: string
  name: string
  category: string
  description: string
  proficiencyLevel: number
  totalHours: number
  streak: number
  habits: SkillHabit[]
  createdAt: string
  updatedAt: string
}

const skillStore = useSkillStore()
const gamification = useGamificationStore()

const showModal = ref(false)
const showPracticeModal = ref(false)
const editingSkill = ref<Skill | null>(null)
const currentSkill = ref<Skill | null>(null)
const searchQuery = ref('')
const filterCategory = ref('All')
const practiceHours = ref(0.5)
const practiceNotes = ref('')
const imageInput = ref<HTMLInputElement | null>(null)

const formData = ref({
  name: '',
  category: '',
  description: '',
  proficiencyLevel: 0,
  totalHours: 0,
  customIcon: '',
  imageUrl: '',
})

const skills = computed(() => skillStore.skills as Skill[])

const categories = computed(() => {
  const cats = new Set(skills.value.map(s => s.category))
  return Array.from(cats)
})

const filteredSkills = computed(() => {
  let result = skills.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.category.toLowerCase().includes(q)
    )
  }
  
  if (filterCategory.value !== 'All') {
    result = result.filter(s => s.category === filterCategory.value)
  }
  
  return result
})

const totalHours = computed(() => 
  skills.value.reduce((sum, s) => sum + (s.totalHours || 0), 0).toFixed(1)
)

const completedHabits = computed(() => 
  skills.value.reduce((sum, s) => 
    sum + (s.habits?.filter(h => h.completedToday).length || 0), 0
  )
)

const getLevel = (proficiency: number): number => {
  return Math.floor(proficiency / 10) + 1
}

const getProgressOffset = (proficiency: number): number => {
  const circumference = 2 * Math.PI * 42
  return circumference - (proficiency / 100) * circumference
}

const renderMarkdown = (text: string): string => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gim, '<h4>$1</h4>')
    .replace(/^# (.*$)/gim, '<h3>$1</h3>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br>')
}

const openModal = (skill?: Skill) => {
  if (skill) {
    editingSkill.value = skill
    formData.value = { 
      ...skill,
      customIcon: skill.customIcon || '',
      imageUrl: skill.imageUrl || '',
    }
  } else {
    editingSkill.value = null
    formData.value = { 
      name: '', 
      category: '', 
      description: '', 
      proficiencyLevel: 0, 
      totalHours: 0,
      customIcon: '',
      imageUrl: '',
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingSkill.value = null
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  // Check file size (500KB max)
  if (file.size > 500 * 1024) {
    alert('Image must be smaller than 500KB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.imageUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const saveSkill = async () => {
  if (editingSkill.value) {
    await skillStore.updateSkill(editingSkill.value.id, formData.value)
  } else {
    await skillStore.createSkill({
      ...formData.value,
      habits: [],
      streak: 0,
    })
    gamification.stats.skillsCompleted++
    gamification.addXP(50, 'Added new skill')
  }
  closeModal()
}

const deleteSkill = async (id: string) => {
  if (confirm('Delete this skill?')) {
    await skillStore.deleteSkill(id)
  }
}

const logPractice = (skill: Skill) => {
  currentSkill.value = skill
  practiceHours.value = 0.5
  practiceNotes.value = ''
  showPracticeModal.value = true
}

const submitPractice = () => {
  if (currentSkill.value) {
    const hours = practiceHours.value
    skillStore.updateSkill(currentSkill.value.id, {
      ...currentSkill.value,
      totalHours: (currentSkill.value.totalHours || 0) + hours
    })
    gamification.logPractice(hours)
  }
  showPracticeModal.value = false
}

const addHabitToSkill = (skill: Skill) => {
  const name = prompt('Enter habit name (e.g., "Practice for 30 min"):')
  if (!name) return
  
  const habits = skill.habits || []
  habits.push({
    id: Date.now().toString(),
    name,
    xp: 15,
    completedToday: false,
  })
  
  skillStore.updateSkill(skill.id, { ...skill, habits })
}

const toggleHabit = (skill: Skill, habit: SkillHabit) => {
  habit.completedToday = !habit.completedToday
  
  if (habit.completedToday) {
    gamification.addXP(habit.xp, `Completed: ${habit.name}`)
    gamification.completeHabit()
  }
  
  skillStore.updateSkill(skill.id, { ...skill })
}

onMounted(() => {
  skillStore.fetchSkills()
})
</script>

<style scoped>
.skills-page {
  max-width: 1200px;
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
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.primary-btn.full {
  width: 100%;
  justify-content: center;
}

.secondary-btn {
  padding: 12px 24px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: var(--border-color);
}

.stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-icon { font-size: 20px; }
.stat-value { font-weight: 700; color: var(--text-primary); }
.stat-label { color: var(--text-secondary); font-size: 13px; }

.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--primary-color);
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  padding: 12px 0;
  color: var(--text-primary);
  outline: none;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 8px 16px;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.chip.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.skill-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.skill-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: var(--text-primary);
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.level-badge {
  padding: 6px 12px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.progress-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 16px;
}

.progress-ring {
  width: 100px;
  height: 100px;
  position: relative;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 264;
  transition: stroke-dashoffset 0.5s ease;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.ring-label {
  font-size: 10px;
  color: var(--text-secondary);
}

.skill-stats {
  flex: 1;
}

.stat-row {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.skill-description {
  padding: 16px;
  background: var(--surface-secondary);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.skill-description :deep(h3),
.skill-description :deep(h4) {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.skill-description :deep(li) {
  margin-left: 16px;
}

.skill-description :deep(a) {
  color: var(--primary-color);
}

.skill-habits {
  margin-bottom: 16px;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.habits-header h4 {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}

.add-habit-btn {
  width: 28px;
  height: 28px;
  border: 2px dashed var(--border-color);
  background: none;
  border-radius: 8px;
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.add-habit-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.habit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--surface-secondary);
  border-radius: 10px;
  transition: all 0.2s;
}

.habit-item.completed {
  background: rgba(16, 185, 129, 0.1);
}

.habit-item.completed .habit-name {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.habit-check {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  background: var(--surface);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--success-color);
  transition: all 0.2s;
}

.habit-item.completed .habit-check {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.habit-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.habit-xp {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.no-habits {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
}

.skill-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.practice {
  background: var(--success-color);
  color: white;
}

.action-btn.edit {
  background: var(--surface-secondary);
  color: var(--text-primary);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  flex: 0;
  padding: 10px 14px;
}

.action-btn:hover {
  transform: scale(1.02);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--surface);
  border-radius: 20px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content.small {
  max-width: 400px;
}

@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
  font-size: 22px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--surface-secondary);
  border-radius: 10px;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--border-color);
  transform: rotate(90deg);
}

.skill-form, .practice-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.practice-skill {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  transition: all 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--surface);
}

.form-group small {
  color: var(--text-secondary);
  font-size: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.range-value {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  margin-top: 4px;
}

.icon-picker {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-picker input {
  flex: 1;
}

.icon-preview {
  font-size: 28px;
  line-height: 1;
  padding: 0 8px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-preview {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--surface-secondary);
  border-radius: 8px;
  color: var(--success-color);
  font-weight: 500;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.xp-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--surface-secondary);
  border-radius: 12px;
}

.xp-amount {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

