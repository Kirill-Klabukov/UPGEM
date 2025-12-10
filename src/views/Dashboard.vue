<template>
  <div class="dashboard">
    <!-- Demo Mode Banner -->
    <div v-if="isDemoMode" class="demo-banner">
      <span class="demo-badge">🎮 DEMO MODE</span>
      <span class="demo-text">You're exploring with sample data. </span>
      <button @click="exitDemoMode" class="demo-exit-btn">Create Account →</button>
    </div>

    <!-- Hero Section with Level Progress -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-text">
          <h1>Welcome back, Champion! 💎</h1>
          <p class="hero-subtitle">You're doing amazing. Keep leveling up!</p>
        </div>
        <div class="level-card">
          <div class="level-info">
            <span class="level-badge">LEVEL {{ gamification.level }}</span>
            <span class="xp-text">{{ gamification.currentLevelXP }} / {{ gamification.xpToNextLevel }} XP</span>
          </div>
          <div class="level-progress">
            <div class="level-progress-bar" :style="{ width: gamification.levelProgress + '%' }"></div>
          </div>
          <p class="level-hint">{{ xpRemaining }} XP to next level</p>
        </div>
      </div>
      <div class="quick-actions">
        <button @click="$router.push('/skills')" class="quick-action-btn primary">
          <span class="btn-icon">🎯</span>
          <span class="btn-text">Add Skill</span>
        </button>
        <button @click="$router.push('/habits')" class="quick-action-btn secondary">
          <span class="btn-icon">✓</span>
          <span class="btn-text">Log Habit</span>
        </button>
      </div>
    </div>

    <!-- Goals Row -->
    <div class="goals-row">
      <div class="goal-card">
        <div class="goal-header">
          <div>
            <p class="goal-label">Daily XP Goal</p>
            <p class="goal-value">{{ gamification.xpToday }} / {{ gamification.goals.dailyXP }} XP</p>
          </div>
          <span class="goal-status" :class="{ success: gamification.dailyProgress >= 100 }">
            {{ Math.round(gamification.dailyProgress) }}%
          </span>
        </div>
        <div class="goal-progress">
          <div class="goal-progress-fill" :style="{ width: gamification.dailyProgress + '%' }"></div>
        </div>
      </div>
      <div class="goal-card">
        <div class="goal-header">
          <div>
            <p class="goal-label">Weekly XP Goal</p>
            <p class="goal-value">{{ gamification.xpThisWeek }} / {{ gamification.goals.weeklyXP }} XP</p>
          </div>
          <span class="goal-status" :class="{ success: gamification.weeklyProgress >= 100 }">
            {{ Math.round(gamification.weeklyProgress) }}%
          </span>
        </div>
        <div class="goal-progress">
          <div class="goal-progress-fill" :style="{ width: gamification.weeklyProgress + '%' }"></div>
        </div>
      </div>
      <div class="goal-card edit-goal">
        <div class="goal-header">
          <div>
            <p class="goal-label">Adjust Goals</p>
            <p class="goal-value">Personalize XP targets</p>
          </div>
        </div>
        <div class="goal-edit">
          <label>Daily</label>
          <input type="number" v-model.number="dailyGoalInput" min="50" step="10" />
          <label>Weekly</label>
          <input type="number" v-model.number="weeklyGoalInput" min="200" step="25" />
          <button class="quick-action-btn primary" @click="saveGoals">Save</button>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon skills">🎯</div>
        <div class="stat-content">
          <div class="stat-value">{{ skillCount }}</div>
          <div class="stat-label">Active Skills</div>
          <div class="stat-trend positive">↑ Level up your abilities</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon habits">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ gamification.stats.habitsCompleted }}</div>
          <div class="stat-label">Habits Done</div>
          <div class="stat-trend">Keep the momentum!</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon streak">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{{ gamification.streak }}</div>
          <div class="stat-label">Day Streak</div>
          <div class="stat-trend fire">{{ gamification.streak > 0 ? 'On fire!' : 'Start today!' }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon xp">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ gamification.xp }}</div>
          <div class="stat-label">Total XP</div>
          <div class="stat-trend">+{{ gamification.practiceHours * 20 }} this week</div>
        </div>
      </div>
    </div>

    <!-- Insights Row -->
    <div class="insights-row">
      <div class="insight-card">
        <p class="insight-label">Next Achievement</p>
        <h4>{{ nextAchievement?.name || 'All achievements unlocked' }}</h4>
        <p class="insight-desc" v-if="nextAchievement">{{ nextAchievement.description }}</p>
        <div v-if="nextAchievement" class="insight-progress">
          <div class="insight-progress-fill" :style="{ width: nextAchievementProgress + '%' }"></div>
        </div>
        <p class="insight-hint" v-if="nextAchievement">
          {{ remainingTarget }} more {{ requirementLabel }} to unlock (+{{ nextAchievement.xpReward }} XP)
        </p>
        <p v-else class="insight-hint">You unlocked everything. 🎉</p>
      </div>

      <div class="insight-card secondary">
        <p class="insight-label">Weekly Snapshot</p>
        <div class="snapshot-grid">
          <div class="snapshot-item">
            <span class="snapshot-title">XP Today</span>
            <span class="snapshot-value">{{ gamification.xpToday }}</span>
          </div>
          <div class="snapshot-item">
            <span class="snapshot-title">XP This Week</span>
            <span class="snapshot-value">{{ gamification.xpThisWeek }}</span>
          </div>
          <div class="snapshot-item">
            <span class="snapshot-title">Habits Done</span>
            <span class="snapshot-value">{{ gamification.stats.habitsCompleted }}</span>
          </div>
          <div class="snapshot-item">
            <span class="snapshot-title">Active Streak</span>
            <span class="snapshot-value">{{ gamification.streak }}d</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Row -->
    <div class="dashboard-row">
      <!-- Skills Progress -->
      <div class="dashboard-section progress-section">
        <div class="section-header">
          <h3>📊 Skills Progress</h3>
          <button class="view-all-btn" @click="$router.push('/skills')">View All →</button>
        </div>
        
        <div v-if="topSkills.length > 0" class="skills-progress">
          <div v-for="skill in topSkills" :key="skill.id" class="skill-progress-item">
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-category">{{ skill.category }}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: skill.proficiency + '%' }">
                <span class="progress-text">{{ skill.proficiency }}%</span>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">
          <span class="empty-icon">🎯</span>
          No skills yet. Start by adding your first skill!
        </p>
      </div>

      <!-- Achievements -->
      <div class="dashboard-section achievements-section">
        <div class="section-header">
          <h3>🏆 Achievements</h3>
          <span class="achievement-count">{{ unlockedCount }}/{{ gamification.achievements.length }}</span>
        </div>
        
        <div class="achievements-grid">
          <div 
            v-for="achievement in gamification.achievements.slice(0, 6)" 
            :key="achievement.id"
            :class="['achievement-badge', { unlocked: achievement.unlocked }]"
          >
            <div class="badge-icon">{{ achievement.icon }}</div>
            <div class="badge-name">{{ achievement.name }}</div>
            <div class="badge-xp" v-if="achievement.unlocked">+{{ achievement.xpReward }} XP</div>
            <div class="badge-desc" v-else>{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="dashboard-section activity-section">
      <div class="section-header">
        <h3>📅 Activity Feed</h3>
        <div class="activity-filters">
          <button :class="{ active: activityFilter === 'all' }" @click="activityFilter = 'all'">All</button>
          <button :class="{ active: activityFilter === 'xp' }" @click="activityFilter = 'xp'">XP</button>
          <button :class="{ active: activityFilter === 'skill' }" @click="activityFilter = 'skill'">Skills</button>
          <button :class="{ active: activityFilter === 'habit' }" @click="activityFilter = 'habit'">Habits</button>
        </div>
      </div>
      
      <div v-if="filteredActivity.length > 0" class="activity-list">
        <div v-for="activity in filteredActivity" :key="activity.id" class="activity-item">
          <div :class="['activity-icon', activity.type]">{{ activity.icon }}</div>
          <div class="activity-content">
            <p class="activity-title">{{ activity.description }}</p>
            <p class="activity-time">{{ formatTime(activity.timestamp) }}</p>
          </div>
          <div class="activity-xp" v-if="activity.type === 'xp'">
            <span class="xp-badge">+XP</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="empty-icon">📝</span>
        <p>No activity yet. Start completing habits and practicing skills!</p>
      </div>
    </div>

    <!-- Trending Skills Widget -->
    <div class="dashboard-section widgets-grid">
      <div class="widget-card trending">
        <div class="widget-header">
          <h3>📈 Trending Skills</h3>
        </div>
        <div class="trending-list">
          <div v-for="(skill, idx) in topSkills" :key="skill.id" class="trending-item">
            <span class="rank-badge">{{ idx + 1 }}</span>
            <div class="skill-info">
              <p class="skill-name">{{ skill.name }}</p>
              <p class="skill-hours">{{ skill.totalHours }}h • {{ skill.proficiencyLevel }}%</p>
            </div>
            <span class="trending-icon">⬆️</span>
          </div>
          <div v-if="topSkills.length === 0" class="empty-hint">No skills tracked yet</div>
        </div>
      </div>

      <!-- Weekly Challenges Widget -->
      <div class="widget-card challenges">
        <div class="widget-header">
          <h3>🎯 Weekly Challenge</h3>
          <button class="refresh-btn" @click="generateChallenge" title="New challenge">🔄</button>
        </div>
        <div class="challenge-content">
          <p class="challenge-title">{{ currentChallenge.title }}</p>
          <p class="challenge-desc">{{ currentChallenge.description }}</p>
          <div class="challenge-reward">
            <span class="reward-xp">+{{ currentChallenge.xpReward }} XP</span>
          </div>
          <button class="secondary-btn" @click="completeChallenge">✓ Complete</button>
        </div>
      </div>
    </div>

    <!-- Skill Leaderboard Widget -->
    <div class="dashboard-section">
      <div class="widget-header full-width">
        <h3>🏆 Skill Leaderboard</h3>
      </div>
      <div class="leaderboard">
        <div class="leaderboard-header">
          <span class="rank">Rank</span>
          <span class="name">Skill</span>
          <span class="level">Level</span>
          <span class="progress">Progress</span>
        </div>
        <div v-for="(skill, idx) in rankedSkills" :key="skill.id" class="leaderboard-row">
          <span class="rank-num">{{ idx + 1 }}</span>
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-level">{{ getSkillLevel(skill.proficiencyLevel) }}</span>
          <div class="progress-cell">
            <div class="micro-progress" :style="{ width: skill.proficiencyLevel + '%' }"></div>
            <span class="progress-text">{{ skill.proficiencyLevel }}%</span>
          </div>
        </div>
        <div v-if="rankedSkills.length === 0" class="empty-hint">
          No skills to rank. Add your first skill to get started!
        </div>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <div class="dashboard-section">
      <AnalyticsDashboard />
    </div>

    <!-- Habit Heatmap -->
    <div class="dashboard-section">
      <HabitHeatmap />
    </div>

    <!-- Learning Journal Preview -->
    <div class="dashboard-section">
      <div class="widget-header full-width">
        <h3>📚 Learning Journal</h3>
        <p class="section-hint">Track your daily learning progress and insights</p>
      </div>
      <LearningJournal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSkillStore } from '../stores/skill'
import { useGamificationStore } from '../stores/gamification'
import AnalyticsDashboard from '../components/AnalyticsDashboard.vue'
import HabitHeatmap from '../components/HabitHeatmap.vue'
import LearningJournal from '../components/LearningJournal.vue'

const router = useRouter()
const skillStore = useSkillStore()
const gamification = useGamificationStore()
const isDemoMode = ref(false)

const skillCount = ref(0)
const activityFilter = ref('all')
const dailyGoalInput = ref(gamification.goals.dailyXP)
const weeklyGoalInput = ref(gamification.goals.weeklyXP)

const xpRemaining = computed(() => Math.max(0, gamification.xpToNextLevel - gamification.currentLevelXP))

const unlockedCount = computed(() => 
  gamification.achievements.filter(a => a.unlocked).length
)

const nextAchievement = computed(() => gamification.nextAchievement)

const currentValueForRequirement = computed(() => {
  const ach = nextAchievement.value
  if (!ach) return 0
  switch (ach.requirement.type) {
    case 'skills':
      return gamification.stats.skillsCompleted
    case 'habits':
      return gamification.stats.habitsCompleted
    case 'streak':
      return gamification.streak
    case 'hours':
      return gamification.practiceHours
    case 'level':
      return gamification.level
    default:
      return 0
  }
})

const nextAchievementProgress = computed(() => {
  const ach = nextAchievement.value
  if (!ach) return 100
  return Math.min(100, (currentValueForRequirement.value / ach.requirement.value) * 100)
})

const remainingTarget = computed(() => {
  const ach = nextAchievement.value
  if (!ach) return 0
  return Math.max(0, ach.requirement.value - currentValueForRequirement.value)
})

const requirementLabel = computed(() => {
  const ach = nextAchievement.value
  if (!ach) return ''
  switch (ach.requirement.type) {
    case 'skills': return 'skills'
    case 'habits': return 'habits'
    case 'streak': return 'days'
    case 'hours': return 'hours'
    case 'level': return 'levels'
    default: return ''
  }
})

// Sample top skills data
const topSkills = ref([
  { id: 1, name: 'JavaScript', category: 'Programming', proficiency: 75 },
  { id: 2, name: 'UI/UX Design', category: 'Design', proficiency: 60 },
  { id: 3, name: 'Spanish', category: 'Languages', proficiency: 45 },
])

const challenges = [
  { title: 'Quick Learner', description: 'Complete 5 habits today', xpReward: 100, type: 'habits' },
  { title: 'Master Mind', description: 'Practice 3 different skills', xpReward: 150, type: 'skills' },
  { title: 'XP Hunter', description: 'Earn 200 XP this week', xpReward: 200, type: 'xp' },
  { title: 'Streak Keeper', description: 'Maintain your current streak for 3 days', xpReward: 100, type: 'streak' },
  { title: 'Time Investor', description: 'Practice for 5 hours total', xpReward: 250, type: 'hours' },
]

const currentChallenge = ref(challenges[0])

const generateChallenge = () => {
  const random = Math.floor(Math.random() * challenges.length)
  currentChallenge.value = challenges[random]
}

const completeChallenge = () => {
  gamification.addXP(currentChallenge.value.xpReward, `Completed challenge: ${currentChallenge.value.title}`)
  generateChallenge()
}

const rankedSkills = computed(() => {
  return skillStore.skills
    .slice()
    .sort((a, b) => (b.proficiencyLevel || 0) - (a.proficiencyLevel || 0))
})

const getSkillLevel = (proficiency: number): string => {
  const level = Math.floor((proficiency || 0) / 10) + 1
  return `Lv. ${level}`
}

const filteredActivity = computed(() => {
  if (activityFilter.value === 'all') return gamification.activityLog.slice(0, 10)
  return gamification.activityLog
    .filter(a => a.type === activityFilter.value)
    .slice(0, 10)
})

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const saveGoals = () => {
  const daily = Math.max(50, dailyGoalInput.value)
  const weekly = Math.max(200, weeklyGoalInput.value)
  gamification.setGoals(daily, weekly)
}

onMounted(() => {
  skillStore.fetchSkills()
  skillCount.value = skillStore.skills.length || 3
  
  // Check if in demo mode
  isDemoMode.value = localStorage.getItem('upgem_isDemoMode') === 'true'
  
  // Load skills for display
  if (skillStore.skills.length > 0) {
    topSkills.value = skillStore.skills.slice(0, 3).map(s => ({
      id: Number(s.id),
      name: s.name,
      category: s.category,
      proficiency: s.proficiencyLevel
    }))
  }
  
  // Add some sample activity if empty
  if (gamification.activityLog.length === 0) {
    gamification.logActivity('xp', 'Started your UPGEM journey!', '🚀')
  }
})

const exitDemoMode = () => {
  // Clear demo mode flag and data
  localStorage.removeItem('upgem_isDemoMode')
  localStorage.removeItem('skills')
  localStorage.removeItem('upgem_gamification')
  localStorage.removeItem('upgem_learningEntries')
  localStorage.removeItem('upgem_habitTracking')
  localStorage.setItem('upgem_username', 'Champion')
  
  // Navigate to settings to create account
  router.push('/settings')
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Demo Mode Banner */
.demo-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  border-left: 4px solid #ca8a04;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #78350f;
}

.demo-badge {
  font-weight: 700;
  padding: 2px 8px;
  background: #ca8a04;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.demo-text {
  flex: 1;
  font-weight: 500;
}

.demo-exit-btn {
  padding: 6px 12px;
  background: #ca8a04;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: background 0.3s;
}

.demo-exit-btn:hover {
  background: #b8860b;
}

/* Hero Section */
.hero-section {
  background: var(--primary-gradient);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
}

.hero-content {
  flex: 1;
  min-width: 280px;
}

.welcome-text h1 {
  font-size: 28px;
  margin: 0;
  color: white;
}

.hero-subtitle {
  margin: 8px 0 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
}

.level-card {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 20px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.level-badge {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.xp-text {
  color: #fbbf24;
  font-weight: 600;
  font-size: 14px;
}

.level-progress {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.level-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 10px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.level-hint {
  margin: 8px 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: right;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-action-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.quick-action-btn.primary {
  background: white;
  color: #6366f1;
}

.quick-action-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.quick-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Goals */
.goals-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.goal-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.goal-value {
  margin: 4px 0 0 0;
  font-weight: 700;
  color: var(--text-primary);
}

.goal-status {
  padding: 6px 10px;
  border-radius: 12px;
  background: var(--surface-secondary);
  font-size: 12px;
  font-weight: 700;
}

.goal-status.success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.goal-progress {
  height: 10px;
  background: var(--surface-secondary);
  border-radius: 10px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.goal-edit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  align-items: center;
}

.goal-edit label {
  font-size: 12px;
  color: var(--text-secondary);
}

.goal-edit input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--background);
  color: var(--text-primary);
}

.goal-card.edit-goal {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
  border-color: rgba(99, 102, 241, 0.3);
}

/* Insights */
.insights-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.insight-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.insight-card.secondary {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.07), rgba(139, 92, 246, 0.07));
  border-color: rgba(99, 102, 241, 0.25);
}

.insight-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.insight-card h4 {
  margin: 6px 0;
  font-size: 18px;
}

.insight-desc {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
}

.insight-progress {
  height: 10px;
  background: var(--surface-secondary);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 6px;
}

.insight-progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  transition: width 0.4s ease;
}

