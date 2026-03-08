<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  authStore.checkAuth()
  themeStore.initTheme()
  
  // Prevenir el error de elementFromPoint
  document.addEventListener('selectionchange', () => {
    // No hacer nada, solo prevenir el error
  }, { passive: true })
})
</script>