// Utilidades para manejo consistente de fechas

// Asegurar que la entrada sea string
const ensureString = (input) => {
  if (!input) return ''
  if (typeof input === 'string') return input
  if (input instanceof Date) return dateToString(input)
  if (typeof input === 'object' && input !== null) {
    if (input.date) return String(input.date)
    return String(input)
  }
  return String(input)
}

// Formatear fecha para mostrar
export const formatDisplayDate = (dateInput) => {
  const dateStr = ensureString(dateInput)
  if (!dateStr) return ''
  
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return date.toLocaleDateString('es-CL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Formatear fecha corta para mostrar
export const formatShortDate = (dateInput) => {
  const dateStr = ensureString(dateInput)
  if (!dateStr) return ''
  
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return date.toLocaleDateString('es-CL', { 
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

// Obtener fecha actual
export const getCurrentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Convertir Date a string
export const dateToString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Obtener día anterior
export const getPreviousDay = (dateInput) => {
  const dateStr = ensureString(dateInput)
  if (!dateStr) return getCurrentDate()
  
  const parts = dateStr.split('-')
  if (parts.length !== 3) return getCurrentDate()
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  date.setDate(date.getDate() - 1)
  return dateToString(date)
}

// Obtener día siguiente
export const getNextDay = (dateInput) => {
  const dateStr = ensureString(dateInput)
  if (!dateStr) return getCurrentDate()
  
  const parts = dateStr.split('-')
  if (parts.length !== 3) return getCurrentDate()
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  date.setDate(date.getDate() + 1)
  return dateToString(date)
}

// Obtener primer día del mes
export const getFirstDayOfMonth = (year, month) => {
  return `${year}-${String(month).padStart(2, '0')}-01`
}

// Obtener último día del mes
export const getLastDayOfMonth = (year, month) => {
  const lastDay = new Date(year, month, 0).getDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

// Obtener nombre del mes
export const getMonthName = (year, month) => {
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('es-CL', { month: 'long' })
}

// Validar fecha
export const isValidDate = (dateInput) => {
  const dateStr = ensureString(dateInput)
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  
  const parts = dateStr.split('-')
  if (parts.length !== 3) return false
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return date.getFullYear() === parseInt(year) &&
         date.getMonth() === parseInt(month) - 1 &&
         date.getDate() === parseInt(day)
}