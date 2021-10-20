/// <reference types="cypress" />
const email  = () => Cypress._.random(0, 1e6)

describe('Test cases for signup page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/').as('mainPage')

    cy.visit('https://node-fs-app.herokuapp.com/')
      .wait('@mainPage')

    cy.get('#signup')
      .should('be.visible')
      .and('have.text', 'Sign Up')
      .click()

    cy.url().should('eq', 'https://node-fs-app.herokuapp.com/signup')
  })

  it('should signup a new user', () => {

    cy.get('#fullName')
      .focus()
      .type('Giorgos Melissourgos')
    
    cy.get('#email')
      .focus()
      .type(email() + '@gmail.com')
    
    cy.get('#password')
      .focus()
      .type('18051990')

    cy.get('#company')
      .focus()
      .type('Workable')

    cy.get('#address')
      .focus()
      .type('Athinas 7')
    
    cy.get('.btn.waves-effect.waves-light')
      .click()
    
    cy.url().should('eq', 'https://node-fs-app.herokuapp.com/verifyAccount')

    cy.get('.card.blue-grey.darken-1')
      .should('have.text','Verify your accountSuccessfull registration, login to start using PPMTool')
      .and('be.visible')
  })

  it('should trigger error message and signup user with the 3 mandatory fields', () => {
    cy.get('.btn.waves-effect.waves-light')
      .click();

    cy.get('.input-field.col.s6')
      .find('.invalid-feedback')
      .should('have.length', 3);

  ['name', 'password', 'email'].forEach((element, index) =>{
    cy.get('.input-field.col.s6')
      .eq(index)
      .find('.invalid-feedback')
      .should('be.visible')
      .and('have.text', 'This field is required')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

    cy.get('#fullName')
      .focus()
      .type('Giorgos Melissourgos')
    
    cy.get('#email')
      .focus()
      .type(email() + '@gmail.com')
    
    cy.get('#password')
      .focus()
      .type('18051990')

    cy.get('.btn.waves-effect.waves-light')
      .click()
    
    cy.get('.card.blue-grey.darken-1')
      .should('have.text','Verify your accountSuccessfull registration, login to start using PPMTool')
      .and('be.visible')
  })
})
