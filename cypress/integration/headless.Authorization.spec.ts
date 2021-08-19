
describe('First Test with back end headless', () => {
it.only('delete a new article in the global feed', () => {
    
    const reqBody = {
        "article": {
            "taglist": [],
            "title": "Request from API",
            "description": "API testing is easy",
            "body": "Angular is cool"
        }
    };

    cy.loginToApplicationHeadless();

    cy.get('@token').then(token => {

            cy.request({
                url: 'https://conduit.productionready.io/api/articles',
                headers: {'Authorization': 'Token '+token},
                method: 'POST',
                body: reqBody
            }).then(response => {
                expect(response.status).to.equal(200);
            });

            cy.contains('Global Feed').click();
            cy.get('.article-preview').first().click();
            cy.get('.article-actions').contains('Delete Article').click();

            cy.request({
                url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token '+token},
                method: 'GET'
            }).its('body').then(body => {
                expect(body.articles[0].title).to.not.equal("Request from API");
            })
        });
});

});