.insight-hint {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.snapshot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.snapshot-item {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px;
}

.snapshot-title {
  color: var(--text-secondary);
  font-size: 12px;
}

.snapshot-value {
  display: block;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 16px;
}

.btn-icon {
  font-size: 18px;
}

/* Stats Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.skills { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.stat-icon.habits { background: linear-gradient(135deg, #10b981, #34d399); }
.stat-icon.streak { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.stat-icon.xp { background: linear-gradient(135deg, #ec4899, #f472b6); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
  font-weight: 500;
}

.stat-trend {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-trend.positive { color: #10b981; }
.stat-trend.fire { color: #f59e0b; }

/* Dashboard Row */
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}

.dashboard-section {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.dashboard-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.achievement-count {
  background: var(--primary-gradient);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  transform: translateX(4px);
}

/* Skills Progress */
.skills-progress {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 600;
  color: var(--text-primary);
}

.skill-category {
  font-size: 11px;
  color: white;
  background: var(--primary-gradient);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.progress-bar-container {
  height: 10px;
  background: var(--surface-secondary);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 10px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: 40px;
}

.progress-text {
  font-size: 9px;
  color: white;
  font-weight: 700;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 600px) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.achievement-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 12px;
  border: 2px dashed var(--border-color);
  border-radius: 16px;
  background: var(--surface-secondary);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.achievement-badge.unlocked {
  opacity: 1;
  border-style: solid;
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1));
}

