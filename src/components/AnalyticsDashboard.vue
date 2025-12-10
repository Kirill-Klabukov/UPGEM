<template>
  <div class="analytics-dashboard">
    <div class="analytics-grid">
      <!-- Velocity Card -->
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">📈</span>
          <span class="metric-title">Learning Velocity</span>
        </div>
        <div class="metric-value">{{ velocity }}</div>
        <div class="metric-unit">entries / week</div>
        <div class="metric-bar">
          <div class="bar-fill" :style="{ width: Math.min(velocityPercent, 100) + '%' }"></div>
        </div>
        <p class="metric-hint">{{ velocityHint }}</p>
      </div>

      <!-- Consistency Card -->
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">📊</span>
          <span class="metric-title">Consistency Score</span>
        </div>
        <div class="metric-value">{{ consistencyScore }}%</div>
        <div class="metric-unit">days active / 30</div>
        <div class="metric-bar">
          <div class="bar-fill" :style="{ width: consistencyScore + '%' }"></div>
        </div>
        <p class="metric-hint" :class="consistencyClass">{{ consistencyHint }}</p>
      </div>

      <!-- Focus Index Card -->
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">🎯</span>
          <span class="metric-title">Focus Index</span>
        </div>
        <div class="metric-value">{{ focusIndex }}%</div>
        <div class="metric-unit">concentration on main skill</div>
        <div class="metric-bar">
          <div class="bar-fill" :style="{ width: focusIndex + '%' }"></div>
        </div>
        <p class="metric-hint" :class="focusClass">{{ focusHint }}</p>
      </div>

      <!-- Energy Trend Card -->
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">⚡</span>
          <span class="metric-title">Energy Trend</span>
        </div>
        <div class="metric-value">{{ energyChange }}</div>
        <div class="metric-unit">before → after session</div>
        <div class="energy-visualization">
          <div class="energy-bar-small">
            <span class="energy-before" :style="{ height: avgEnergyBefore + '%' }"></span>
          </div>
          <div class="energy-arrow">→</div>
          <div class="energy-bar-small">
            <span class="energy-after" :style="{ height: avgEnergyAfter + '%' }"></span>
          </div>
        </div>
        <p class="metric-hint">{{ energyHint }}</p>
      </div>

      <!-- Skills Touched Card -->
      <div class="metric-card">
      <div class="metric-header">
          <span class="metric-icon">🎓</span>
          <span class="metric-title">Skills Touched</span>
        </div>
        <div class="metric-value">{{ uniqueSkillsCount }}</div>
        <div class="metric-unit">this week</div>
        <div class="metric-bar">
          <div class="bar-fill" :style="{ width: Math.min(uniqueSkillsCount * 10, 100) + '%' }"></div>
        </div>
        <p class="metric-hint">{{ skillsHint }}</p>
      </div>

      <!-- Mood Trend Card -->
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-icon">😊</span>
          <span class="metric-title">Mood Trend</span>
        </div>
        <div class="mood-distribution">
          <div v-for="(count, mood) in moodCounts" :key="mood" class="mood-item">
            <span class="mood-emoji">{{ getMoodEmoji(mood) }}</span>
            <span class="mood-count">{{ count }}</span>
          </div>
        </div>
        <p class="metric-hint">{{ moodHint }}</p>
      </div>
    </div>

    <!-- Time Analysis -->
    <div class="time-analysis">
      <h3>⏰ Learning Pattern Analysis</h3>
      <div class="analysis-row">
        <div class="analysis-item">
          <span class="analysis-label">Most Active Day</span>
          <span class="analysis-value">{{ mostActiveDay }}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Average Session Duration</span>
          <span class="analysis-value">{{ avgSessionDuration }}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Focus Level Distribution</span>
          <span class="analysis-value">{{ bestFocusLevel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '../stores/gamification'

const gamification = useGamificationStore()

const velocity = computed(() => gamification.velocity)

const velocityPercent = computed(() => {
  const v = parseFloat(velocity.value)
  return Math.min(v * 10, 100)
})

const velocityHint = computed(() => {
  const v = parseFloat(velocity.value)
  if (v > 5) return '🔥 Excellent learning pace!'
  if (v > 3) return '👍 Good consistent learning'
  if (v > 1) return '📝 Building momentum'
  return '⏰ Start journaling to track progress'
})

const consistencyScore = computed(() => gamification.consistencyScore)

const consistencyClass = computed(() => {
  if (consistencyScore.value >= 80) return 'excellent'
  if (consistencyScore.value >= 60) return 'good'
  if (consistencyScore.value >= 40) return 'okay'
  return 'poor'
})

const consistencyHint = computed(() => {
  const score = consistencyScore.value
  if (score >= 80) return '🌟 Exceptional dedication!'
  if (score >= 60) return '👍 Great consistency'
  if (score >= 40) return '📈 Room to improve'
  return '⏰ Try daily practice'
})

const focusIndex = computed(() => gamification.focusIndex)

const focusClass = computed(() => {
  if (focusIndex.value >= 70) return 'excellent'
  if (focusIndex.value >= 50) return 'good'
  if (focusIndex.value >= 30) return 'okay'
  return 'poor'
})

const focusHint = computed(() => {
  const focus = focusIndex.value
  if (focus >= 70) return '🎯 Laser-focused learner'
  if (focus >= 50) return '📚 Balanced learning approach'
  if (focus >= 30) return '🌐 Diverse skill building'
  return '✨ Great exploration!'
})

const avgEnergyBefore = computed(() => {
  if (gamification.learningEntries.length === 0) return 50
  const avg = gamification.learningEntries.reduce((sum, e) => sum + e.energyBefore, 0) / gamification.learningEntries.length
  return Math.round(avg)
})

const avgEnergyAfter = computed(() => {
  if (gamification.learningEntries.length === 0) return 50
  const avg = gamification.learningEntries.reduce((sum, e) => sum + e.energyAfter, 0) / gamification.learningEntries.length
  return Math.round(avg)
})

const energyChange = computed(() => {
  const change = avgEnergyAfter.value - avgEnergyBefore.value
  return change > 0 ? `+${change}%` : `${change}%`
})

const energyHint = computed(() => {
  const change = avgEnergyAfter.value - avgEnergyBefore.value
  if (change > 10) return '⚡ Sessions boost your energy!'
  if (change > 0) return '😊 Learning gives energy'
  if (change === 0) return '➡️ Neutral energy impact'
  return '😴 Consider shorter sessions'
})

const uniqueSkillsCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const recentEntries = gamification.learningEntries.filter(
    e => new Date(e.date) >= oneWeekAgo
  )
  
  return new Set(recentEntries.map(e => e.skillId)).size
})

