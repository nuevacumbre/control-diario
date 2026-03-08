<template>
  <div class="min-h-screen bg-gradient-to-b from-bus-blue to-blue-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🚌</div>
        <h1 class="text-2xl font-bold text-gray-800">Control Diario</h1>
        <p class="text-gray-500 text-sm mt-1">Sistema para Choferes</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <input 
            type="text" 
            v-model="username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bus-blue focus:border-transparent"
            placeholder="Ingrese usuario"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input 
            type="password" 
            v-model="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bus-blue focus:border-transparent"
            placeholder="Ingrese contraseña"
            required
          >
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-bus-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Ingresar
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-400">
        <p>Usuario: gorditocachipurry</p>
        <p>Contraseña: seal2026</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (authStore.login(username.value, password.value)) {
    router.push('/dashboard')
  } else {
    error.value = 'Credenciales incorrectas'
  }
}
</script>