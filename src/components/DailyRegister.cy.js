import DailyRegister from './DailyRegister.vue'

describe('<DailyRegister />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(DailyRegister)
  })
})