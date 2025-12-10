import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CustomizationSettings {
  accentColor: string
  backgroundImage?: string
  backgroundOpacity: number
  backgroundGamma: number
  backgroundBlur: number
}

export const useCustomizationStore = defineStore('customization', () => {
  const settings = ref<CustomizationSettings>({
    accentColor: '#d946ef',
    backgroundOpacity: 1,
    backgroundGamma: 1,
    backgroundBlur: 0,
  })

  const setAccentColor = (color: string) => {
    settings.value.accentColor = color
    applyAccentColor(color)
    saveSettings()
  }

  const setBackgroundImage = (imageUrl: string | undefined) => {
    settings.value.backgroundImage = imageUrl
    applyBackgroundImage()
    saveSettings()
  }

  const setBackgroundOpacity = (opacity: number) => {
    settings.value.backgroundOpacity = Math.max(0, Math.min(1, opacity))
    applyBackgroundImage()
    saveSettings()
  }

  const setBackgroundGamma = (gamma: number) => {
    settings.value.backgroundGamma = Math.max(0.5, Math.min(2, gamma))
    applyBackgroundImage()
    saveSettings()
  }

  const setBackgroundBlur = (blur: number) => {
    settings.value.backgroundBlur = Math.max(0, Math.min(20, blur))
    applyBackgroundImage()
    saveSettings()
  }

  const applyAccentColor = (color: string) => {
    const root = document.documentElement
    // Create multiple accent shades
    root.style.setProperty('--accent-color', color)
    root.style.setProperty('--accent-light', color + '33') // 20% opacity
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${color}, ${color}cc)`)
  }

  const applyBackgroundImage = () => {
    const root = document.documentElement
    const bgUrl = settings.value.backgroundImage
    
    if (!bgUrl) {
      root.style.setProperty('--bg-image', 'none')
      root.style.setProperty('--bg-opacity', '1')
      root.style.setProperty('--bg-filter', 'none')
      return
    }

    root.style.setProperty('--bg-image', `url('${bgUrl}')`)
    root.style.setProperty('--bg-opacity', settings.value.backgroundOpacity.toString())
    
    // Build CSS filter string
    const gamma = settings.value.backgroundGamma
    const blur = settings.value.backgroundBlur
    const filter = `blur(${blur}px) brightness(${gamma > 1 ? gamma : 1})`
    
    root.style.setProperty('--bg-filter', filter)
  }

  const saveSettings = () => {
    localStorage.setItem('upgem_customization', JSON.stringify(settings.value))
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('upgem_customization')
    if (saved) {
      try {
        const loaded = JSON.parse(saved)
        settings.value = { ...settings.value, ...loaded }
        applyAccentColor(settings.value.accentColor)
        applyBackgroundImage()
      } catch (e) {
        console.error('Failed to load customization settings:', e)
      }
    } else {
      applyAccentColor(settings.value.accentColor)
    }
  }

  // Initialize on load
  loadSettings()

  return {
    settings,
    setAccentColor,
    setBackgroundImage,
    setBackgroundOpacity,
    setBackgroundGamma,
    setBackgroundBlur,
    saveSettings,
    loadSettings,
  }
})