const skillsHint = computed(() => {
  if (uniqueSkillsCount.value > 5) return '🌟 Great skill variety!'
  if (uniqueSkillsCount.value > 2) return '👍 Good balance'
  if (uniqueSkillsCount.value > 0) return '📍 Focus on core skills'
  return '🎯 Start tracking skills'
})

const getMoodEmoji = (mood: string) => {
  const map: Record<string, string> = {
    poor: '😔',
    okay: '😐',
    good: '😊',
    excellent: '🤩',
  }
  return map[mood] || '😊'
}

const moodCounts = computed(() => {
  const counts: Record<string, number> = {
    poor: 0,
    okay: 0,
    good: 0,
    excellent: 0,
  }
  
  gamification.learningEntries.forEach(e => {
    counts[e.mood]++
  })
  
  return counts
})

const moodHint = computed(() => {
  const excellent = moodCounts.value.excellent
  const poor = moodCounts.value.poor
  const total = Object.values(moodCounts.value).reduce((a, b) => a + b, 0)
  
  if (total === 0) return '📝 Add entries to see mood trends'
  
  const positivePercent = ((excellent + moodCounts.value.good) / total) * 100
  if (positivePercent >= 70) return '😊 Mostly positive experiences!'
  if (positivePercent >= 50) return '😐 Mixed feelings'
  return '⚠️ Consider harder content'
})

const mostActiveDay = computed(() => {
  const dayCounts: Record<string, number> = {}
  
  gamification.learningEntries.forEach(e => {
    const date = new Date(e.date)
    const day = date.toLocaleDateString('en-US', { weekday: 'long' })
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })
  
  const maxDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  return maxDay ? maxDay[0] : 'N/A'
})

const avgSessionDuration = computed(() => {
  if (gamification.learningEntries.length === 0) return 'N/A'
  // This would need actual duration tracking in session details
  return '~1.5 hours'
})

const bestFocusLevel = computed(() => {
  const counts = {
    high: 0,
    medium: 0,
    low: 0,
  }
  
  gamification.learningEntries.forEach(e => {
    counts[e.focusLevel]++
  })
  
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return best ? `${best[0]} (${best[1]} times)` : 'N/A'
})
</script>

<style scoped>
.analytics-dashboard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.metric-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 18px;
  transition: all 0.3s;
}

.metric-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-icon {
  font-size: 20px;
}

.metric-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.metric-unit {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.metric-bar {
  height: 6px;
  background: var(--surface-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.bar-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.metric-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.metric-hint.excellent {
  color: var(--success-color);
}

.metric-hint.good {
  color: var(--primary-color);
}

.metric-hint.okay {
  color: var(--warning-color);
}

.metric-hint.poor {
  color: var(--danger-color);
}

.energy-visualization {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  height: 60px;
  margin: 12px 0;
}

.energy-bar-small {
  width: 24px;
  height: 100%;
  background: var(--surface-secondary);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.energy-before {
  width: 100%;
  background: #fbbf24;
  display: block;
}

.energy-after {
  width: 100%;
  background: #10b981;
  display: block;
}

.energy-arrow {
  font-size: 18px;
  color: var(--text-secondary);
}

.mood-distribution {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin: 12px 0;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mood-emoji {
  font-size: 18px;
}

.mood-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.time-analysis {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 18px;
}

.time-analysis h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.analysis-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.analysis-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: var(--surface-secondary);
  border-radius: 10px;
}

.analysis-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.analysis-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .analysis-row {
    grid-template-columns: 1fr;
  }
}
</style>
