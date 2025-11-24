import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expects';
import { APILogger } from '../../utils/logger';
import { createToken } from '../../helpers/createToken';
import  articleRequestPayload  from '../../request-objects/articles/POST-article.json';
import { faker } from '@faker-js/faker';
import { getRandomArticle } from '../../utils/data-generator';

let authToken: string;

test.beforeAll(async ({api, config}) => {
  authToken = await createToken(config.userEmail, config.userPassword);
  console.log(authToken);

});

test.describe.skip('Articles and Tags API', () => {
    
  test('GET fluent interface design ARTICLES', async ({api}) => {
      const response = await api
                      .path('/api/articles')
                      .params({limit:10, offset:0})
                      .getRequest(200);
     //console.log(response);
      expect(response).toHaveProperty('articles');
      expect(response.articles.length).toEqual(10);
      await expect(response).shouldMatchSchema('articles', 'GET_articles');
  });

  test('GET fluent interface design tags', async ({api}) => {
      const response = await api
                      .path('/api/tags')
                      .getRequest(200);
      expect(response).toHaveProperty('tags');
      await expect(response).shouldMatchSchema('tags', 'GET_tags');
  });

  test('Create and delete article', async ({api}) => {
      articleRequestPayload.article.description = 'Test description added';
      // Create article
      const createResponse = await api
          .path('/api/articles')
          .headers({Authorization: authToken})
          .body(articleRequestPayload)
          .postRequest(201);
      expect(createResponse.article.title).toEqual(articleRequestPayload.article.title);
      expect(createResponse.article.description).toEqual('Test description added');
      await expect(createResponse).shouldMatchSchema('articles', 'POST_articles');
      const slugId = createResponse.article.slug;
      
      // Read first article
      const articleResponse = await api
          .path('/api/articles')
          .headers({Authorization: authToken})
          .params({ limit: 10, offset: 0, author: 'kovacsdani' })
          .getRequest(200);
      expect(articleResponse.articles[0].title).toEqual(articleRequestPayload.article.title);
      await expect(articleResponse).shouldMatchSchema('articles', 'GET_articles');

      // Delete article
      const deleteResponse = await api
          .path(`/api/articles/${slugId}`)
          .headers({Authorization: authToken})
          .deleteRequest(204);

      // Read first article after delete
      const articleResponse3 = await api
          .path('/api/articles')
          .headers({Authorization: authToken})
          .params({ limit: 10, offset: 0 })
          .getRequest(200);
      expect(articleResponse3.articles[0].title).not.toEqual(articleRequestPayload.article.title);
      await expect(articleResponse3).shouldMatchSchema('articles', 'GET_articles2');
  });

  test('Create update and delete article', async ({api}) => {
      //if run parallel avoid mixing data
      const articleRequest = getRandomArticle();
      articleRequest.article.description = faker.lorem.sentence();

      // Create article
      const createResponse = await api
          .path('/api/articles')
          .body(articleRequest)
          .postRequest(201);
      expect(createResponse.article.title).toEqual(articleRequest.article.title);
      expect(createResponse.article.description).toEqual(articleRequest.article.description);
      await expect(createResponse).shouldMatchSchema('articles', 'POST_articles');
      const slugId = createResponse.article.slug;
      console.log(slugId);

      // Update article
      const updateResponse = await api
          .path(`/api/articles/${slugId}`)
          .body(articleRequest)
          .putRequest(200)

      expect(updateResponse).toBeDefined();
      expect(updateResponse).toHaveProperty('article');
      expect(updateResponse.article.title).toEqual(articleRequest.article.title);
      await expect(updateResponse).shouldMatchSchema('articles', 'PUT_articles');
      const slugIdUpdated = updateResponse.article.slug;

      // Read first article
      const articleResponse = await api
          .path('/api/articles')
          .headers({Authorization: authToken})
          .params({ limit: 10, offset: 0, author: 'kovacsdani' })
          .getRequest(200);
      await expect(articleResponse).shouldMatchSchema('articles', 'GET_articles');

      // Delete article
      const deleteResponse = await api
          .path(`/api/articles/${slugIdUpdated}`)
          .headers({Authorization: authToken})
          .deleteRequest(204);

      // Read first article after delete
      const articleResponse2 = await api
          .path('/api/articles')
          .headers({Authorization: authToken})
          .params({ limit: 10, offset: 0 })
          .getRequest(200);
      expect(articleResponse2.articles[0].title).not.toEqual(articleRequest.article.title);
      await expect(articleResponse2).shouldMatchSchema('articles', 'GET_articles2');
  });

});

test.describe.skip('Utilities and Custom Expects', () => {

  test('API Logger test', async ({}) => {
      const logger = new APILogger();
      logger.logRequest('GET tags', 'www.conduit.com/api/tags', {Authorization: 'token'}, {foo: 'bar'});
      logger.logResponse(200, {tags: ['tag1', 'tag2']});

      const logs = logger.getRecentLogs();

      console.log('--- LOGS START ---');
      console.log(logs);
      console.log('--- LOGS END ---');
  });

  test('CUSTOM expect test', async ({api}) => {

      const response = await api
                      //.url('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
                      .params({limit:10, offset:0})
                      //.path('/api/tags')
                      .path('/api/articles')
                      .getRequest(200);

      expect(response.articles.length).toBeLessThan(11)

      const response2 = await api
                      .path('/api/tags')
                      .getRequest(200);

      expect(response2.tags[0]).shouldEqual('Test')
      expect(response2.tags.length).shouldBeLessThanOrEqual(10)
  });

});





