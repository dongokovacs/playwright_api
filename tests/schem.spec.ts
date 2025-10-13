
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expects';
import { APILogger } from '../utils/logger';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';

let authToken: string;

test.beforeAll(async ({api, config}) => {
  authToken = await createToken(config.userEmail, config.userPassword);
  console.log(authToken);

});
    
test.only('GET articles SCHEMA validation', async ({api}) => {
    const response = await api
                              //.url('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
                               //.path('/api/tags')
                              .path('/api/articles')
                              .params({limit:10, offset:0})
                              .getRequest(200);
    expect(response).toHaveProperty('articles');
    expect(response.articles.length).toEqual(10);
    await validateSchema('tags', 'GET_tags');
});

test('GET fluent interface design tags', async ({api}) => {
    const response = await api
                              .path('/api/tags')
                              .getRequest(200);
    expect(response).toHaveProperty('tags');
});

test('Create and delete article', async ({api}) => {
    const article = {
        title: 'Test Article',
        description: 'This is a test article',
        body: 'This is the body of the test article',
        tagList: ['test', 'article']
    };

    // Create article
    const createResponse = await api
        .path('/api/articles')
        .headers({Authorization: authToken})
        .body({ article })
        .postRequest(201);
    expect(createResponse.article.title).toEqual(article.title);
    const slugId = createResponse.article.slug;
    
    // Read first article
    const articleResponse = await api
        .path('/api/articles')
        .headers({Authorization: authToken})
        .params({ limit: 10, offset: 0, author: 'kovacsdani' })
        .getRequest(200);
    expect(articleResponse.articles[0].title).toEqual(article.title);

    // Delete article
    const deleteResponse = await api
        .path(`/api/articles/${slugId}`)
        .headers({Authorization: authToken})
        .deleteRequest(204);

    // Read first article after delete
    const articleResponse2 = await api
        .path('/api/articles')
        .headers({Authorization: authToken})
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articleResponse2.articles[0].title).not.toEqual(article.title);
});






