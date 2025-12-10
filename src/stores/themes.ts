import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ThemeConfig {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  surfaceSecondary: string
  textPrimary: string
  textSecondary: string
  borderColor: string
  success: string
  danger: string
  warning: string
  gradient: string
}

const themes: Record<string, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    primary: '#6366f1',
    secondary: '#64748b',
    accent: '#d946ef',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceSecondary: '#f1f5f9',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    borderColor: '#e2e8f0',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)'
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    primary: '#818cf8',
    secondary: '#94a3b8',
    accent: '#f472b6',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    borderColor: '#334155',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
    gradient: 'linear-gradient(135deg, #818cf8, #a78bfa, #f472b6)'
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    primary: '#00ff88',
    secondary: '#ff006e',
    accent: '#00d9ff',
    background: '#0a0e27',
    surface: '#1a1f3a',
    surfaceSecondary: '#2a2f4a',
    textPrimary: '#ffffff',
    textSecondary: '#a0aec0',
    borderColor: '#00ff88',
    success: '#00ff88',
    danger: '#ff006e',
    warning: '#ffbe0b',
    gradient: 'linear-gradient(135deg, #00ff88, #00d9ff, #ff006e)'
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    primary: '#059669',
    secondary: '#047857',
    accent: '#8b5cf6',
    background: '#0f172a',
    surface: '#1b4a38',
    surfaceSecondary: '#265447',
    textPrimary: '#f0fdf4',
    textSecondary: '#d1fae5',
    borderColor: '#10b981',
    success: '#6ee7b7',
    danger: '#fca5a5',
    warning: '#fde047',
    gradient: 'linear-gradient(135deg, #059669, #10b981, #6ee7b7)'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    primary: '#bd00ff',
    secondary: '#00e5ff',
    accent: '#ff00ff',
    background: '#0d001a',
    surface: '#1a0033',
    surfaceSecondary: '#330066',
    textPrimary: '#ff00ff',
    textSecondary: '#00e5ff',
    borderColor: '#bd00ff',
    success: '#00ff00',
    danger: '#ff0055',
    warning: '#ffaa00',
    gradient: 'linear-gradient(135deg, #bd00ff, #ff00ff, #00e5ff)'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#dc2626',
    accent: '#ec4899',
    background: '#fef2f2',
    surface: '#fff7ed',
    surfaceSecondary: '#fed7aa',
    textPrimary: '#7c2d12',
    textSecondary: '#9a3412',
    borderColor: '#fb923c',
    success: '#ea580c',
    danger: '#dc2626',
    warning: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f97316, #ec4899, #dc2626)'
  }
}

export const useThemesStore = defineStore('themes', () => {
  const currentTheme = ref<ThemeConfig>(themes.classic)
  const customColor = ref('')

  const setTheme = (themeId: string) => {
    if (themes[themeId]) {
      currentTheme.value = themes[themeId]
      localStorage.setItem('upgem_theme_id', themeId)
      applyTheme()
    }
  }

  const applyTheme = () => {
    const theme = currentTheme.value
    const root = document.documentElement

    Object.entries({
      '--primary-color': theme.primary,
      '--secondary-color': theme.secondary,
      '--accent-color': theme.accent,
      '--background': theme.background,
      '--surface': theme.surface,
      '--surface-secondary': theme.surfaceSecondary,
      '--text-primary': theme.textPrimary,
      '--text-secondary': theme.textSecondary,
      '--border-color': theme.borderColor,
      '--success-color': theme.success,
      '--danger-color': theme.danger,
      '--warning-color': theme.warning,
      '--primary-gradient': theme.gradient,
    }).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  const getAvailableThemes = () => Object.values(themes)

  const loadTheme = () => {
    const saved = localStorage.getItem('upgem_theme_id')
    if (saved && themes[saved]) {
      setTheme(saved)
    } else {
      setTheme('classic')
    }
  }

  loadTheme()

  return {
    currentTheme,
    customColor,
    setTheme,
    applyTheme,
    getAvailableThemes,
    themes: () => Object.values(themes)
  }
})
