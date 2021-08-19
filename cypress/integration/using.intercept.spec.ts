describe.skip('First Test with back end using intercept', () => {

    beforeEach('login to app', () => {
        cy.intercept('GET', '**/tags', {fixture:'tags.json'});

        // using  Router Matcher
        cy.intercept({method: 'GET', path: 'tags'}, {fixture:'tags.json'});

        cy.loginToApplication();
        console.log('logged in');
    });

    it('verify correct request and response', () => {

        // cy.intercept('POST', '**/articles').as('postArticles');
        cy.intercept('POST', '**/articles').as('postArticles'); 

        cy.contains('New Article').click();
        cy.get('[formcontrolname="title"]').type('This is the title');
        cy.get('[formcontrolname="description"]').type('This is a description');
        cy.get('[formcontrolname="body"]').type('This is the body of an article.');
        cy.contains('Publish Article').click();

        cy.wait('@postArticles');
        cy.get('@postArticles').then(xhr => {
            console.log('Logger ' + xhr);
            console.log('Status = ' + xhr.status);
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.body.article.body).to.equal('This is the body of an article.');
            expect(xhr.response.body.article.description).to.equal('This is a description');
        });
    });

    it('verify correct request and response with intercepting the request', () => {

        // cy.intercept('POST', '**/articles').as('postArticles');
        cy.intercept('POST', '**/articles', (req) => {
            req.body.article.description = "This is a description 2"
        }).as('postArticles'); 

        cy.contains('New Article').click();
        cy.get('[formcontrolname="title"]').type('This is the title');
        cy.get('[formcontrolname="description"]').type('This is a description');
        cy.get('[formcontrolname="body"]').type('This is the body of an article.');
        cy.contains('Publish Article').click();

        cy.wait('@postArticles');
        cy.get('@postArticles').then(xhr => {
            console.log('Logger ' + xhr);
            console.log('Status = ' + xhr.status);
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.body.article.body).to.equal('This is the body of an article.');
            expect(xhr.response.body.article.description).to.equal('This is a description 2');
        });
    });

    it('verify correct request and response with intercepting the response', () => {

        // cy.intercept('POST', '**/articles').as('postArticles');
        cy.intercept('POST', '**/articles', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('This is a description');                
                res.body.article.description  = "This is a description 2";
            })
        }).as('postArticles'); 

        cy.contains('New Article').click();
        cy.get('[formcontrolname="title"]').type('This is the title');
        cy.get('[formcontrolname="description"]').type('This is a description');
        cy.get('[formcontrolname="body"]').type('This is the body of an article.');
        cy.contains('Publish Article').click();

        cy.wait('@postArticles');
        cy.get('@postArticles').then(xhr => {
            console.log('Logger ' + xhr);
            console.log('Status = ' + xhr.status);
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.body.article.body).to.equal('This is the body of an article.');
            expect(xhr.response.body.article.description).to.equal('This is a description 2');
        });
    });

    it.skip('should get tags with routing object', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .should('contain', 'automation')
            .should('contain', 'testing');
    });
    it.skip('verify gloabal feed likes count', () => {
        cy.intercept('GET', '**/articles/feed*', {"articles": [],"articlesCount":0});
        cy.intercept('GET', '**/articles*', {fixture:'articles.json'});

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

    it.only('delete a new article in the global feed', () => {
        const userCreds = {
            "user": {
                "email": "cjoyce@jackhenry.com",
                "password": "IMS1Password2"
            }
        };
        const reqBody = {
            "article": {
                "taglist": [],
                "title": "Request from API",
                "description": "API testing is easy",
                "body": "Angular is cool"
            }
        }
        cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCreds)
            .its('body').then(body => {
                const token = body.user.token;

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