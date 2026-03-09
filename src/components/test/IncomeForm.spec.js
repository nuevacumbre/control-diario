import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IncomeForm from '../IncomeForm.vue'

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
})