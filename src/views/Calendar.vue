<template>
  <div class="calendar-page">
    <div class="page-header">
      <div>
        <h1>📅 Activity Calendar</h1>
        <p class="subtitle">Track your progress over time</p>
      </div>
      <div class="month-nav">
        <button @click="prevMonth" class="nav-btn">←</button>
        <span class="current-month">{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="nextMonth" class="nav-btn">→</button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-icon">🔥</span>
        <div class="stat-info">
          <span class="stat-value">{{ gamification.streak }}</span>
          <span class="stat-label">Current Streak</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">📊</span>
        <div class="stat-info">
          <span class="stat-value">{{ activeDays }}</span>
          <span class="stat-label">Active Days</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon">⚡</span>
        <div class="stat-info">
          <span class="stat-value">{{ monthlyXP }}</span>
          <span class="stat-label">XP This Month</span>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-container">
      <div class="calendar-header">
        <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
      </div>
      
      <div class="calendar-grid">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          :class="['calendar-day', { 
            inactive: !day.isCurrentMonth,
            today: day.isToday,
            active: day.activity > 0,
            'activity-low': day.activity === 1,
            'activity-medium': day.activity === 2,
            'activity-high': day.activity >= 3
          }]"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.dayNumber }}</span>
          <div v-if="day.activity > 0" class="activity-dot"></div>
        </div>
      </div>
    </div>

    <!-- Activity Legend -->
    <div class="legend">
      <span class="legend-label">Activity Level:</span>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color none"></div>
          <span>None</span>
        </div>
        <div class="legend-item">
          <div class="legend-color low"></div>
          <span>Low</span>
        </div>
        <div class="legend-item">
          <div class="legend-color medium"></div>
          <span>Medium</span>
        </div>
        <div class="legend-item">
          <div class="legend-color high"></div>
          <span>High</span>
        </div>
      </div>
    </div>

    <!-- Selected Day Details -->
    <div v-if="selectedDay && selectedDay.activities.length > 0" class="day-details">
      <h3>📋 {{ formatSelectedDate }}</h3>
      <div class="activity-list">
        <div v-for="activity in selectedDay.activities" :key="activity.id" class="activity-item">
          <span class="activity-icon">{{ activity.icon }}</span>
          <span class="activity-text">{{ activity.description }}</span>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>

    <!-- Milestones -->
    <div class="milestones-section">
      <h3>🏆 Milestones</h3>
      <div class="milestones-grid">
        <div 
          v-for="milestone in milestones" 
          :key="milestone.id"
          :class="['milestone-card', { achieved: milestone.achieved }]"
        >
          <span class="milestone-icon">{{ milestone.icon }}</span>
          <div class="milestone-info">
            <span class="milestone-name">{{ milestone.name }}</span>
            <span class="milestone-desc">{{ milestone.description }}</span>
          </div>
          <span v-if="milestone.achieved" class="milestone-check">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const gamification = useGamificationStore()

const currentDate = ref(new Date())
const selectedDay = ref<any>(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const currentYear = computed(() => currentDate.value.getFullYear())

const activeDays = computed(() => {
  return gamification.activityLog.filter(a => {
    const date = new Date(a.timestamp)
    return date.getMonth() === currentDate.value.getMonth() && 
           date.getFullYear() === currentDate.value.getFullYear()
  }).length
})

const monthlyXP = computed(() => {
  return gamification.activityLog
    .filter(a => {
      const date = new Date(a.timestamp)
      return date.getMonth() === currentDate.value.getMonth() && 
             date.getFullYear() === currentDate.value.getFullYear() &&
             a.type === 'xp'
    })
    .length * 15 // Approximate XP
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()
  const totalDays = lastDay.getDate()
  
  const days = []
  const today = new Date()
  
  // Previous month padding
  const prevMonth = new Date(year, month, 0)
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push({
      date: `prev-${i}`,
      dayNumber: prevMonth.getDate() - i,
      isCurrentMonth: false,
      isToday: false,
      activity: 0,
      activities: []
    })
  }
  
  // Current month
  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(year, month, i)
    const isToday = dayDate.toDateString() === today.toDateString()
    
    // Check activity for this day
    const dayActivities = gamification.activityLog.filter(a => {
      const actDate = new Date(a.timestamp)
      return actDate.toDateString() === dayDate.toDateString()
    })
    
    days.push({
      date: dayDate.toISOString(),
      dayNumber: i,
      isCurrentMonth: true,
      isToday,
      activity: Math.min(3, dayActivities.length),
      activities: dayActivities
    })
  }
  
  // Next month padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: `next-${i}`,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      activity: 0,
      activities: []
    })
  }
  
  return days
})

const formatSelectedDate = computed(() => {
  if (!selectedDay.value) return ''
  const date = new Date(selectedDay.value.date)
  return date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
})

const milestones = ref([
  { id: 1, icon: '🔥', name: '7 Day Streak', description: 'Stay active for 7 days', achieved: false },
  { id: 2, icon: '🔥', name: '30 Day Streak', description: 'Stay active for 30 days', achieved: false },
  { id: 3, icon: '⭐', name: 'Level 10', description: 'Reach level 10', achieved: false },
  { id: 4, icon: '💯', name: '100 Habits', description: 'Complete 100 habits', achieved: false },
  { id: 5, icon: '🎯', name: 'Skill Master', description: 'Max out a skill', achieved: false },
  { id: 6, icon: '🏆', name: 'Champion', description: 'Unlock all achievements', achieved: false },
])

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDay = (day: any) => {
  if (day.isCurrentMonth && day.activities.length > 0) {
    selectedDay.value = day
  }
}
</script>

<style scoped>
.calendar-page {
  max-width: 1000px;
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
  flex-wrap: wrap;
  gap: 16px;
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

.month-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--surface);
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.nav-btn:hover {
  background: var(--primary-gradient);
  color: white;
}

.current-month {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 160px;
  text-align: center;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
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

/* Calendar */
.calendar-container {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: var(--background);
}

.calendar-day:hover {
  transform: scale(1.05);
}

.calendar-day.inactive {
  opacity: 0.3;
}

.calendar-day.today {
  border: 2px solid var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.calendar-day.activity-low {
  background: rgba(16, 185, 129, 0.15);
}

.calendar-day.activity-medium {
  background: rgba(16, 185, 129, 0.35);
}

.calendar-day.activity-high {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(52, 211, 153, 0.5));
}

.day-number {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.activity-dot {
  position: absolute;
  bottom: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.legend-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-items {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.none { background: var(--surface-secondary); }
.legend-color.low { background: rgba(16, 185, 129, 0.2); }
.legend-color.medium { background: rgba(16, 185, 129, 0.4); }
.legend-color.high { background: rgba(16, 185, 129, 0.7); }

/* Day Details */
.day-details {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.day-details h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--text-primary);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--background);
  border-radius: 12px;
}

.activity-icon {
  font-size: 20px;
}

.activity-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 14px;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 12px;
}

/* Milestones */
.milestones-section {
  margin-top: 32px;
}

.milestones-section h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: var(--text-primary);
}

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.milestone-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--surface);
  border: 2px dashed var(--border-color);
  border-radius: 16px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.milestone-card.achieved {
  border-style: solid;
  border-color: #10b981;
  opacity: 1;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
}

.milestone-icon {
  font-size: 32px;
}

.milestone-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.milestone-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
}

.milestone-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.milestone-check {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .calendar-day {
    font-size: 12px;
  }
}
</style>
