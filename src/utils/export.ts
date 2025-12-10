// Export/Import utilities for data backup and restoration

interface SkillEdData {
  skills: any[]
  habits: any[]
  settings: Record<string, any>
  version: string
  exported: string
}

export const exportToJSON = (): void => {
  const data: SkillEdData = {
    skills: JSON.parse(localStorage.getItem('skills') || '[]'),
    habits: JSON.parse(localStorage.getItem('habits') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || '{}'),
    version: '1.0.0',
    exported: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skilled-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToCSV = (type: 'skills' | 'habits'): void => {
  const data = JSON.parse(localStorage.getItem(type) || '[]')
  
  if (data.length === 0) {
    alert(`No ${type} to export`)
    return
  }

  // Get all unique keys
  const keys = Array.from(new Set(data.flatMap((item: any) => Object.keys(item)))) as string[]
  
  // Create CSV header
  const csv = [
    keys.join(','),
    ...data.map((item: any) => 
      keys.map((key: string) => {
        const value = item[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""')
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skilled-${type}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const importFromJSON = (file: File): Promise<SkillEdData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        // Validate data structure
        if (!data.skills || !data.habits) {
          reject(new Error('Invalid backup file format'))
          return
        }
        
        resolve(data)
      } catch (error) {
        reject(new Error('Failed to parse backup file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const restoreFromBackup = async (file: File): Promise<void> => {
  try {
    const data = await importFromJSON(file)
    
    // Confirm with user
    const confirmed = confirm(
      `This will restore ${data.skills.length} skills and ${data.habits.length} habits. ` +
      `Existing data will be merged. Continue?`
    )
    
    if (!confirmed) return
    
    // Merge with existing data
    const existingSkills = JSON.parse(localStorage.getItem('skills') || '[]')
    const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]')
    
    const mergedSkills = [...existingSkills, ...data.skills]
    const mergedHabits = [...existingHabits, ...data.habits]
    
    // Remove duplicates by ID
    const uniqueSkills = Array.from(
      new Map(mergedSkills.map(item => [item.id, item])).values()
    )
    const uniqueHabits = Array.from(
      new Map(mergedHabits.map(item => [item.id, item])).values()
    )
    
    // Save to localStorage
    localStorage.setItem('skills', JSON.stringify(uniqueSkills))
    localStorage.setItem('habits', JSON.stringify(uniqueHabits))
    
    alert('Data restored successfully! Refreshing page...')
    window.location.reload()
  } catch (error) {
    alert(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const clearAllData = (): void => {
  const confirmed = confirm(
    'Are you sure you want to delete ALL data? This cannot be undone!\n\n' +
    'Consider exporting a backup first.'
  )
  
  if (!confirmed) return
  
  const doubleConfirm = prompt('Type "DELETE" to confirm:')
  
  if (doubleConfirm === 'DELETE') {
    localStorage.removeItem('skills')
    localStorage.removeItem('habits')
    localStorage.removeItem('settings')
    alert('All data deleted. Refreshing page...')
    window.location.reload()
  }
}
