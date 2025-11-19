
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

//https://transform.tools/json-to-json-schema


test('GET tags SCHEMA validation', async ({api}) => {
    const response = await api
                            .path('/api/tags')
                            .getRequest(200);
    //await validateSchema('tags', 'GET_tags',response);
    await expect(response).shouldMatchSchema('tags', 'GET_tags');
});

test('GET fluent interface design tags', async ({api}) => {
    const response = await api
                    .path('/api/tags')
                    .getRequest(200);
    expect(response).toHaveProperty('tags');
    await expect(response).shouldMatchSchema('tags', 'GET_tags');
});

test('GET all articles', async ({ api }) => {
    const articlesResponse = await api
                            .path('/api/articles?limit=10&offset=0')
                            .getRequest(200);
    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles');
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
                            .body({ article })
                            .postRequest(201);
    await expect(createResponse).shouldMatchSchema('articles', 'POST_articles');
    const slugId = createResponse.article.slug;
    
    // Read first article
    const articleResponse = await api
                            .path('/api/articles')
                            .params({ limit: 10, offset: 0, author: 'kovacsdani' })
                            .getRequest(200);
    expect(articleResponse.articles[0].title).toEqual(article.title);

    // Delete article
    const deleteResponse = await api
                            .path(`/api/articles/${slugId}`)
                            .deleteRequest(204);

    // Read first article after delete
    const articleResponse2 = await api
                            .path('/api/articles')
                            .params({ limit: 10, offset: 0 })
                            .getRequest(200);
    await expect(articleResponse2).shouldMatchSchema('articles', 'GET_articles2');
    expect(articleResponse2.articles[0].title).not.toEqual(article.title);
});






