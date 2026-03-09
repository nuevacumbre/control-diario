<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
        {{ editingEntry ? 'Editar' : 'Nuevo' }} Registro
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Descripción del viaje -->
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Descripción
          </label>
          <input 
            type="text" 
            v-model="form.description"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bus-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ej: Santiago - Chillán"
            required
          >
        </div>
        
        <!-- Monto de venta -->
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Monto ($)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input 
              type="number" 
              v-model.number="form.amount"
              class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bus-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0"
              min="0"
              required
            >
          </div>
        </div>
        
        <!-- Checkbox de colación -->
        <div class="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <input 
            type="checkbox" 
            v-model="form.colacion"
            class="w-5 h-5 text-bus-blue dark:text-pink-500 rounded focus:ring-bus-blue"
          >
          <label class="text-sm text-gray-700 dark:text-gray-300">
            Incluir colación (+$5.000)
          </label>
        </div>
        
        <!-- Campo de viático extra -->
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Viático extra ($)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input 
              type="number" 
              v-model.number="form.viatico"
              class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ej: 10000"
              min="0"
            >
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monto adicional por feriados o turnos especiales
          </p>
        </div>
        
        <!-- Resumen preview -->
        <div v-if="form.amount || form.colacion || form.viatico" class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
          <p class="font-semibold text-gray-700 dark:text-gray-300 mb-1">Resumen:</p>
          <p class="text-gray-600 dark:text-gray-400">Venta: ${{ formatNumber(form.amount || 0) }}</p>
          <p v-if="form.colacion" class="text-gray-600 dark:text-gray-400">Colación: $5.000</p>
          <p v-if="form.viatico" class="text-gray-600 dark:text-gray-400">Viático: ${{ formatNumber(form.viatico) }}</p>
          <p class="font-bold text-green-600 dark:text-green-400 mt-1">
            Ganancia 30%: ${{ formatNumber((form.amount || 0) * 0.3) }}
          </p>
        </div>
        
        <!-- Botones de acción -->
        <div class="flex gap-2 mt-6">
          <button type="button" @click="$emit('close')" 
                  class="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button type="submit" 
                  class="flex-1 bg-bus-blue dark:bg-pink-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700">
            {{ editingEntry ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editingEntry: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'close'])

// Estado del formulario
const form = ref({
  description: '',
  amount: 0,
  colacion: false,
  viatico: 0
})

// Si estamos editando, cargar los datos
watch(() => props.editingEntry, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = {
      description: '',
      amount: 0,
      colacion: false,
      viatico: 0
    }
  }
}, { immediate: true })

// Formatear números
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CL').format(num || 0)
}

// Manejar envío del formulario
const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    amount: Number(form.value.amount) || 0,
    viatico: Number(form.value.viatico) || 0
  })
}
</script>