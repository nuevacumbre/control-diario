<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 
              dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    
    <!-- Header -->
    <div class="sticky top-0 z-10 p-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
                border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <button @click="logout" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-2">
          <span class="text-xl">🚪</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">Salir</span>
        </button>
        
        <h1 class="text-xl font-bold text-blue-600 dark:text-pink-500">
          🚌 Control Diario
        </h1>
        
        <div class="flex items-center gap-2">
          <button @click="goToHistory" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-1">
            <span class="text-xl">📋</span>
            <span class="text-sm hidden sm:inline text-gray-700 dark:text-gray-300">Historial</span>
          </button>
          
          <button @click="goToCharts" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-1">
            <span class="text-xl">📊</span>
            <span class="text-sm hidden sm:inline text-gray-700 dark:text-gray-300">Gráficos</span>
          </button>
          
          <button @click="handleThemeToggle" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all relative">
            <span v-if="isDark" class="text-xl">☀️</span>
            <span v-else class="text-xl">🌙</span>
          </button>
        </div>
      </div>
    </div>

    <div class="p-4 max-w-7xl mx-auto">
      <!-- Layout responsivo -->
      <div class="flex flex-col lg:flex-row gap-4">
        
        <!-- Columna izquierda: Registro diario -->
        <div class="lg:w-[70%] space-y-4">
          
          <!-- Selector de fecha -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <button @click="previousDay" class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                <span class="text-2xl">←</span>
              </button>
              
              <div class="text-center">
                <div class="flex items-center gap-2 justify-center mb-1">
                  <span class="text-2xl">📅</span>
                  <input 
                    type="date" 
                    v-model="selectedDate"
                    @change="changeDate"
                    class="bg-transparent border-none text-center font-semibold 
                           focus:ring-0 text-gray-800 dark:text-white text-lg"
                  >
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(selectedDate) }}
                </p>
                <div v-if="isHoliday" class="mt-2">
                  <span class="inline-flex items-center gap-1 text-sm bg-red-100 dark:bg-red-900/30 
                               text-red-600 dark:text-red-400 px-3 py-1 rounded-full 
                               border border-red-200 dark:border-red-800">
                    <span>🎉</span> {{ holidayName }}
                  </span>
                </div>
              </div>
              
              <button @click="nextDay" class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                <span class="text-2xl">→</span>
              </button>
            </div>
          </div>

          <!-- Tarjeta principal -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            
            <!-- Totales con iconos -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
              <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <span class="text-3xl block mb-2">💰</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Venta del día</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(ventaDiaria) }}</p>
              </div>
              <div class="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                <span class="text-3xl block mb-2">🍱</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Colación</p>
                <p class="text-xl font-bold" :class="colacionActiva ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'">
                  {{ colacionActiva ? '$5.000' : '$0' }}
                </p>
              </div>
              <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <span class="text-3xl block mb-2">📈</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">30% Ganancia</p>
                <p class="text-xl font-bold text-green-600 dark:text-green-400">${{ formatNumber(ganancia30) }}</p>
              </div>
              <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <span class="text-3xl block mb-2">💰</span>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total del día</p>
                <p class="text-xl font-bold text-purple-600 dark:text-purple-400">${{ formatNumber(totalDiario) }}</p>
              </div>
            </div>

            <!-- Formulario -->
            <div class="space-y-4">
              <!-- Campo monto -->
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
                  <span>💵</span> Ingrese monto total de ventas del día
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                  <input 
                    type="number" 
                    v-model.number="ventaDiaria"
                    @input="saveData"
                    class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 
                           rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ej: 140000"
                    min="0"
                    step="1000"
                  >
                </div>
              </div>

              <!-- Checkbox colación -->
              <div class="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 
                          dark:from-orange-900/20 dark:to-pink-900/20 
                          border border-orange-200 dark:border-orange-800/30">
                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="colacionActiva"
                      @change="saveData"
                      class="w-6 h-6 text-pink-600 dark:text-pink-500 rounded-lg 
                             focus:ring-pink-500 dark:focus:ring-pink-400"
                    >
                    <div>
                      <span class="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
                        <span>🍱</span> Incluir colación
                      </span>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Descuento de $5.000 para alimentación
                      </p>
                    </div>
                  </label>
                  <span class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    $5.000
                  </span>
                </div>
              </div>

              <!-- Campo viático extra -->
              <div class="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 
                          dark:from-purple-900/20 dark:to-blue-900/20 
                          border border-purple-200 dark:border-purple-800/30">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">✨</span>
                    <div>
                      <label class="text-lg font-medium text-gray-800 dark:text-white">
                        Viático extra
                      </label>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Monto adicional (feriados, turno especial, etc.)
                      </p>
                    </div>
                  </div>
                </div>
                <div class="relative mt-2">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                  <input 
                    type="number" 
                    v-model.number="viaticoExtra"
                    @input="saveData"
                    class="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 
                           rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 10000"
                    min="0"
                    step="1000"
                  >
                </div>
                <div class="flex gap-2 mt-2 text-xs text-gray-500">
                  <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">🎉 Feriado: +$10,000</span>
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">🌅 Turno mañana: +$10,000</span>
                </div>
              </div>

              <!-- Botón guardar -->
              <button @click="saveData" 
                      class="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                             hover:from-blue-700 hover:to-purple-700
                             dark:from-pink-600 dark:to-purple-600
                             dark:hover:from-pink-700 dark:hover:to-purple-700
                             text-white py-4 rounded-xl font-bold text-lg 
                             transition-all transform hover:scale-[1.02] active:scale-[0.98]
                             flex items-center justify-center gap-3 shadow-lg">
                <span class="text-2xl">⚡</span>
                GUARDAR REGISTRO DEL DÍA
                <span class="text-2xl">⚡</span>
              </button>
            </div>

            <!-- Resumen detallado -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-lg">
                <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-pink-500"></span>
                Resumen detallado
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span>💰</span> Venta bruta:
                    </span>
                    <span class="font-bold text-blue-600 dark:text-blue-400 text-lg">${{ formatNumber(ventaDiaria) }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span>🍱</span> Colación:
                    </span>
                    <span class="font-bold" :class="colacionActiva ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'">
                      -${{ formatNumber(colacionActiva ? 5000 : 0) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span>✨</span> Viático extra:
                    </span>
                    <span class="font-bold text-purple-600 dark:text-purple-400">
                      +${{ formatNumber(viaticoExtra) }}
                    </span>
                  </div>
                </div>
                
                <div class="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 
                            dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">📈 GANANCIA 30%:</span>
                    <span class="text-2xl font-bold text-green-600 dark:text-green-400">${{ formatNumber(ganancia30) }}</span>
                  </div>
                  <div v-if="colacionActiva" class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">➕ Colación:</span>
                    <span class="text-pink-600 dark:text-pink-400 font-bold text-xl">+ $5.000</span>
                  </div>
                  <div class="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-gray-800 dark:text-white">💰 TOTAL A RECIBIR:</span>
                    <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">${{ formatNumber(totalDiario) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje feriado -->
          <div v-if="isHoliday" 
               class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 
                      border border-red-200 dark:border-red-800 p-4 rounded-xl text-center">
            <div class="flex items-center justify-center gap-3">
              <span class="text-4xl">🎉</span>
              <div>
                <p class="font-bold text-red-600 dark:text-red-400 text-xl">¡FERIADO EN CHILE!</p>
                <p class="text-gray-700 dark:text-gray-300 mt-1">{{ holidayName }}</p>
              </div>
              <span class="text-4xl">🎉</span>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Historial Mensual Mejorado -->
        <div class="lg:w-[30%] space-y-4">
  
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sticky top-20 border border-gray-200 dark:border-gray-700">
    
    <!-- Header con estadísticas rápidas -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-3xl">📊</span>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Historial Mensual</h2>
      </div>
      <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
        {{ totalMeses }} meses
      </span>
    </div>

    <!-- Selector de año -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
        <span>📅</span> Año:
      </label>
      <div class="flex gap-2">
        <select 
          v-model="selectedYear"
          @change="loadYearData"
          class="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <button @click="previousYear" class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
          ←
        </button>
        <button @click="nextYear" class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
          →
        </button>
      </div>
    </div>

    <!-- Resumen del año -->
    <div v-if="yearData" class="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Total Año {{ selectedYear }}</span>
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(yearData.totalAnual) }}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span class="text-gray-500">Ganancia 30%:</span>
          <span class="font-bold text-green-600 dark:text-green-400 ml-1">${{ formatNumber(yearData.gananciaAnual) }}</span>
        </div>
        <div>
          <span class="text-gray-500">Colaciones:</span>
          <span class="font-bold text-pink-600 dark:text-pink-400 ml-1">${{ formatNumber(yearData.colacionesAnual) }}</span>
        </div>
        <div>
          <span class="text-gray-500">Días:</span>
          <span class="font-bold text-purple-600 dark:text-purple-400 ml-1">{{ yearData.diasAnual }}</span>
        </div>
        <div>
          <span class="text-gray-500">Promedio:</span>
          <span class="font-bold text-orange-600 dark:text-orange-400 ml-1">${{ formatNumber(yearData.promedioAnual) }}</span>
        </div>
      </div>
    </div>

    <!-- Lista de meses del año -->
    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      <div v-for="mes in mesesData" :key="mes.mesKey" 
           class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
           :class="mes.mesKey === selectedMonth ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700/30'"
           @click="selectMonth(mes.mesKey)">
        
        <!-- Cabecera del mes -->
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">{{ mes.icono }}</span>
            <span class="font-semibold text-gray-800 dark:text-white">{{ mes.nombre }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full" 
                  :class="mes.rendimiento >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
              {{ mes.rendimiento >= 0 ? '↑' : '↓' }} {{ Math.abs(mes.rendimiento) }}%
            </span>
            <span class="text-xs text-gray-500">{{ mes.dias }} días</span>
          </div>
        </div>

        <!-- Métricas del mes -->
        <div class="grid grid-cols-2 gap-2 text-sm mb-2">
          <div>
            <p class="text-xs text-gray-500">Ventas</p>
            <p class="font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(mes.total) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Ganancia</p>
            <p class="font-bold text-green-600 dark:text-green-400">${{ formatNumber(mes.ganancia) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Colaciones</p>
            <p class="font-bold text-pink-600 dark:text-pink-400">${{ formatNumber(mes.colaciones) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Viáticos</p>
            <p class="font-bold text-purple-600 dark:text-purple-400">${{ formatNumber(mes.viaticos) }}</p>
          </div>
          <div class="col-span-2 mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between">
              <span class="text-xs text-gray-500">Total ingresos:</span>
              <span class="font-bold text-orange-600 dark:text-orange-400">${{ formatNumber(mes.totalIngresos) }}</span>
            </div>
          </div>
        </div>

        <!-- Barra de progreso de días trabajados -->
        <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div class="h-full bg-gradient-to-r from-blue-600 to-purple-600"
               :style="{ width: `${(mes.dias / 30) * 100}%` }"></div>
        </div>

        <!-- Top 3 días del mes -->
        <div v-if="mes.topDias && mes.topDias.length > 0" class="mt-2 space-y-1">
          <p class="text-xs text-gray-500">Mejores días:</p>
          <div v-for="dia in mes.topDias.slice(0, 2)" :key="dia.fecha" 
               class="flex justify-between text-xs">
            <span>{{ formatDateShort(dia.fecha) }}</span>
            <span class="font-medium text-green-600">${{ formatNumber(dia.amount) }}</span>
          </div>
          <div v-if="mes.topDias.length > 2" class="text-xs text-gray-400">
            +{{ mes.topDias.length - 2 }} más
          </div>
        </div>

        <!-- Indicadores de tendencia -->
        <div class="flex justify-between items-center mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span v-if="mes.mejorQueAnterior" class="text-xs text-green-600 flex items-center">
              ↑ mejor que mes anterior
            </span>
            <span v-else-if="mes.peorQueAnterior" class="text-xs text-red-600 flex items-center">
              ↓ peor que mes anterior
            </span>
          </div>
          <button @click.stop="verDetalleMes(mes.mesKey)" 
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Ver detalles →
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay datos -->
    <div v-if="mesesData.length === 0" class="text-center py-8">
      <span class="text-6xl block mb-4">📭</span>
      <p class="text-gray-500 dark:text-gray-400">No hay datos para {{ selectedYear }}</p>
    </div>
  </div>
</div>

      </div>
    </div>
    
    <!-- Componente de configuración JSON -->
    <JsonConfig />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useIncomeStore } from '../stores/income'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'
import JsonConfig from '../components/JsonConfig.vue'
import { 
  formatDisplayDate, 
  formatShortDate, 
  getCurrentDate,
  getPreviousDay,
  getNextDay,
  dateToString,
  isValidDate,
  getMonthName  
} from '../utils/dateUtils'
import { loadAllData } from '../utils/jsonStorage'

const incomeStore = useIncomeStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

// Datos del formulario
const ventaDiaria = ref(0)
const colacionActiva = ref(false)
const viaticoExtra = ref(0)

// Datos para el historial mensual mejorado
const selectedYear = ref(new Date().getFullYear())
const availableYears = ref([])
const yearData = ref(null)
const mesesData = ref([])

// Computed para total de meses
const totalMeses = computed(() => {
  return mesesData.value.length
})

// Cargar años disponibles
const loadAvailableYears = () => {
  const allData = loadAllData()  // <-- Ahora loadAllData está definido
  const years = new Set()
  
  Object.keys(allData.days).forEach(date => {
    const [year] = date.split('-')
    years.add(parseInt(year))
  })
  
  availableYears.value = Array.from(years).sort((a, b) => b - a)
  if (availableYears.value.length > 0 && !availableYears.value.includes(selectedYear.value)) {
    selectedYear.value = availableYears.value[0]
    loadYearData()
  }
}

// Cargar datos del año
const loadYearData = () => {
  const allData = loadAllData()
  const meses = []
  let totalAnual = 0
  let gananciaAnual = 0
  let colacionesAnual = 0
  let viaticosAnual = 0
  let diasAnual = 0
  
  // Procesar cada mes del año
  for (let mes = 1; mes <= 12; mes++) {
    const mesKey = `${selectedYear.value}-${String(mes).padStart(2, '0')}`
    let totalMes = 0
    let colacionesMes = 0
    let viaticosMes = 0
    let diasMes = 0
    const diasDelMes = []
    
    // Recopilar datos del mes
    Object.entries(allData.days).forEach(([date, data]) => {
      if (date.startsWith(mesKey)) {
        const amount = data.amount || 0
        totalMes += amount
        if (data.colacion) colacionesMes += 5000
        if (data.viatico) viaticosMes += data.viatico
        diasMes++
        diasDelMes.push({
          fecha: date,
          amount: amount,
          colacion: data.colacion,
          viatico: data.viatico || 0
        })
      }
    })
    
    if (diasMes > 0) {
      const gananciaMes = totalMes * 0.3
      const totalIngresosMes = gananciaMes + colacionesMes + viaticosMes
      const promedioMes = totalMes / diasMes
      
      // Calcular rendimiento vs mes anterior
      let rendimiento = 0
      const mesAnterior = mes > 1 ? 
        `${selectedYear.value}-${String(mes - 1).padStart(2, '0')}` : 
        `${selectedYear.value - 1}-12`
      
      let totalAnterior = 0
      Object.entries(allData.days).forEach(([date, data]) => {
        if (date.startsWith(mesAnterior)) {
          totalAnterior += data.amount || 0
        }
      })
      
      if (totalAnterior > 0) {
        rendimiento = ((totalMes - totalAnterior) / totalAnterior) * 100
      }
      
      // Top días del mes (por ventas)
      const topDias = [...diasDelMes].sort((a, b) => b.amount - a.amount).slice(0, 3)
      
      meses.push({
        mesKey,
        nombre: getMonthName(selectedYear.value, mes),
        icono: getMonthIcon(mes),
        total: totalMes,
        ganancia: gananciaMes,
        colaciones: colacionesMes,
        viaticos: viaticosMes,
        totalIngresos: totalIngresosMes,
        dias: diasMes,
        promedio: promedioMes,
        topDias,
        rendimiento: Math.round(rendimiento * 10) / 10,
        mejorQueAnterior: rendimiento > 5,
        peorQueAnterior: rendimiento < -5
      })
      
      totalAnual += totalMes
      gananciaAnual += gananciaMes
      colacionesAnual += colacionesMes
      viaticosAnual += viaticosMes
      diasAnual += diasMes
    }
  }
  
  // Ordenar meses por fecha (más reciente primero)
  meses.sort((a, b) => b.mesKey.localeCompare(a.mesKey))
  
  mesesData.value = meses
  yearData.value = {
    totalAnual,
    gananciaAnual,
    colacionesAnual,
    viaticosAnual,
    diasAnual,
    promedioAnual: diasAnual > 0 ? totalAnual / diasAnual : 0
  }
}

// Obtener icono del mes
const getMonthIcon = (mes) => {
  const icons = ['❄️', '🌸', '🌸', '🌸', '🌺', '🌞', '🌞', '🌞', '🍂', '🍂', '🍂', '❄️']
  return icons[mes - 1] || '📅'
}

// Navegación de años
const previousYear = () => {
  selectedYear.value--
  loadYearData()
}

const nextYear = () => {
  selectedYear.value++
  loadYearData()
}

// Seleccionar mes
const selectMonth = (mesKey) => {
  selectedMonth.value = mesKey
  loadMonthData()
}

// Ver detalle del mes
const verDetalleMes = (mesKey) => {
  selectedMonth.value = mesKey
  loadMonthData()
  // Scroll suave a la sección de detalles
  document.querySelector('.lg\\:w-\\[70\\%\\]')?.scrollIntoView({ behavior: 'smooth' })
}

// Feriados
const feriados = ref([])
const isHoliday = ref(false)
const holidayName = ref('')

// Selección de mes
const selectedMonth = ref('')
const selectedMonthData = ref(null)

// Tema
const isDark = computed(() => themeStore.isDark)

const handleThemeToggle = () => {
  console.log('Botón de tema clickeado - modo actual:', isDark.value ? 'oscuro' : 'claro')
  try {
    themeStore.toggleTheme()
    setTimeout(() => {
      document.documentElement.style.transition = 'all 0.3s ease'
      setTimeout(() => {
        document.documentElement.style.transition = ''
      }, 300)
    }, 10)
  } catch (error) {
    console.error('Error al cambiar tema:', error)
  }
}

// Fecha seleccionada
const selectedDate = computed({
  get: () => {
    const date = incomeStore.selectedDate
    console.log('selectedDate get - store date:', date)
    return isValidDate(date) ? date : getCurrentDate()
  },
  set: (value) => {
    console.log('selectedDate set:', value)
    if (value && isValidDate(value)) {
      incomeStore.setSelectedDate(value)
      loadDayData()
    }
  }
})

// Cálculos
const ganancia30 = computed(() => ventaDiaria.value * 0.3)
const totalDiario = computed(() => {
  return ganancia30.value + 
         (colacionActiva.value ? 5000 : 0) + 
         (viaticoExtra.value || 0)
})

// Obtener todos los meses disponibles
const availableMonths = computed(() => {
  return incomeStore.availableMonths
})

// Cargar datos del día
const loadDayData = () => {
  try {
    console.log('loadDayData - fecha:', selectedDate.value)
    
    // Cargar datos del día desde el store
    const data = incomeStore.loadDay(selectedDate.value)
    console.log('Datos cargados del store:', data)
    
    // Actualizar los campos del formulario
    ventaDiaria.value = data.amount || 0
    colacionActiva.value = data.colacion || false
    viaticoExtra.value = data.viatico || 0
    
    console.log('Valores actualizados:', {
      venta: ventaDiaria.value,
      colacion: colacionActiva.value,
      viatico: viaticoExtra.value
    })
    
    checkHoliday()
    
    const [year, month] = selectedDate.value.split('-')
    const monthKey = `${year}-${month}`
    if (selectedMonth.value !== monthKey) {
      selectedMonth.value = monthKey
      loadMonthData()
    } else {
      loadMonthData()
    }
  } catch (e) {
    console.error('Error loading day data:', e)
  }
}

// Cargar datos del mes
const loadMonthData = () => {
  if (!selectedMonth.value) {
    selectedMonthData.value = null
    return
  }
  
  const [year, month] = selectedMonth.value.split('-')
  const monthData = incomeStore.getMonthData(parseInt(year), parseInt(month))
  
  // Obtener días con datos del mes
  const days = monthData.days.map(date => {
    const data = JSON.parse(localStorage.getItem(`daily_${date}`) || '{}')
    const holiday = feriados.value.find(f => f.fecha === date)
    return {
      date,
      amount: data.amount || 0,
      colacion: data.colacion || false,
      viatico: data.viatico || 0,
      ganancia: (data.amount || 0) * 0.3,
      isHoliday: !!holiday,
      holidayName: holiday?.nombre
    }
  })
  
  // Mes anterior para comparación
  let previousMonth = null
  const prevMonthDate = new Date(parseInt(year), parseInt(month) - 2, 1)
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`
  
  let prevTotal = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('daily_')) {
      const date = key.replace('daily_', '')
      const [y, m] = date.split('-')
      if (`${y}-${m}` === prevMonthKey) {
        try {
          const data = JSON.parse(localStorage.getItem(key))
          prevTotal += data.amount || 0
        } catch (e) {}
      }
    }
  }
  
  if (prevTotal > 0) {
    previousMonth = {
      total: prevTotal,
      ganancia: prevTotal * 0.3
    }
  }
  
  // Top 3 mejores días
  const topDays = [...days].sort((a, b) => b.amount - a.amount).slice(0, 3)
  
  selectedMonthData.value = {
    total: monthData.total,
    colaciones: monthData.colaciones,
    colacionesCount: monthData.colacionesCount,
    ganancia: monthData.ganancia,
    days: monthData.daysCount,
    daysInMonth: monthData.daysInMonth,
    average: monthData.daysCount > 0 ? monthData.total / monthData.daysCount : 0,
    topDays,
    daysList: days,
    previousMonth
  }
}

// Verificar si es feriado
const checkHoliday = () => {
  const holiday = feriados.value.find(f => f.fecha === selectedDate.value)
  isHoliday.value = !!holiday
  holidayName.value = holiday?.nombre || ''
}

// Guardar datos
const saveData = () => {
  try {
    const success = incomeStore.saveDay(selectedDate.value, {
      amount: Number(ventaDiaria.value) || 0,
      colacion: colacionActiva.value,
      viatico: Number(viaticoExtra.value) || 0,
      percentage: 30
    })
    
    if (success) {
      if (selectedMonth.value) {
        loadMonthData()
      }
      showNotification()
    }
  } catch (e) {
    console.error('Error saving data:', e)
  }
}

// Mostrar notificación
const showNotification = () => {
  const notification = document.createElement('div')
  notification.className = 'fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce'
  notification.innerHTML = '✅ Registro guardado'
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 2000)
}

// Formateo de fechas
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return formatDisplayDate(dateStr)
}

const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  return formatShortDate(dateStr)
}

// Navegación de días
const changeDate = () => {
  incomeStore.setSelectedDate(selectedDate.value)
}

const previousDay = () => {
  selectedDate.value = getPreviousDay(selectedDate.value)
}

const nextDay = () => {
  selectedDate.value = getNextDay(selectedDate.value)
}

// Navegación de meses
const previousMonth = () => {
  const date = new Date(selectedMonth.value + '-01')
  date.setMonth(date.getMonth() - 1)
  selectedMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  loadMonthData()
}

const nextMonth = () => {
  const date = new Date(selectedMonth.value + '-01')
  date.setMonth(date.getMonth() + 1)
  selectedMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  loadMonthData()
}

// Navegación a otras páginas
const logout = () => {
  authStore.logout()
  router.push('/')
}

const goToHistory = () => {
  router.push('/history')
}

const goToCharts = () => {
  router.push('/charts')
}

// Formateo de números
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CL').format(num || 0)
}

const formatChange = (change) => {
  if (change > 0) return `↑ +${formatNumber(change)}`
  if (change < 0) return `↓ -${formatNumber(Math.abs(change))}`
  return '= 0'
}

const getTrendClass = (change) => {
  if (change > 0) return 'text-green-600 dark:text-green-400'
  if (change < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-400'
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
  checkHoliday()
}

// Watch para cambios en la fecha
watch(selectedDate, () => {
  const [year, month] = selectedDate.value.split('-')
  const monthKey = `${year}-${month}`
  if (selectedMonth.value !== monthKey) {
    selectedMonth.value = monthKey
    loadMonthData()
  }
})

// Escuchar cambios de tema
// Reemplaza la sección de onMounted con esta versión corregida
onMounted(() => {
  themeStore.initTheme()
  loadFeriados()
  loadAvailableYears()
  
  // IMPORTANTE: Asegurar que la fecha seleccionada sea la actual
  const today = getCurrentDate()
  console.log('Fecha actual:', today)
  
  // Forzar la fecha actual si no hay ninguna seleccionada
  if (!selectedDate.value || !isValidDate(selectedDate.value)) {
    console.log('Estableciendo fecha actual:', today)
    selectedDate.value = today
  }
  
  // Cargar datos del día actual
  loadDayData()
  loadYearData()
  
  const defaultMonth = today.substring(0, 7) // YYYY-MM
  console.log('Mes por defecto:', defaultMonth)
  selectedMonth.value = defaultMonth
  loadMonthData()
  
  window.addEventListener('theme-change', (event) => {
    console.log('Tema cambiado a:', event.detail.isDark ? 'oscuro' : 'claro')
  })
})

// Cleanup
onUnmounted(() => {
  window.removeEventListener('theme-change', () => {})
})

// Exponer variables para depuración (opcional)
if (typeof window !== 'undefined') {
  window.debugMeses = mesesData
  window.debugTotalMeses = totalMeses
  window.debugYearData = yearData
}
</script>