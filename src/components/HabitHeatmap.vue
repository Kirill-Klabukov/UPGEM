<template>
  <div class="habit-heatmap">
    <div class="heatmap-header">
      <h3>🔥 Habit Tracker (Last Year)</h3>
      <div class="heatmap-legend">
        <span>Less</span>
        <div class="legend-boxes">
          <div class="legend-box" style="background: var(--surface-secondary)"></div>
          <div class="legend-box" style="background: #dbeafe"></div>
          <div class="legend-box" style="background: #7dd3fc"></div>
          <div class="legend-box" style="background: #0284c7"></div>
          <div class="legend-box" style="background: #0c4a6e"></div>
        </div>
        <span>More</span>
      </div>
    </div>

    <div class="heatmap-container">
      <div class="heatmap-labels">
        <div v-for="month in monthLabels" :key="month" class="month-label">{{ month }}</div>
      </div>

      <div class="calendar-grid">
        <div v-for="day in dayLabels" :key="day" class="day-label">{{ day }}</div>
        
        <div v-for="(cell, idx) in heatmapCells" 
             :key="idx"
             :class="['heatmap-cell', getIntensity(cell.count)]"
             :title="`${cell.date}: ${cell.count} completions`"
        ></div>
      </div>
    </div>

    <div class="heatmap-stats">
      <div class="stat-item">
        <span class="stat-label">Total Days Active</span>
        <span class="stat-value">{{ totalActiveDays }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Current Streak</span>
        <span class="stat-value">{{ currentStreakDays }} 🔥</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Longest Streak</span>
        <span class="stat-value">{{ longestStreakDays }} ⭐</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Completions</span>
        <span class="stat-value">{{ totalCompletions }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const gamification = useGamificationStore()

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const heatmapCells = computed(() => {
  const cells = []
  const today = new Date()
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const count = gamification.habitTracking.filter(
      h => h.date === dateStr && h.completed
    ).length
    
    cells.push({ date: dateStr, count })
  }
  
  return cells
})

const getIntensity = (count: number) => {
  if (count === 0) return 'level-0'
  if (count === 1) return 'level-1'
  if (count <= 3) return 'level-2'
  if (count <= 5) return 'level-3'
  return 'level-4'
}

const totalActiveDays = computed(() => {
  return new Set(
    gamification.habitTracking
      .filter(h => h.completed)
      .map(h => h.date)
  ).size
})

const currentStreakDays = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  let currentDate = new Date(today)
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const hasCompletion = gamification.habitTracking.some(
      h => h.date === dateStr && h.completed
    )
    
    if (hasCompletion) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }
  
  return streak
})

const longestStreakDays = computed(() => {
  const sorted = [...gamification.habitTracking]
    .filter(h => h.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  if (sorted.length === 0) return 0
  
  let maxStreak = 1
  let currentStreak = 1
  
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date)
    const currDate = new Date(sorted[i].date)
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }
  
  return maxStreak
})

const totalCompletions = computed(() => {
  return gamification.habitTracking.filter(h => h.completed).length
})
</script>

<style scoped>
.habit-heatmap {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.heatmap-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-boxes {
  display: flex;
  gap: 4px;
}

.legend-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.heatmap-container {
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 12px;
}

.heatmap-labels {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  gap: 2px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.month-label {
  text-align: left;
  height: 16px;
  display: flex;
  align-items: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: auto repeat(53, 1fr);
  gap: 2px;
}

.day-label {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-weight: 500;
}

.heatmap-cell {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--surface-secondary);
}

.heatmap-cell:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.heatmap-cell.level-0 {
  background: var(--surface-secondary);
}

.heatmap-cell.level-1 {
  background: #dbeafe;
}

.heatmap-cell.level-2 {
  background: #7dd3fc;
}

.heatmap-cell.level-3 {
  background: #0284c7;
}

.heatmap-cell.level-4 {
  background: #0c4a6e;
}

.heatmap-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  background: var(--surface-secondary);
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .habit-heatmap {
    padding: 16px;
  }

  .heatmap-header {
    flex-direction: column;
    align-items: stretch;
  }

  .heatmap-legend {
    justify-content: space-between;
  }

  .heatmap-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
