describe.skip('First Test with back end', () => {

    beforeEach('login to app', () => {
        cy.server();
        cy.route('GET', '**/tags', 'fixture:tags.json');
        // cy.loginToApplication();
        console.log('logged in');
    });

    it.skip('verify correct request and response', () => {

        // cy.intercept('POST', '**/articles').as('postArticles'); 
        cy.server();
        cy.route('POST', '**/articles').as('postArticles'); 

        cy.contains('New Article').click();
        cy.get('[formcontrolname="title"]').type('This is the title');
        cy.get('[formcontrolname="description"]').type('This is a description');
        cy.get('[formcontrolname="body"]').type('This is the body of an article.');
        cy.contains('Publish Article').click();

        cy.wait('@postArticles');
        cy.get('@postArticles').then(xhr => {
            console.log('Logger ' + xhr);
            console.log('Status = ' + xhr.status);
            expect(xhr.status).to.equal(200);
            expect(xhr.request.body.article.body).to.equal('This is the body of an article.');
            expect(xhr.response.body.article.description).to.equal('This is a description');
        });
    });

    it.skip('should get tags with routing object', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .should('contain', 'automation')
            .should('contain', 'testing');
    });
    it.skip('verify gloabal feed likes count', () => {
        cy.server();
        cy.route('GET', '**/articles/feed*', '{"articles": [],"articlesCount":0}');
        cy.route('GET', '**/articles*', 'fixture:articles.json');

        cy.contains('Global Feed').click();
        cy.get('app-article-list button').then(listOfButtons => {
            expect(listOfButtons[0]).to.contain('1'); //favorites Count
            expect(listOfButtons[1]).to.contain('5');
        });

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.route('POST', '**/articles/'+articleLink+'/favorite', file);
        });

        cy.get('app-article-list button').eq(1).click().should('contain', '6'); // increased by 1 for click
    });
});