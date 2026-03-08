import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  loadDayData, 
  saveDayData, 
  loadAllData, 
  getAvailableMonths, 
  getMonthData 
} from '../utils/jsonStorage'
import { getCurrentDate, isValidDate } from '../utils/dateUtils'

export const useIncomeStore = defineStore('income', () => {
  const selectedDate = ref(getCurrentDate())
  const currentDayData = ref({ amount: 0, colacion: false, viatico: 0, percentage: 30 })

  // Cargar datos del día
  const loadDay = (date) => {
    if (!isValidDate(date)) {
      date = getCurrentDate()
    }
    const data = loadDayData(date)
    currentDayData.value = data || { amount: 0, colacion: false, viatico: 0, percentage: 30 }
    return currentDayData.value
  }

  // Guardar datos del día
  const saveDay = (date, data) => {
    if (!isValidDate(date)) {
      date = getCurrentDate()
    }
    const success = saveDayData(date, {
      amount: Number(data.amount) || 0,
      colacion: data.colacion || false,
      viatico: Number(data.viatico) || 0,
      percentage: data.percentage || 30
    })
    if (success) {
      currentDayData.value = { ...data }
    }
    return success
  }

  // Cambiar fecha
  const setSelectedDate = (date) => {
    if (isValidDate(date)) {
      selectedDate.value = date
      loadDay(date)
    } else {
      console.warn('Fecha inválida:', date)
      selectedDate.value = getCurrentDate()
      loadDay(selectedDate.value)
    }
  }

  // Obtener meses disponibles
  const availableMonths = computed(() => {
    return getAvailableMonths()
  })

  // Obtener datos de un mes
  const getMonthData_ = (year, month) => {
    return getMonthData(year, month)
  }

  // Obtener todos los datos
  const getAllData = () => {
    return loadAllData()
  }

  return {
    selectedDate,
    currentDayData,
    loadDay,
    saveDay,
    setSelectedDate,
    availableMonths,
    getMonthData: getMonthData_,
    getAllData
  }
})