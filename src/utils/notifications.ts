// Notification utility for browser notifications
export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
}

class NotificationService {
  private permission: NotificationPermission = 'default'

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission === 'granted'
  }

  async show(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) {
        console.warn('Notification permission denied')
        return
      }
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }

  // Schedule a reminder notification
  scheduleReminder(title: string, body: string, delayMs: number): void {
    setTimeout(() => {
      this.show({ title, body })
    }, delayMs)
  }

  // Daily habit reminder
  scheduleDailyReminder(habitName: string, hour: number = 9): void {
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setHours(hour, 0, 0, 0)

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    const delay = scheduledTime.getTime() - now.getTime()

    this.scheduleReminder(
      '🎯 Habit Reminder',
      `Time to complete: ${habitName}`,
      delay
    )
  }

  // Milestone reminder
  notifyMilestone(skillName: string, milestone: string): void {
    this.show({
      title: '🏆 Milestone Achieved!',
      body: `Congratulations! You've reached ${milestone} in ${skillName}`,
      requireInteraction: true,
    })
  }

  // Streak notification
  notifyStreak(days: number): void {
    const messages = [
      { days: 7, emoji: '🔥', message: 'One week streak!' },
      { days: 30, emoji: '💪', message: 'One month streak - Amazing!' },
      { days: 100, emoji: '🌟', message: '100 days! You\'re unstoppable!' },
      { days: 365, emoji: '👑', message: 'One year streak - Legendary!' },
    ]

    const match = messages.find(m => m.days === days)
    if (match) {
      this.show({
        title: `${match.emoji} ${days} Day Streak!`,
        body: match.message,
        requireInteraction: true,
      })
    }
  }

  // Practice reminder
  notifyPracticeTime(skillName: string): void {
    this.show({
      title: '⏰ Practice Time!',
      body: `Time to practice ${skillName}`,
    })
  }
}

export const notificationService = new NotificationService()

// Export convenience functions
export const requestNotificationPermission = () => notificationService.requestPermission()
export const showNotification = (options: NotificationOptions) => notificationService.show(options)
export const scheduleReminder = (title: string, body: string, delayMs: number) => 
  notificationService.scheduleReminder(title, body, delayMs)
export const scheduleDailyReminder = (habitName: string, hour?: number) =>
  notificationService.scheduleDailyReminder(habitName, hour)
export const notifyMilestone = (skillName: string, milestone: string) =>
  notificationService.notifyMilestone(skillName, milestone)
export const notifyStreak = (days: number) => notificationService.notifyStreak(days)
export const notifyPracticeTime = (skillName: string) => notificationService.notifyPracticeTime(skillName)
