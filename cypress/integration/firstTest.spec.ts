describe('First Test with back end', () => {

    beforeEach('login to app', () => {
        cy.loginToApplication();
        console.log('logged in');
    });

    it('verify correct request and response', () => {

        cy.intercept('POST', '**/articles').as('postArticles'); 

        cy.contains('New Article').click();
        cy.get('[formcontrolname="description"]').type('This is a description');
        cy.get('[formcontrolname="body"]').type('This is a body of an article.');
        cy.contains('Publish Article').click();

        cy.wait('@postArticles');
        cy.get('@postArticles').then(xhr => {
            console.log(xhr);
            expect(xhr.status).to.equal(200);
        })

    });
});