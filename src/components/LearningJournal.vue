<template>
  <div class="learning-journal">
    <div class="journal-header">
      <h3>📔 Learning Journal</h3>
      <div class="journal-controls">
        <input 
          v-model="searchQuery" 
          placeholder="Search entries..." 
          class="search-input"
        />
        <button @click="showAddEntry = true" class="primary-btn small">+ Add Entry</button>
      </div>
    </div>

    <!-- Add Entry Modal -->
    <div v-if="showAddEntry" class="modal-overlay" @click="showAddEntry = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>📝 New Journal Entry</h2>
          <button class="close-btn" @click="showAddEntry = false">×</button>
        </div>

        <form @submit.prevent="saveEntry" class="journal-form">
          <div class="form-group">
            <label>Date</label>
            <input v-model="newEntry.date" type="date" required />
          </div>

          <div class="form-group">
            <label>What I Learned Today *</label>
            <textarea 
              v-model="newEntry.lesson" 
              placeholder="Describe what you learned, discovered, or practiced..."
              rows="6"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mood 😊</label>
              <div class="mood-selector">
                <button 
                  v-for="mood in moods" 
                  :key="mood.value"
                  type="button"
                  :class="['mood-btn', { active: newEntry.mood === mood.value }]"
                  @click="newEntry.mood = mood.value"
                  :title="mood.label"
                >
                  {{ mood.emoji }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Focus Level</label>
              <div class="focus-selector">
                <button 
                  v-for="focus in focusLevels" 
                  :key="focus.value"
                  type="button"
                  :class="['focus-btn', { active: newEntry.focusLevel === focus.value }]"
                  @click="newEntry.focusLevel = focus.value"
                >
                  {{ focus.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Energy Before ({{ newEntry.energyBefore }})</label>
              <input 
                v-model.number="newEntry.energyBefore" 
                type="range" 
                min="0" 
                max="100" 
              />
            </div>

            <div class="form-group">
              <label>Energy After ({{ newEntry.energyAfter }})</label>
              <input 
                v-model.number="newEntry.energyAfter" 
                type="range" 
                min="0" 
                max="100" 
              />
            </div>
          </div>

          <div class="form-group">
            <label>Session Details (optional)</label>
            <textarea 
              v-model="newEntry.sessionDetails" 
              placeholder="How long did you practice? What resources did you use?"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Tags (comma-separated, optional)</label>
            <input 
              v-model="tagInput" 
              placeholder="e.g., #regex, #debugging, #optimization"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="primary-btn">💾 Save Entry</button>
            <button type="button" class="secondary-btn" @click="showAddEntry = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Entries List -->
    <div v-if="filteredEntries.length > 0" class="entries-list">
      <div v-for="entry in filteredEntries" :key="entry.id" class="entry-card">
        <div class="entry-header">
          <div class="entry-meta">
            <span class="entry-date">{{ formatDate(entry.date) }}</span>
            <span class="mood-badge">{{ getMoodEmoji(entry.mood) }}</span>
            <span class="focus-badge" :class="entry.focusLevel">{{ entry.focusLevel }}</span>
          </div>
          <button class="delete-btn" @click="deleteEntry(entry.id)" title="Delete">🗑️</button>
        </div>

        <p class="entry-lesson">{{ entry.lesson }}</p>

        <div v-if="entry.sessionDetails" class="entry-details">
          <strong>Session:</strong> {{ entry.sessionDetails }}
        </div>

        <div v-if="entry.tags.length > 0" class="entry-tags">
          <span v-for="tag in entry.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="energy-indicator">
          <div class="energy-bar">
            <span class="energy-before" :style="{ width: entry.energyBefore + '%' }"></span>
            <span class="energy-after" :style="{ width: entry.energyAfter + '%' }"></span>
          </div>
          <small>Energy: {{ entry.energyBefore }}% → {{ entry.energyAfter }}%</small>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>📔 No journal entries yet</p>
      <button @click="showAddEntry = true" class="primary-btn">Start Journaling</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const gamification = useGamificationStore()

const showAddEntry = ref(false)
const searchQuery = ref('')
const tagInput = ref('')

interface NewEntry {
  date: string
  lesson: string
  mood: 'poor' | 'okay' | 'good' | 'excellent'
  energyBefore: number
  energyAfter: number
  focusLevel: 'low' | 'medium' | 'high'
  sessionDetails: string
}

const newEntry = ref<NewEntry>({
  date: new Date().toISOString().split('T')[0],
  lesson: '',
  mood: 'good',
  energyBefore: 50,
  energyAfter: 70,
  focusLevel: 'high',
  sessionDetails: '',
})

const moods = [
  { emoji: '😔', value: 'poor', label: 'Poor' },
  { emoji: '😐', value: 'okay', label: 'Okay' },
  { emoji: '😊', value: 'good', label: 'Good' },
  { emoji: '🤩', value: 'excellent', label: 'Excellent' },
]

const focusLevels = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const filteredEntries = computed(() => {
  if (!searchQuery.value) return gamification.learningEntries
  return gamification.searchLearningEntries(searchQuery.value)
})

const getMoodEmoji = (mood: string) => {
  const moodMap: Record<string, string> = {
    poor: '😔',
    okay: '😐',
    good: '😊',
    excellent: '🤩',
  }
  return moodMap[mood] || '😊'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const saveEntry = () => {
  const tags = tagInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t)

  gamification.addLearningEntry({
    skillId: '',
    date: newEntry.value.date,
    lesson: newEntry.value.lesson,
    mood: newEntry.value.mood,
    energyBefore: newEntry.value.energyBefore,
    energyAfter: newEntry.value.energyAfter,
    focusLevel: newEntry.value.focusLevel,
    sessionDetails: newEntry.value.sessionDetails,
    tags,
  })

  // Reset form
  newEntry.value = {
    date: new Date().toISOString().split('T')[0],
    lesson: '',
    mood: 'good',
    energyBefore: 50,
    energyAfter: 70,
    focusLevel: 'high',
    sessionDetails: '',
  }
  tagInput.value = ''
  showAddEntry.value = false
}

const deleteEntry = (id: string) => {
  if (confirm('Delete this entry?')) {
    gamification.deleteLearningEntry(id)
  }
}
</script>

<style scoped>
.learning-journal {
  width: 100%;
}

.journal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.journal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
}

.journal-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 16px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.small {
  padding: 8px 14px !important;
  font-size: 13px !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface);
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
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
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journal-form {
  padding: 24px;
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
  font-size: 14px;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.mood-selector,
.focus-selector {
  display: flex;
  gap: 8px;
}

.mood-btn,
.focus-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--surface-secondary);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.mood-btn:hover,
.focus-btn:hover {
  border-color: var(--primary-color);
}

.mood-btn.active,
.focus-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.focus-btn {
  font-size: 13px;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 12px;
}

.form-actions button {
  flex: 1;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.entry-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px;
  transition: all 0.3s;
}

.entry-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.entry-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.entry-date {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.mood-badge,
.focus-badge {
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--surface-secondary);
  display: inline-block;
}

.focus-badge {
  font-size: 11px;
  text-transform: capitalize;
  color: var(--text-secondary);
}

.focus-badge.high {
  color: var(--success-color);
}

.focus-badge.medium {
  color: var(--warning-color);
}

.focus-badge.low {
  color: var(--danger-color);
}

.delete-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.delete-btn:hover {
  opacity: 1;
}

.entry-lesson {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.entry-details {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 8px;
  background: var(--surface-secondary);
  border-radius: 8px;
  margin: 12px 0;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.energy-indicator {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}

.energy-bar {
  position: relative;
  height: 20px;
  background: var(--surface-secondary);
  border-radius: 10px;
  overflow: hidden;
}

.energy-before,
.energy-after {
  position: absolute;
  height: 100%;
  display: block;
}

.energy-before {
  background: #fbbf24;
  opacity: 0.7;
}

.energy-after {
  background: #10b981;
}

.energy-bar small {
  position: relative;
  z-index: 2;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 16px;
}

.primary-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 14px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.secondary-btn {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.secondary-btn:hover {
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .journal-header {
    flex-direction: column;
    align-items: stretch;
  }

  .journal-controls {
    flex-direction: column;
  }

  .journal-controls input,
  .journal-controls button {
    width: 100%;
  }
}
</style>
