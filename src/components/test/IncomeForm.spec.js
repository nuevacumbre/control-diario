import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IncomeForm from '../IncomeForm.vue' // Asegúrate que la ruta sea correcta

describe('IncomeForm', () => {
  it('renders form correctly', () => {
    const wrapper = mount(IncomeForm)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('validates amount input', async () => {
    const wrapper = mount(IncomeForm)
    const amountInput = wrapper.find('input[type="number"]')
    
    await amountInput.setValue(1000)
    expect(amountInput.element.value).toBe('1000')
    
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted().submit).toBeTruthy()
  })

  it('handles checkbox toggle', async () => {
    const wrapper = mount(IncomeForm)
    const checkbox = wrapper.find('input[type="checkbox"]')
    
    await checkbox.setValue(true)
    expect(checkbox.element.checked).toBe(true)
  })

  it('handles viatico input', async () => {
    const wrapper = mount(IncomeForm)
    const viaticoInput = wrapper.findAll('input[type="number"]')[1] // Segundo input number
    
    await viaticoInput.setValue(10000)
    expect(viaticoInput.element.value).toBe('10000')
  })

  it('emits submit event with form data', async () => {
    const wrapper = mount(IncomeForm)
    
    // Llenar el formulario
    await wrapper.find('input[placeholder*="Ej: Santiago"]').setValue('Viaje de prueba')
    await wrapper.findAll('input[type="number"]')[0].setValue(50000)
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.findAll('input[type="number"]')[1].setValue(10000)
    
    // Enviar formulario
    await wrapper.find('form').trigger('submit')
    
    // Verificar el evento emitido
    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toMatchObject({
      description: 'Viaje de prueba',
      amount: 50000,
      colacion: true,
      viatico: 10000
    })
  })
})