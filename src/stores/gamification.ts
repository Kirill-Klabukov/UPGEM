import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  unlockedAt?: string
  requirement: {
    type: 'skills' | 'habits' | 'streak' | 'hours' | 'level'
    value: number
  }
}

interface UserStats {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  totalHours: number
  skillsCompleted: number
  habitsCompleted: number
  dailyGoalsMet: number
}

type ActivityType = 'xp' | 'skill' | 'habit' | 'achievement' | 'streak'

interface ActivityLogEntry {
  id: string
  type: ActivityType
  description: string
  icon: string
  value?: number
  timestamp: string
}

interface LearningEntry {
  id: string
  skillId: string
  date: string
  lesson: string
  mood: 'poor' | 'okay' | 'good' | 'excellent'
  energyBefore: number
  energyAfter: number
  focusLevel: 'low' | 'medium' | 'high'
  sessionDetails: string
  tags: string[]
}

interface HabitTracking {
  date: string
  skillId: string
  completed: boolean
  hours?: number
  energy?: number
}

export const useGamificationStore = defineStore('gamification', () => {
  const stats = ref<UserStats>({
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalHours: 0,
    skillsCompleted: 0,
    habitsCompleted: 0,
    dailyGoalsMet: 0,
  })

  const activityLog = ref<ActivityLogEntry[]>([])

  const goals = ref({
    dailyXP: 150,
    weeklyXP: 750,
  })

  // Learning Journal entries
  const learningEntries = ref<LearningEntry[]>([])

  // Habit tracking heatmap data
  const habitTracking = ref<HabitTracking[]>([])

  const achievements = ref<Achievement[]>([
    // Skill Milestones
    { id: 'first-skill', name: 'First Steps', description: 'Add your first skill', icon: '🎯', xpReward: 50, requirement: { type: 'skills', value: 1 } },
    { id: 'skill-collector', name: 'Skill Collector', description: 'Track 5 skills', icon: '📚', xpReward: 100, requirement: { type: 'skills', value: 5 } },
    { id: 'skill-master', name: 'Skill Master', description: 'Track 10 skills', icon: '🏆', xpReward: 250, requirement: { type: 'skills', value: 10 } },
    { id: 'skill-polymath', name: 'Polymath', description: 'Track 15 skills', icon: '🧠', xpReward: 500, requirement: { type: 'skills', value: 15 } },
    { id: 'skill-legend', name: 'Skill Legend', description: 'Track 20 skills', icon: '👑', xpReward: 1000, requirement: { type: 'skills', value: 20 } },
    // Habit Milestones
    { id: 'habit-starter', name: 'Habit Starter', description: 'Complete your first habit', icon: '✅', xpReward: 50, requirement: { type: 'habits', value: 1 } },
    { id: 'habit-builder', name: 'Habit Builder', description: 'Complete 50 habits', icon: '💪', xpReward: 200, requirement: { type: 'habits', value: 50 } },
    { id: 'habit-warrior', name: 'Habit Warrior', description: 'Complete 200 habits', icon: '⚔️', xpReward: 500, requirement: { type: 'habits', value: 200 } },
    { id: 'habit-legend', name: 'Habit Legend', description: 'Complete 500 habits', icon: '🏅', xpReward: 1500, requirement: { type: 'habits', value: 500 } },
    // Streak Milestones
    { id: 'week-warrior', name: 'Week Warrior', description: '7 day streak', icon: '🔥', xpReward: 150, requirement: { type: 'streak', value: 7 } },
    { id: 'month-master', name: 'Month Master', description: '30 day streak', icon: '⚡', xpReward: 500, requirement: { type: 'streak', value: 30 } },
    { id: 'perfect-quarter', name: 'Perfect Quarter', description: '90 day streak', icon: '💫', xpReward: 750, requirement: { type: 'streak', value: 90 } },
    { id: 'century-club', name: 'Century Club', description: '100 day streak', icon: '👑', xpReward: 1000, requirement: { type: 'streak', value: 100 } },
    { id: 'year-round', name: 'Year Round', description: '365 day streak', icon: '🌍', xpReward: 5000, requirement: { type: 'streak', value: 365 } },
    // Time Investment Milestones
    { id: 'time-investor', name: 'Time Investor', description: 'Practice for 10 hours', icon: '⏰', xpReward: 100, requirement: { type: 'hours', value: 10 } },
    { id: 'dedicated', name: 'Dedicated', description: 'Practice for 100 hours', icon: '🌟', xpReward: 500, requirement: { type: 'hours', value: 100 } },
    { id: 'thousand-hour', name: 'Thousand Hour Club', description: 'Practice for 1000 hours', icon: '🎖️', xpReward: 2000, requirement: { type: 'hours', value: 1000 } },
    { id: 'lifelong-learner', name: 'Lifelong Learner', description: 'Practice for 5000 hours', icon: '📖', xpReward: 5000, requirement: { type: 'hours', value: 5000 } },
    // Level Milestones
    { id: 'level-5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', xpReward: 100, requirement: { type: 'level', value: 5 } },
    { id: 'level-10', name: 'Pro Player', description: 'Reach level 10', icon: '💎', xpReward: 300, requirement: { type: 'level', value: 10 } },
    { id: 'level-20', name: 'Master', description: 'Reach level 20', icon: '🏆', xpReward: 1000, requirement: { type: 'level', value: 20 } },
    { id: 'level-30', name: 'Grandmaster', description: 'Reach level 30', icon: '👑', xpReward: 2000, requirement: { type: 'level', value: 30 } },
    { id: 'level-50', name: 'Legend', description: 'Reach level 50', icon: '✨', xpReward: 5000, requirement: { type: 'level', value: 50 } },
    // Special Achievements
    { id: 'speedrunner', name: 'Speedrunner', description: 'Reach level 5 in under 1 week', icon: '🚀', xpReward: 300, requirement: { type: 'level', value: 5 } },
    { id: 'night-owl', name: 'Night Owl', description: 'Log a habit at midnight', icon: '🌙', xpReward: 50, requirement: { type: 'habits', value: 1 } },
  ])

  const unlockedAchievements = ref<string[]>([])

  // XP required for each level (increases progressively)
  const xpForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  }

  const level = computed(() => stats.value.level)
  const xp = computed(() => stats.value.totalXP)
  const streak = computed(() => stats.value.currentStreak)
  const practiceHours = computed(() => stats.value.totalHours)

  const currentLevelXP = computed(() => {
    let totalRequired = 0
    for (let i = 1; i < stats.value.level; i++) {
      totalRequired += xpForLevel(i)
    }
    return stats.value.totalXP - totalRequired
  })

  const xpToNextLevel = computed(() => xpForLevel(stats.value.level))

  const levelProgress = computed(() => {
    return Math.min(100, (currentLevelXP.value / xpToNextLevel.value) * 100)
  })

  const addXP = (amount: number, reason?: string) => {
    stats.value.totalXP += amount
    logActivity('xp', reason || `Earned ${amount} XP`, '⚡', amount)
    
    // Check for level up
    while (currentLevelXP.value >= xpToNextLevel.value) {
      stats.value.level++
      checkAchievements()
    }
    
    saveStats()
    return { xp: amount, reason, newLevel: stats.value.level }
  }

  const completeHabit = () => {
    stats.value.habitsCompleted++
    addXP(10, 'Completed habit')
    logActivity('habit', 'Completed habit', '✅', 10)
    checkAchievements()
  }

  const logPractice = (hours: number) => {
    stats.value.totalHours += hours
    const reward = Math.floor(hours * 20)
    addXP(reward, `Practiced for ${hours} hours`)
    logActivity('skill', `Logged ${hours}h practice`, '⏱️', reward)
    checkAchievements()
  }

  const updateStreak = (days: number) => {
    stats.value.currentStreak = days
    if (days > stats.value.longestStreak) {
      stats.value.longestStreak = days
    }
    checkAchievements()
    saveStats()
  }

  const checkAchievements = () => {
    achievements.value.forEach(achievement => {
      if (unlockedAchievements.value.includes(achievement.id)) return

      let unlocked = false
      switch (achievement.requirement.type) {
        case 'skills':
          unlocked = stats.value.skillsCompleted >= achievement.requirement.value
          break
        case 'habits':
          unlocked = stats.value.habitsCompleted >= achievement.requirement.value
          break
        case 'streak':
          unlocked = stats.value.currentStreak >= achievement.requirement.value
          break
        case 'hours':
          unlocked = stats.value.totalHours >= achievement.requirement.value
          break
        case 'level':
          unlocked = stats.value.level >= achievement.requirement.value
          break
      }

      if (unlocked) {
        unlockedAchievements.value.push(achievement.id)
        addXP(achievement.xpReward, `Achievement: ${achievement.name}`)
        logActivity('achievement', `Unlocked ${achievement.name}`, achievement.icon, achievement.xpReward)
      }
    })
    saveStats()
  }

  const logActivity = (type: ActivityType, description: string, icon: string, value?: number) => {
    const entry: ActivityLogEntry = {
      id: crypto.randomUUID(),
      type,
      description,
      icon,
      value,
      timestamp: new Date().toISOString(),
    }
    activityLog.value.unshift(entry)
    activityLog.value = activityLog.value.slice(0, 200)
    saveActivity()
  }

  const xpToday = computed(() => {
    const today = new Date().toDateString()
    return activityLog.value
      .filter(a => a.type === 'xp' && new Date(a.timestamp).toDateString() === today)
      .reduce((sum, a) => sum + (a.value || 0), 0)
  })

  const xpThisWeek = computed(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return activityLog.value
      .filter(a => a.type === 'xp' && new Date(a.timestamp) >= start)
      .reduce((sum, a) => sum + (a.value || 0), 0)
  })

  const dailyProgress = computed(() => Math.min(100, (xpToday.value / goals.value.dailyXP) * 100))
  const weeklyProgress = computed(() => Math.min(100, (xpThisWeek.value / goals.value.weeklyXP) * 100))

  const setGoals = (dailyXP: number, weeklyXP: number) => {
    goals.value.dailyXP = dailyXP
    goals.value.weeklyXP = weeklyXP
    saveGoals()
  }

  const saveStats = () => {
    localStorage.setItem('upgem_stats', JSON.stringify(stats.value))
    localStorage.setItem('upgem_achievements', JSON.stringify(unlockedAchievements.value))
  }

  const saveActivity = () => {
    localStorage.setItem('upgem_activity', JSON.stringify(activityLog.value))
  }

  const saveGoals = () => {
    localStorage.setItem('upgem_goals', JSON.stringify(goals.value))
  }

  const loadStats = () => {
    const savedStats = localStorage.getItem('upgem_stats')
    const savedAchievements = localStorage.getItem('upgem_achievements')
    const savedActivity = localStorage.getItem('upgem_activity')
    const savedGoals = localStorage.getItem('upgem_goals')
    
    if (savedStats) {
      stats.value = JSON.parse(savedStats)
    }
    if (savedAchievements) {
      unlockedAchievements.value = JSON.parse(savedAchievements)
    }
    if (savedActivity) {
      activityLog.value = JSON.parse(savedActivity)
    }
    if (savedGoals) {
      goals.value = JSON.parse(savedGoals)
    }
  }

  // Learning Journal methods
  const addLearningEntry = (entry: Omit<LearningEntry, 'id'>) => {
    const newEntry: LearningEntry = {
      id: crypto.randomUUID(),
      ...entry,
    }
    learningEntries.value.unshift(newEntry)
    saveLearningEntries()
    return newEntry
  }

  const getLearningEntriesBySkill = (skillId: string) => {
    return learningEntries.value.filter(e => e.skillId === skillId)
  }

  const deleteLearningEntry = (id: string) => {
    learningEntries.value = learningEntries.value.filter(e => e.id !== id)
    saveLearningEntries()
  }

  const searchLearningEntries = (query: string) => {
    const q = query.toLowerCase()
    return learningEntries.value.filter(e => 
      e.lesson.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // Analytics computed properties
  const velocity = computed(() => {
    // Calculate skill improvement rate per week
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    
    const recentEntries = learningEntries.value.filter(
      e => new Date(e.date) >= twoWeeksAgo
    )
    
    return recentEntries.length > 0 ? (recentEntries.length / 2).toFixed(1) : '0'
  })

  const consistencyScore = computed(() => {
    if (learningEntries.value.length === 0) return 0
    
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    
    const totalDays = 30
    const activeDays = new Set(
      learningEntries.value
        .filter(e => new Date(e.date) >= last30Days)
        .map(e => e.date)
    ).size
    
    return Math.round((activeDays / totalDays) * 100)
  })

  const focusIndex = computed(() => {
    if (stats.value.skillsCompleted === 0) return 0
    const primarySkill = learningEntries.value
      .reduce((acc, e) => {
        acc[e.skillId] = (acc[e.skillId] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const maxSkillEntries = Math.max(...Object.values(primarySkill), 0)
    const totalEntries = learningEntries.value.length || 1
    
    return Math.round((maxSkillEntries / totalEntries) * 100)
  })

  // Heatmap data for habit tracking
  const getHabitHeatmapData = (skillId: string, days: number = 365) => {
    const data: Record<string, number> = {}
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const count = habitTracking.value.filter(
        h => h.skillId === skillId && h.date === dateStr && h.completed
      ).length
      
      data[dateStr] = count
    }
    
    return data
  }

  const recordHabitCompletion = (skillId: string, date: string = new Date().toISOString().split('T')[0]) => {
    const existing = habitTracking.value.find(h => h.skillId === skillId && h.date === date)
    if (existing) {
      existing.completed = true
    } else {
      habitTracking.value.push({ skillId, date, completed: true })
    }
    saveHabitTracking()
  }

  // Save/Load methods
  const saveLearningEntries = () => {
    localStorage.setItem('upgem_learning', JSON.stringify(learningEntries.value))
  }

  const saveHabitTracking = () => {
    localStorage.setItem('upgem_habits_tracking', JSON.stringify(habitTracking.value))
  }

  const loadLearningData = () => {
    const saved = localStorage.getItem('upgem_learning')
    const savedHabits = localStorage.getItem('upgem_habits_tracking')
    
    if (saved) {
      learningEntries.value = JSON.parse(saved)
    }
    if (savedHabits) {
      habitTracking.value = JSON.parse(savedHabits)
    }
  }

  // Call load on init
  loadLearningData()

  const achievementsWithStatus = computed(() =>
    achievements.value.map(a => ({ ...a, unlocked: unlockedAchievements.value.includes(a.id) }))
  )

  const nextAchievement = computed(() =>
    achievementsWithStatus.value.find(a => !a.unlocked)
  )

  return {
    stats,
    achievements: achievementsWithStatus,
    unlockedAchievements,
    nextAchievement,
    activityLog,
    goals,
    learningEntries,
    habitTracking,
    velocity,
    consistencyScore,
    focusIndex,
    xpToday,
    xpThisWeek,
    dailyProgress,
    weeklyProgress,
    level,
    xp,
    streak,
    practiceHours,
    currentLevelXP,
    xpToNextLevel,
    levelProgress,
    setGoals,
    addXP,
    completeHabit,
    logPractice,
    updateStreak,
    checkAchievements,
    loadStats,
    logActivity,
    addLearningEntry,
    getLearningEntriesBySkill,
    deleteLearningEntry,
    searchLearningEntries,
    getHabitHeatmapData,
    recordHabitCompletion,
  }
})
