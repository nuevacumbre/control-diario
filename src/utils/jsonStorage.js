// Sistema de almacenamiento JSON local editable
const STORAGE_KEY = 'control-diario-data'

// Estructura inicial de datos
const initialData = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  days: {}
}

// Cargar todos los datos
export const loadAllData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      // Inicializar con datos de ejemplo
      const exampleData = {
        ...initialData,
        days: generateExampleData()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exampleData, null, 2))
      return exampleData
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading data:', error)
    return initialData
  }
}

// Generar datos de ejemplo
const generateExampleData = () => {
  const days = {}
  const today = new Date()
  
  // Generar datos para los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Solo algunos días tienen datos (simulando días trabajados)
    if (Math.random() > 0.3) {
      days[dateStr] = {
        amount: Math.floor(Math.random() * 150000) + 50000,
        colacion: Math.random() > 0.5,
        viatico: Math.random() > 0.7 ? 10000 : 0,
        percentage: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }
  
  return days
}

// Guardar todos los datos
export const saveAllData = (data) => {
  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error saving data:', error)
    return false
  }
}

// Cargar datos de un día específico
export const loadDayData = (date) => {
  const allData = loadAllData()
  return allData.days[date] || null
}

// Guardar datos de un día específico
export const saveDayData = (date, dayData) => {
  const allData = loadAllData()
  allData.days[date] = {
    ...dayData,
    updatedAt: new Date().toISOString()
  }
  return saveAllData(allData)
}

// Exportar datos a archivo JSON
export const exportToJson = () => {
  const data = loadAllData()
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `control-diario-backup-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

// Importar datos desde archivo JSON
export const importFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.version && data.days) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2))
          resolve(data)
        } else {
          reject(new Error('Formato de archivo inválido'))
        }
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsText(file)
  })
}

// Obtener todos los meses disponibles
export const getAvailableMonths = () => {
  const allData = loadAllData()
  const months = new Set()
  
  Object.keys(allData.days).forEach(date => {
    const [year, month] = date.split('-')
    months.add(`${year}-${month}`)
  })
  
  return Array.from(months).sort().reverse()
}

// Obtener datos de un mes específico
export const getMonthData = (year, month) => {
  const allData = loadAllData()
  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const days = []
  let total = 0
  let colaciones = 0
  let viaticos = 0
  let colacionesCount = 0
  
  Object.entries(allData.days).forEach(([date, data]) => {
    if (date.startsWith(monthStr)) {
      days.push(date)
      total += data.amount || 0
      if (data.colacion) {
        colaciones += 5000
        colacionesCount++
      }
      if (data.viatico) {
        viaticos += data.viatico
      }
    }
  })
  
  days.sort((a, b) => a.localeCompare(b))
  
  return {
    days,
    total,
    colaciones,
    viaticos,
    colacionesCount,
    ganancia: total * 0.3,
    daysCount: days.length,
    daysInMonth: new Date(year, month, 0).getDate()
  }
}