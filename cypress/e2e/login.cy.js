describe('Login Flow', () => {
  it('should login with correct credentials', () => {
    cy.visit('/')
    cy.get('input[name="username"]').type('gorditocachipurry')
    cy.get('input[name="password"]').type('seal2026')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should show error with wrong credentials', () => {
    cy.visit('/')
    cy.get('input[name="username"]').type('wrong')
    cy.get('input[name="password"]').type('wrong')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciales incorrectas').should('be.visible')
  })
})

describe('Daily Register', () => {
  beforeEach(() => {
    cy.login('gorditocachipurry', 'seal2026')
  })

  it('should add new income entry', () => {
    cy.visit('/dashboard')
    cy.get('button.fixed').click()
    cy.get('input[placeholder="Descripción"]').type('Viaje mañana')
    cy.get('input[type="number"]').type('5000')
    cy.get('button[type="submit"]').click()
    cy.contains('Viaje mañana').should('be.visible')
  })
})