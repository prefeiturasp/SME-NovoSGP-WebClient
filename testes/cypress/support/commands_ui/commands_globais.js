Cypress.Commands.add('configurar_visualizacao', (device) => {
	switch (device) {
	case 'web':
		cy.viewport(1920, 1080)
		break
	default:
		break
	}
})

Cypress.Commands.add('carregandoMenus', () => {
    cy.wait('@menus', { timeout: 60000 }).its('response.statusCode').should('eq', 200)
})