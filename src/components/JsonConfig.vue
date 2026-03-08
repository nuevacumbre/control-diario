<template>
  <div class="fixed bottom-20 right-4 z-50">
    <!-- Botón de configuración -->
    <button @click="showMenu = !showMenu" 
            class="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white 
                   shadow-lg flex items-center justify-center text-2xl transition-all">
      ⚙️
    </button>

    <!-- Menú de configuración JSON -->
    <div v-if="showMenu" 
         class="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
                border border-gray-200 dark:border-gray-700 p-4 mb-2">
      
      <h3 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <span>📁</span> Configuración JSON
      </h3>

      <!-- Estadísticas del archivo -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3 text-sm">
        <div class="flex justify-between mb-1">
          <span class="text-gray-600 dark:text-gray-400">Total registros:</span>
          <span class="font-bold text-gray-800 dark:text-white">{{ totalRegistros }}</span>
        </div>
        <div class="flex justify-between mb-1">
          <span class="text-gray-600 dark:text-gray-400">Última actualización:</span>
          <span class="font-bold text-gray-800 dark:text-white">{{ lastUpdated || 'Nunca' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Versión:</span>
          <span class="font-bold text-gray-800 dark:text-white">{{ dataVersion }}</span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="space-y-2">
        <button @click="exportJson" 
                class="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                       flex items-center justify-center gap-2 transition-colors">
          <span>📥</span> Exportar JSON
        </button>

        <label class="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                      flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <span>📤</span> Importar JSON
          <input type="file" accept=".json" @change="importJson" class="hidden">
        </label>

        <button @click="resetData" 
                class="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                       flex items-center justify-center gap-2 transition-colors">
          <span>🔄</span> Resetear datos
        </button>
      </div>

      <!-- Editor JSON manual -->
      <div class="mt-3">
        <button @click="showEditor = !showEditor" 
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <span>✏️</span> {{ showEditor ? 'Ocultar editor' : 'Editar JSON manualmente' }}
        </button>

        <div v-if="showEditor" class="mt-2">
          <textarea v-model="jsonEditor" 
                    rows="8"
                    class="w-full p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    placeholder="{}"></textarea>
          <button @click="saveJsonEdit" 
                  class="mt-2 w-full p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useIncomeStore } from '../stores/income'
import { exportToJson, importFromJson, loadAllData, saveAllData } from '../utils/jsonStorage'

const incomeStore = useIncomeStore()
const showMenu = ref(false)
const showEditor = ref(false)
const jsonEditor = ref('')

// Datos del JSON
const allData = ref(loadAllData())
const totalRegistros = computed(() => Object.keys(allData.value.days || {}).length)
const lastUpdated = computed(() => {
  if (!allData.value.lastUpdated) return null
  return new Date(allData.value.lastUpdated).toLocaleString('es-CL')
})
const dataVersion = computed(() => allData.value.version || '1.0')

// Exportar JSON
const exportJson = () => {
  exportToJson()
  showMenu.value = false
}

// Importar JSON
const importJson = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const data = await importFromJson(file)
    allData.value = data
    incomeStore.loadDay(incomeStore.selectedDate)
    alert('✅ Datos importados correctamente')
    showMenu.value = false
  } catch (error) {
    alert('❌ Error al importar: ' + error.message)
  }
}

// Resetear datos
const resetData = () => {
  if (confirm('¿Estás seguro? Esto eliminará todos los datos guardados.')) {
    localStorage.removeItem('control-diario-data')
    allData.value = loadAllData()
    incomeStore.loadDay(incomeStore.selectedDate)
    alert('✅ Datos reseteados')
    showMenu.value = false
  }
}

// Editar JSON manualmente
const saveJsonEdit = () => {
  try {
    const newData = JSON.parse(jsonEditor.value)
    if (newData.version && newData.days !== undefined) {
      saveAllData(newData)
      allData.value = newData
      incomeStore.loadDay(incomeStore.selectedDate)
      alert('✅ Cambios guardados')
      showEditor.value = false
    } else {
      alert('❌ Formato inválido')
    }
  } catch (error) {
    alert('❌ JSON inválido: ' + error.message)
  }
}

onMounted(() => {
  jsonEditor.value = JSON.stringify(allData.value, null, 2)
})
</script>