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
          <span>📊</span> Análisis y Evolución
        </h1>
        
        <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          <span v-if="isDark" class="text-xl">☀️</span>
          <span v-else class="text-xl">🌙</span>
        </button>
      </div>
    </div>

    <div class="p-4 max-w-7xl mx-auto space-y-4">
      
      <!-- Filtros de período -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex items-center gap-4">
            <select v-model="periodo" @change="cargarDatos" class="input-neon py-2 px-4">
              <option value="month">Este Mes</option>
              <option value="last3months">Últimos 3 Meses</option>
              <option value="last6months">Últimos 6 Meses</option>
              <option value="year">Último Año</option>
              <option value="custom">Personalizado</option>
            </select>
            
            <div v-if="periodo === 'custom'" class="flex items-center gap-2">
              <input type="date" v-model="fechaInicio" class="input-neon py-2">
              <span class="text-gray-500">a</span>
              <input type="date" v-model="fechaFin" class="input-neon py-2">
            </div>
          </div>
          
          <button @click="cargarDatos" class="btn-neon px-6 py-2">
            Actualizar
          </button>
        </div>
      </div>

      <!-- KPIs principales -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">💰</span>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Ventas</p>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(kpis.totalVentas) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">📈</span>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Ganancia 30%</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">${{ formatNumber(kpis.totalGanancia) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">🍱</span>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Colaciones</p>
          <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">${{ formatNumber(kpis.totalColaciones) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <span class="text-2xl block mb-2">📆</span>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Días Trabajados</p>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ kpis.diasTrabajados }}</p>
        </div>
      </div>

      <!-- Gráfico de evolución diaria -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-pink-500"></span>
          Evolución Diaria de Ventas
        </h2>
        <div class="h-80 w-full relative">
          <canvas ref="chartDiario"></canvas>
        </div>
      </div>

      <!-- Gráfico de comparativa mensual -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span>
          Comparativa Mensual
        </h2>
        <div class="h-80 w-full relative">
          <canvas ref="chartMensual"></canvas>
        </div>
      </div>

      <!-- Distribución y análisis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- Gráfico de torta -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
            Distribución de Ingresos
          </h2>
          <div class="h-64 w-full relative">
            <canvas ref="chartTorta"></canvas>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-600"></span>
              <span class="text-gray-600 dark:text-gray-400">Ventas: {{ formatPorcentaje(kpis.porcentajeVentas) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-green-600"></span>
              <span class="text-gray-600 dark:text-gray-400">Ganancia: {{ formatPorcentaje(kpis.porcentajeGanancia) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-pink-600"></span>
              <span class="text-gray-600 dark:text-gray-400">Colaciones: {{ formatPorcentaje(kpis.porcentajeColaciones) }}</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400"></span>
            Estadísticas
          </h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400">Promedio diario</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${{ formatNumber(kpis.promedioDiario) }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400">Mejor día</p>
                <p class="text-xl font-bold text-green-600 dark:text-green-400">${{ formatNumber(kpis.mejorDia) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400">Peor día</p>
                <p class="text-xl font-bold text-red-600 dark:text-red-400">${{ formatNumber(kpis.peorDia) }}</p>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400">Días sin ventas</p>
                <p class="text-xl font-bold text-orange-600 dark:text-orange-400">{{ kpis.diasSinVentas }}</p>
              </div>
            </div>

            <div class="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">Tendencia</p>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">vs período anterior</span>
                <div class="flex items-center gap-2">
                  <span :class="kpis.tendencia > 0 ? 'trend-up' : 'trend-down'">
                    {{ kpis.tendencia > 0 ? '↑' : '↓' }} {{ Math.abs(kpis.tendencia) }}%
                  </span>
                  <span class="text-gray-500 text-sm">
                    (${{ formatNumber(Math.abs(kpis.diferencia)) }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de mejores y peores días -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- Mejores días -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-xl">🏆</span>
            Top 5 Mejores Días
          </h2>
          <div class="space-y-2">
            <div v-for="(dia, index) in kpis.topMejores" :key="dia.fecha" 
                 class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] }}</span>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ formatDate(dia.fecha) }}</p>
                  <p class="text-xs text-gray-500">Ganancia: ${{ formatNumber(dia.ganancia) }}</p>
                </div>
              </div>
              <span class="text-xl font-bold text-green-600">${{ formatNumber(dia.monto) }}</span>
            </div>
          </div>
        </div>

        <!-- Peores días -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-xl">📉</span>
            Días con Bajas Ventas
          </h2>
          <div class="space-y-2">
            <div v-for="dia in kpis.topPeores" :key="dia.fecha" 
                 class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="text-red-500">⚠️</span>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ formatDate(dia.fecha) }}</p>
                  <p class="text-xs text-gray-500">vs promedio: -{{ formatPorcentaje(dia.desviacion) }}</p>
                </div>
              </div>
              <span class="text-lg font-bold text-red-600">${{ formatNumber(dia.monto) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Análisis de días de la semana -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
          Rendimiento por Día de la Semana
        </h2>
        <div class="grid grid-cols-7 gap-2">
          <div v-for="(dia, idx) in diasSemana" :key="idx" class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ dia.nombre }}</p>
            <div class="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
              <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-blue-400"
                   :style="{ height: `${dia.porcentaje}%` }"></div>
            </div>
            <p class="text-xs font-bold mt-1">${{ formatNumber(dia.promedio) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useIncomeStore } from '../stores/income'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'  // Importación corregida
import { formatDisplayDate, formatShortDate } from '../utils/dateUtils'

const router = useRouter()
const themeStore = useThemeStore()
const incomeStore = useIncomeStore()

// Estado
const periodo = ref('month')
const fechaInicio = ref('')
const fechaFin = ref('')
const isDark = ref(themeStore.isDark)

// Referencias para los gráficos
const chartDiario = ref(null)
const chartMensual = ref(null)
const chartTorta = ref(null)

// Datos
const kpis = ref({
  totalVentas: 0,
  totalGanancia: 0,
  totalColaciones: 0,
  diasTrabajados: 0,
  promedioDiario: 0,
  mejorDia: 0,
  peorDia: 0,
  diasSinVentas: 0,
  tendencia: 0,
  diferencia: 0,
  porcentajeVentas: 0,
  porcentajeGanancia: 0,
  porcentajeColaciones: 0,
  topMejores: [],
  topPeores: []
})

const diasSemana = ref([
  { nombre: 'Lun', promedio: 0, porcentaje: 0 },
  { nombre: 'Mar', promedio: 0, porcentaje: 0 },
  { nombre: 'Mié', promedio: 0, porcentaje: 0 },
  { nombre: 'Jue', promedio: 0, porcentaje: 0 },
  { nombre: 'Vie', promedio: 0, porcentaje: 0 },
  { nombre: 'Sáb', promedio: 0, porcentaje: 0 },
  { nombre: 'Dom', promedio: 0, porcentaje: 0 }
])

// Métodos
const toggleTheme = () => {
  themeStore.toggleTheme()
  isDark.value = themeStore.isDark
  cargarDatos()
}

const goBack = () => {
  router.push('/dashboard')
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CL').format(num || 0)
}

const formatPorcentaje = (num) => {
  return Math.round(num) + '%'
}

const formatDate = (dateStr) => {
  return formatDisplayDate(dateStr)
}

const formatDateShort = (dateStr) => {
  return formatShortDate(dateStr)
}

const cargarDatos = () => {
  console.log('Cargando datos para gráficos...')
  
  // Obtener datos del JSON storage
  const allData = incomeStore.getAllData()
  const datos = []
  const diasPorMes = new Map()
  const diasPorSemana = Array(7).fill(0).map(() => ({ total: 0, count: 0 }))
  
  // Procesar todos los días
  Object.entries(allData.days).forEach(([dateStr, data]) => {
    const fecha = new Date(dateStr + 'T12:00:00')
    const amount = data.amount || 0
    const colacion = data.colacion ? 5000 : 0
    const ganancia = amount * 0.3
    const viatico = data.viatico || 0
    
    datos.push({
      fecha: dateStr,
      amount,
      colacion,
      ganancia,
      viatico,
      total: ganancia + colacion + viatico
    })
    
    // Agrupar por mes
    const mesKey = dateStr.substring(0, 7)
    if (!diasPorMes.has(mesKey)) {
      diasPorMes.set(mesKey, { total: 0, count: 0 })
    }
    diasPorMes.get(mesKey).total += amount
    diasPorMes.get(mesKey).count++
    
    // Agrupar por día de semana
    const diaSemana = fecha.getDay()
    const idx = diaSemana === 0 ? 6 : diaSemana - 1
    diasPorSemana[idx].total += amount
    diasPorSemana[idx].count++
  })

  // Ordenar datos por fecha
  datos.sort((a, b) => a.fecha.localeCompare(b.fecha))

  // Calcular KPIs
  const totalVentas = datos.reduce((sum, d) => sum + d.amount, 0)
  const totalGanancia = datos.reduce((sum, d) => sum + d.ganancia, 0)
  const totalColaciones = datos.reduce((sum, d) => sum + d.colacion, 0)
  const totalViaticos = datos.reduce((sum, d) => sum + (d.viatico || 0), 0)
  const diasTrabajados = datos.length
  
  const montos = datos.map(d => d.amount)
  const mejorDia = Math.max(...montos, 0)
  const peorDia = Math.min(...montos.filter(m => m > 0), 0)
  const diasSinVentas = montos.filter(m => m === 0).length
  
  // Calcular tendencia (comparar primera mitad vs segunda mitad)
  let tendencia = 0
  let diferencia = 0
  if (datos.length >= 4) {
    const mitad = Math.floor(datos.length / 2)
    const primeraMitad = datos.slice(0, mitad)
    const segundaMitad = datos.slice(mitad)
    
    const promedio1 = primeraMitad.reduce((sum, d) => sum + d.amount, 0) / primeraMitad.length
    const promedio2 = segundaMitad.reduce((sum, d) => sum + d.amount, 0) / segundaMitad.length
    
    diferencia = promedio2 - promedio1
    tendencia = promedio1 > 0 ? ((promedio2 - promedio1) / promedio1) * 100 : 0
  }
  
  kpis.value = {
    totalVentas,
    totalGanancia,
    totalColaciones,
    totalViaticos,
    diasTrabajados,
    promedioDiario: diasTrabajados > 0 ? totalVentas / diasTrabajados : 0,
    mejorDia,
    peorDia,
    diasSinVentas,
    tendencia,
    diferencia,
    porcentajeVentas: totalVentas > 0 ? (totalVentas / (totalVentas + totalColaciones + totalViaticos)) * 100 : 0,
    porcentajeGanancia: totalVentas > 0 ? (totalGanancia / totalVentas) * 100 : 0,
    porcentajeColaciones: totalVentas > 0 ? (totalColaciones / totalVentas) * 100 : 0,
    topMejores: datos.sort((a, b) => b.amount - a.amount).slice(0, 5).map(d => ({
      fecha: d.fecha,
      monto: d.amount,
      ganancia: d.ganancia
    })),
    topPeores: datos.filter(d => d.amount > 0).sort((a, b) => a.amount - b.amount).slice(0, 5).map(d => ({
      fecha: d.fecha,
      monto: d.amount,
      desviacion: kpis.value.promedioDiario ? ((kpis.value.promedioDiario - d.amount) / kpis.value.promedioDiario) * 100 : 0
    }))
  }

  // Calcular promedios por día de semana
  const maxPromedio = Math.max(...diasPorSemana.map(d => d.count > 0 ? d.total / d.count : 0))
  diasSemana.value = diasPorSemana.map((d, i) => ({
    nombre: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
    promedio: d.count > 0 ? Math.round(d.total / d.count) : 0,
    porcentaje: maxPromedio > 0 ? ((d.count > 0 ? d.total / d.count : 0) / maxPromedio) * 100 : 0
  }))

  actualizarGraficos(datos, diasPorMes)
}

const actualizarGraficos = (datos = [], diasPorMes = new Map()) => {
  // Destruir gráficos existentes
  if (window.chartDiario) {
    window.chartDiario.destroy()
    window.chartDiario = null
  }
  if (window.chartMensual) {
    window.chartMensual.destroy()
    window.chartMensual = null
  }
  if (window.chartTorta) {
    window.chartTorta.destroy()
    window.chartTorta = null
  }

  // Gráfico diario
  const ctxDiario = chartDiario.value?.getContext('2d')
  if (ctxDiario && datos.length > 0) {
    window.chartDiario = new Chart(ctxDiario, {
      type: 'line',
      data: {
        labels: datos.map(d => formatDateShort(d.fecha)),
        datasets: [{
          label: 'Ventas diarias',
          data: datos.map(d => d.amount),
          borderColor: isDark.value ? '#ff6384' : '#36a2eb',
          backgroundColor: isDark.value ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    })
  }

  // Gráfico mensual
  const ctxMensual = chartMensual.value?.getContext('2d')
  if (ctxMensual && diasPorMes.size > 0) {
    const meses = Array.from(diasPorMes.keys()).sort()
    window.chartMensual = new Chart(ctxMensual, {
      type: 'bar',
      data: {
        labels: meses.map(m => {
          const [y, mth] = m.split('-')
          const date = new Date(parseInt(y), parseInt(mth) - 1, 1)
          return date.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
        }),
        datasets: [{
          label: 'Ventas mensuales',
          data: meses.map(m => diasPorMes.get(m).total),
          backgroundColor: isDark.value ? '#ff6384' : '#36a2eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }

  // Gráfico de torta
  const ctxTorta = chartTorta.value?.getContext('2d')
  if (ctxTorta && kpis.value.totalVentas > 0) {
    window.chartTorta = new Chart(ctxTorta, {
      type: 'doughnut',
      data: {
        labels: ['Ventas', 'Ganancia 30%', 'Colaciones', 'Viáticos'],
        datasets: [{
          data: [
            kpis.value.totalVentas,
            kpis.value.totalGanancia,
            kpis.value.totalColaciones,
            kpis.value.totalViaticos || 0
          ],
          backgroundColor: [
            '#36a2eb',
            '#4bc0c0',
            '#ff6384',
            '#9966ff'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }
}

// Watch para cambios de tema
watch(isDark, () => {
  cargarDatos()
})

// Watch para cambios en período
watch(periodo, () => {
  cargarDatos()
})

onMounted(() => {
  console.log('Charts mounted, cargando datos...')
  cargarDatos()
})
</script>