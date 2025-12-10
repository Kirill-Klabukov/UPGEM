import { defineStore } from 'pinia'
import { ref } from 'vue'

type SkillCategory = 
  | 'Programming' 
  | 'Design' 
  | 'Languages' 
  | 'Music' 
  | 'Fitness' 
  | 'Business' 
  | 'Art' 
  | 'Science' 
  | 'Writing' 
  | 'Speaking' 
  | 'Leadership' 
  | 'Negotiation' 
  | 'Cooking' 
  | 'Sports' 
  | 'Health'
  | 'Other'

interface Skill {
  id: string
  name: string
  category: SkillCategory
  proficiencyLevel: number
  totalHours: number
  description?: string
  imageUrl?: string // Base64 encoded image or URL
  customIcon?: string // Emoji icon
  createdAt?: string
  updatedAt?: string
}

export const useSkillStore = defineStore('skill', () => {
  const skills = ref<Skill[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchSkills = async () => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Call backend API
      skills.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch skills'
    } finally {
      isLoading.value = false
    }
  }

  const createSkill = async (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Call backend API
      const now = new Date().toISOString()
      const newSkill: Skill = {
        id: Date.now().toString(),
        ...skill,
        createdAt: now,
        updatedAt: now,
      }
      skills.value.push(newSkill)
      return newSkill
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create skill'
      throw err
    }
  }

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      // TODO: Call backend API
      const index = skills.value.findIndex(s => s.id === id)
      if (index !== -1) {
        skills.value[index] = { 
          ...skills.value[index], 
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update skill'
      throw err
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      // TODO: Call backend API
      skills.value = skills.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete skill'
      throw err
    }
  }

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  }
})
