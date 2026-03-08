<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 
              dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    
    <!-- Header -->
    <div class="sticky top-0 z-10 p-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
                border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <button @click="goBack" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-2">
          <span class="text-xl">←</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">Volver</span>
        </button>
        
        <h1 class="text-xl font-bold text-blue-600 dark:text-pink-500 flex items-center gap-2">
          <span>📅</span> Historial de Ingresos
        </h1>
        
        <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          <span v-if="isDark" class="text-xl">☀️</span>
          <span v-else class="text-xl">🌙</span>
        </button>
      </div>
    </div>

    <div class="p-4 max-w-7xl mx-auto">
      
      <!-- Selector de año y mes -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <button @click="previousMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            ←
          </button>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ currentMonthName }} {{ currentYear }}
          </h2>
          <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            →
          </button>
        </div>
      </div>

      <!-- KPIs del mes -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">💰</span>
          <p class="text-xs text-gray-600 dark:text-gray-400">Total Ventas</p>
          <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(monthlyTotal) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">🍱</span>
          <p class="text-xs text-gray-600 dark:text-gray-400">Colaciones</p>
          <p class="text-xl font-bold text-pink-600 dark:text-pink-400">${{ formatNumber(monthlyColaciones) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">📈</span>
          <p class="text-xs text-gray-600 dark:text-gray-400">Ganancia 30%</p>
          <p class="text-xl font-bold text-green-600 dark:text-green-400">${{ formatNumber(monthlyGanancia) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">📆</span>
          <p class="text-xs text-gray-600 dark:text-gray-400">Días</p>
          <p class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ daysWithData.length }} / {{ daysInMonth }}</p>
        </div>
      </div>

      <!-- Calendario -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-pink-500"></span>
          Calendario {{ currentMonthName }}
        </h3>
        
        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          <div v-for="day in ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']" :key="day">{{ day }}</div>
        </div>

        <!-- Días del mes -->
        <div class="grid grid-cols-7 gap-1">
          <div v-for="(day, index) in calendarDays" :key="index"
               @click="day.date ? goToDay(day.date) : null"
               :class="[
                 'aspect-square p-2 text-sm rounded-lg transition-all cursor-pointer',
                 day.date ? 'hover:scale-105 hover:shadow-lg' : '',
                 isSelectedDate(day.date) ? 'bg-blue-600 text-white dark:bg-pink-600' : '',
                 !isSelectedDate(day.date) && day.date && hasData(day.date) ? 'bg-green-100 dark:bg-green-900/30' : '',
                 !isSelectedDate(day.date) && day.date && !hasData(day.date) ? 'bg-gray-50 dark:bg-gray-700/30' : '',
                 isHoliday(day.date) ? 'border-2 border-red-300 dark:border-red-500' : ''
               ]">
            <div class="flex flex-col items-center">
              <span class="font-medium">{{ day.day }}</span>
              <div class="flex gap-1 mt-1">
                <span v-if="hasData(day.date)" class="text-xs text-green-600 dark:text-green-400">💰</span>
                <span v-if="isHoliday(day.date)" class="text-xs">🎉</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="flex flex-wrap gap-4 mt-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"></span>
            <span class="text-gray-600 dark:text-gray-400">Con datos</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gray-50 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600"></span>
            <span class="text-gray-600 dark:text-gray-400">Sin datos</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-red-600 dark:text-red-400">🎉</span>
            <span class="text-gray-600 dark:text-gray-400">Feriado</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-600 dark:bg-pink-600"></span>
            <span class="text-gray-600 dark:text-gray-400">Seleccionado</span>
          </div>
        </div>
      </div>

      <!-- Lista de días del mes -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
          Detalle por día
        </h3>
        
        <div v-if="daysWithData.length === 0" class="text-center py-8">
          <span class="text-6xl block mb-4">📭</span>
          <p class="text-gray-500 dark:text-gray-400">No hay registros en este mes</p>
        </div>

        <div v-else class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="day in daysWithData" :key="day.date"
               @click="goToDay(day.date)"
               class="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
               :class="day.date === selectedDate ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700/30'">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-800 dark:text-white">{{ formatDateShort(day.date) }}</span>
                <span v-if="day.isHoliday" class="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                  🎉 {{ day.holidayName }}
                </span>
              </div>
              <span class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {{ day.percentage || 30 }}%
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Ventas</p>
                <p class="font-medium text-blue-600 dark:text-blue-400">${{ formatNumber(day.amount) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Colación</p>
                <p class="font-medium" :class="day.colacion ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'">
                  {{ day.colacion ? '$5.000' : '$0' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Ganancia</p>
                <p class="font-medium text-green-600 dark:text-green-400">${{ formatNumber(day.ganancia) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIncomeStore } from '../stores/income'
import { useThemeStore } from '../stores/theme'
import { loadAllData } from '../utils/jsonStorage'
import { 
  formatDisplayDate, 
  formatShortDate, 
  getCurrentDate
} from '../utils/dateUtils'

const router = useRouter()
const incomeStore = useIncomeStore()
const themeStore = useThemeStore()

const currentDate = ref(new Date())
const feriados = ref([])
const selectedDate = ref(incomeStore.selectedDate)
const allData = ref({ days: {} })

// Tema
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

// Computed del mes
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('es-CL', { month: 'long' })
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Días del calendario
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  
  // Ajustar al lunes (1 = lunes en Chile)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  
  const days = []
  
  // Días vacíos antes del mes
  for (let i = 0; i < startOffset; i++) {
    days.push({ day: '', date: null })
  }
  
  // Días del mes
  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date: dateStr })
  }
  
  return days
})

// Obtener días con datos del mes actual
const daysWithData = computed(() => {
  const days = []
  const monthStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}`
  
  Object.entries(allData.value.days).forEach(([date, data]) => {
    if (date.startsWith(monthStr)) {
      const holiday = feriados.value.find(f => f.fecha === date)
      days.push({
        date,
        amount: data.amount || 0,
        colacion: data.colacion || false,
        ganancia: (data.amount || 0) * 0.3,
        percentage: data.percentage || 30,
        isHoliday: !!holiday,
        holidayName: holiday?.nombre
      })
    }
  })
  
  return days.sort((a, b) => a.date.localeCompare(b.date))
})

// Totales mensuales
const monthlyTotal = computed(() => {
  return daysWithData.value.reduce((sum, day) => sum + (day.amount || 0), 0)
})

const monthlyColaciones = computed(() => {
  return daysWithData.value.filter(day => day.colacion).length * 5000
})

const monthlyGanancia = computed(() => {
  return daysWithData.value.reduce((sum, day) => sum + ((day.amount || 0) * 0.3), 0)
})

// Métodos
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CL').format(num || 0)
}

const formatDateShort = (date) => {
  return formatShortDate(date)
}

const hasData = (date) => {
  if (!date) return false
  return allData.value.days[date] !== undefined
}

const isHoliday = (date) => {
  if (!date) return false
  return feriados.value.some(f => f.fecha === date)
}

const isSelectedDate = (date) => {
  return date === selectedDate.value
}

const goToDay = (date) => {
  incomeStore.setSelectedDate(date)
  router.push('/dashboard')
}

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  loadData()
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  loadData()
}

const goBack = () => {
  router.push('/dashboard')
}

// Cargar datos del JSON storage
const loadData = () => {
  allData.value = loadAllData()
  console.log('Datos cargados para historial:', Object.keys(allData.value.days).length, 'registros')
}

// Cargar feriados
const loadFeriados = () => {
  feriados.value = [
    { fecha: '2025-01-01', nombre: 'Año Nuevo' },
    { fecha: '2025-04-18', nombre: 'Viernes Santo' },
    { fecha: '2025-04-19', nombre: 'Sábado Santo' },
    { fecha: '2025-05-01', nombre: 'Día del Trabajo' },
    { fecha: '2025-05-21', nombre: 'Día de las Glorias Navales' },
    { fecha: '2025-06-29', nombre: 'San Pedro y San Pablo' },
    { fecha: '2025-07-16', nombre: 'Día de la Virgen del Carmen' },
    { fecha: '2025-08-15', nombre: 'Asunción de la Virgen' },
    { fecha: '2025-09-18', nombre: 'Independencia Nacional' },
    { fecha: '2025-09-19', nombre: 'Día de las Glorias del Ejército' },
    { fecha: '2025-10-12', nombre: 'Encuentro de Dos Mundos' },
    { fecha: '2025-10-31', nombre: 'Día de las Iglesias Evangélicas' },
    { fecha: '2025-11-01', nombre: 'Día de Todos los Santos' },
    { fecha: '2025-12-08', nombre: 'Inmaculada Concepción' },
    { fecha: '2025-12-25', nombre: 'Navidad' },
    { fecha: '2026-01-01', nombre: 'Año Nuevo' },
    { fecha: '2026-04-03', nombre: 'Viernes Santo' },
    { fecha: '2026-04-04', nombre: 'Sábado Santo' }
  ]
}

onMounted(() => {
  themeStore.initTheme()
  loadFeriados()
  loadData()
})
</script>