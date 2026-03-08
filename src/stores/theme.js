import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Leer tema guardado o preferencia del sistema
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved === 'dark'
      }
      // Si no hay guardado, usar preferencia del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (error) {
      console.error('Error leyendo tema:', error)
      return false
    }
  }

  const isDark = ref(getInitialTheme())

  const applyTheme = () => {
    try {
      console.log('Aplicando tema:', isDark.value ? 'oscuro' : 'claro')
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
      // Forzar actualización de estilos
      document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
      
      // Disparar evento personalizado para que otros componentes reaccionen
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: isDark.value } }))
    } catch (error) {
      console.error('Error aplicando tema:', error)
    }
  }

  const toggleTheme = () => {
    console.log('Toggle theme - antes:', isDark.value)
    isDark.value = !isDark.value
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch (error) {
      console.error('Error guardando tema:', error)
    }
    applyTheme()
    console.log('Toggle theme - después:', isDark.value)
  }

  const initTheme = () => {
    console.log('Inicializando tema...')
    applyTheme()
  }

  // Watch para cambios
  watch(isDark, () => {
    applyTheme()
  })

  return { isDark, toggleTheme, initTheme }
})