.badge-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.badge-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 12px;
  margin-bottom: 4px;
}

.badge-xp {
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.badge-desc {
  font-size: 10px;
  color: var(--text-secondary);
}

/* Activity Section */
.activity-section {
  grid-column: 1 / -1;
}

.activity-filters {
  display: flex;
  gap: 8px;
}

.activity-filters button {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  background: var(--background);
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  font-weight: 500;
}

.activity-filters button.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--background);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.activity-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--surface-secondary);
}

.activity-icon.xp { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.activity-icon.skill { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.activity-icon.habit { background: linear-gradient(135deg, #10b981, #34d399); }
.activity-icon.achievement { background: linear-gradient(135deg, #ec4899, #f472b6); }

.activity-content {
  flex: 1;
}

.activity-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.activity-time {
  margin: 4px 0 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.activity-xp .xp-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

/* Empty State */
.empty-state {
  color: var(--text-secondary);
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

/* Widgets Grid */
.widgets-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.widget-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.widget-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.widget-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.widget-header.full-width {
  grid-column: 1 / -1;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: var(--surface-secondary);
}

/* Trending Skills Widget */
.widget-card.trending .trending-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--surface-secondary);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.trending-item:hover {
  transform: translateX(4px);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.skill-info {
  flex: 1;
}

.skill-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.skill-hours {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.trending-icon {
  font-size: 14px;
}

/* Challenges Widget */
.widget-card.challenges {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border-color: var(--primary-color);
}

.challenge-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.challenge-desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.challenge-reward {
  padding: 12px;
  background: var(--surface-secondary);
  border-radius: 10px;
  text-align: center;
}

.reward-xp {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
}

/* Leaderboard Widget */
.dashboard-section .widget-header.full-width {
  margin-bottom: 20px;
  padding: 0;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 40px 1fr 80px 120px;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface-secondary);
  border-radius: 12px 12px 0 0;
  font-weight: 700;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 40px 1fr 80px 120px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.leaderboard-row:hover {
  background: var(--surface-secondary);
}

.rank-num {
  font-weight: 700;
  color: var(--primary-color);
}

.skill-name {
  color: var(--text-primary);
  font-weight: 500;
}

.skill-level {
  font-size: 13px;
  color: var(--text-secondary);
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.micro-progress {
  flex: 1;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.micro-progress::after {
  content: '';
  display: block;
  height: 100%;
  background: var(--primary-gradient);
  width: 100%;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 35px;
  text-align: right;
}

.empty-hint {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
  font-size: 13px;
}
</style>
