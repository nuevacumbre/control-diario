<template>
  <div class="min-h-screen bg-gradient-to-b from-bus-blue to-blue-900 
              dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
      
      <!-- Header con toggle de tema -->
      <div class="flex justify-end mb-4">
        <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          <span v-if="isDark" class="text-xl">☀️</span>
          <span v-else class="text-xl">🌙</span>
        </button>
      </div>

      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🚌</div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Control Diario</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Sistema para Choferes</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Campo Usuario - CORREGIDO -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usuario
          </label>
          <input 
            type="text" 
            v-model="username"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                   rounded-lg focus:ring-2 focus:ring-bus-blue dark:focus:ring-pink-500 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Ingrese usuario"
            required
          >
        </div>

        <!-- Campo Contraseña - CORREGIDO -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <input 
            type="password" 
            v-model="password"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                   rounded-lg focus:ring-2 focus:ring-bus-blue dark:focus:ring-pink-500 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Ingrese contraseña"
            required
          >
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
          {{ error }}
        </div>

        <!-- Botón de login -->
        <button 
          type="submit"
          class="w-full bg-bus-blue hover:bg-blue-700 dark:bg-pink-600 dark:hover:bg-pink-700 
                 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Ingresar
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

// Tema
const isDark = ref(themeStore.isDark)
const toggleTheme = () => {
  themeStore.toggleTheme()
  isDark.value = themeStore.isDark
}

const handleLogin = () => {
  if (authStore.login(username.value, password.value)) {
    router.push('/dashboard')
  } else {
    error.value = 'Credenciales incorrectas'
  }
}
</script>