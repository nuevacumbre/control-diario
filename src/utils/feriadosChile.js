export const getFeriados = async () => {
  // API de feriados de Chile
  try {
    const response = await fetch('https://apis.digital.gob.cl/fl/feriados/2025')
    const data = await response.json()
    return data.map(f => ({
      fecha: f.fecha,
      nombre: f.nombre,
      tipo: f.tipo
    }))
  } catch (error) {
    console.error('Error loading holidays:', error)
    // Datos de ejemplo para desarrollo
    return [
      { fecha: '2025-01-01', nombre: 'Año Nuevo' },
      { fecha: '2025-04-18', nombre: 'Viernes Santo' },
      { fecha: '2025-05-01', nombre: 'Día del Trabajo' },
      { fecha: '2025-09-18', nombre: 'Independencia Nacional' },
      { fecha: '2025-12-25', nombre: 'Navidad' }
    ]
  }
}