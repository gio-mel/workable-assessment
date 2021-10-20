/// <reference types="cypress" />
const email  = () => Cypress._.random(0, 1e6)
const filepath = '/example.json'
const dataTransfer = new DataTransfer;

describe('Test cases for dashboard page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/login').as('login')
    cy.intercept('POST', '/api/projects').as('postProject')
    cy.intercept('POST', '/api/projects/*/tasks').as('postTask')

    cy.visit('https://node-fs-app.herokuapp.com/')

    cy.get('#login')
      .should('be.visible')
      .and('have.text', 'Login')
      .click()

    cy.url().should('eq', 'https://node-fs-app.herokuapp.com/login')

    cy.get('#email')
      .focus()
      .type('test.user@mail.com')
    
    cy.get('#password')
      .focus()
      .type('test1234')

    cy.get('.btn.waves-effect.waves-light')
      .click()
      .wait('@login')
  })

  it('should create a new project', () => {
    cy.contains('There are no projects created yet. Start by creating some!')

    cy.get('.waves-effect.waves-light.btn')
      .should('contain', 'Create')
      .click()

    cy.url().should('eq', 'https://node-fs-app.herokuapp.com/createProject')

    cy.get('.invalid-feedback')
      .should('not.be.visible')

    cy.get('.waves-effect.waves-light.btn')
      .click()

    cy.get('.invalid-feedback')
      .should('be.visible')
      .and('have.length', 2)
      .and('have.css', 'color', 'rgb(255, 0, 0)')

    cy.get('#name')
      .focus()
      .type('test project')

    cy.get('#description')
      .focus()
      .type('test description')

    cy.get('.waves-effect.waves-light.btn')
      .click()
      .wait('@postProject')

    cy.get('.card-content.white-text')
      .children()
      .should('be.visible')

   cy.get('.card-action')
     .children()
     .should('be.visible')

  })

  it.only('should create a new task', () => {
    var project_id;

    cy.get('#btn_add_task')
      .should('contain','Add Task')
      .click()

    cy.url()
      .should('contain','https://node-fs-app.herokuapp.com/projects/')
      .and('contain','/createTask')
    
    cy.get('#summary')
      .focus()
      .type('summary')

    cy.get('#description')
      .focus()
      .type('description')
    
    cy.get('.select-wrapper')
      .click()

    cy.get('.dropdown-content.select-dropdown')
      .children()
      .should('have.length', 4)
      .then((children)=>{
        expect(children.eq(0)).to.have.text('TO DO')
        expect(children.eq(1)).to.have.text('IN PROGRESS')
        expect(children.eq(2)).to.have.text('IN REVIEW')
        expect(children.eq(3)).to.have.text('DONE')
      })

    cy.contains('IN PROGRESS')
      .click()

    cy.get('#search_input')
      .focus()

    cy.get('.optionContainer')
      .should('be.visible')
      .children()
      .should('have.length', 8)
      .then((children)=>{
        expect(children.eq(0)).to.have.text('backend')
        expect(children.eq(1)).to.have.text('frontend')
        expect(children.eq(2)).to.have.text('performance')
        expect(children.eq(3)).to.have.text('techdept')
        expect(children.eq(4)).to.have.text('ci')
        expect(children.eq(5)).to.have.text('jenkins')
        expect(children.eq(6)).to.have.text('design')
        expect(children.eq(7)).to.have.text('testing')
      })

    cy.contains('backend')
      .click()

    cy.get('#attachments').attachFile(filepath)

    cy.get('.btn.waves-effect.waves-light')
      .click()
      .wait('@postTask')
      .then(xhr => {
        project_id = xhr.response.body.task._projectId
        cy.url().should('eq', `https://node-fs-app.herokuapp.com/projects/${project_id}/tasks`)
      })

    cy.get('#in_progress_items')
      .children()
      .first()
      .should('be.visible')

    cy.get('.card-content.white-text')
      .find('#card_title')
      .should('be.visible')
      .and('have.text', 'summary')

    cy.get('.card-content.white-text')
      .find('#card_description')
      .should('be.visible')
      .and('have.text', 'description')

    cy.get('.card-content.white-text')
      .find('#card_label')
      .should('be.visible')
      .and('have.text', 'backend')

    cy.get('.card-content.white-text')
      .find('#card_attachments')
      .should('be.visible')
      .and('have.text', 'example.json')

    cy.get('.card-action')
      .find('#btn_update_task')
      .should('be.visible')
      .and('contain', 'Edit')

    cy.get('.card-action')
      .find('#btn_delete_task')
      .should('be.visible')
      .and('contain', 'delete')

  //     cy.get('.card.blue-grey.darken-1')
  //     .trigger('dragstart', { dataTransfer });

  // cy.get('#in_review_items')
  //     .trigger('drop', { dataTransfer });

  // cy.get('.card.blue-grey.darken-1')
  //     .trigger('dragend');

  // cy.get('#in_review_items')
  //   .find('card.blue-grey.darken-1')

  cy.get('.card.blue-grey.darken-1').drag('#in_review_items')

    cy.get('#in_review_items')
    .find('card.blue-grey.darken-1')

  })

  it('should create a new task', () => {
    cy.visit('https://node-fs-app.herokuapp.com/dashboard')

    cy.get('#btn_view_tasks')
      .click()

    cy.get('#btn_delete_task')
      .click()

    cy.get('.card.blue-grey.darken-1')
      .should('not.exist')
  })

})
