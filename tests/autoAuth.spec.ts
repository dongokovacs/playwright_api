
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expects';
import { APILogger } from '../utils/logger';




test('Create update and delete article', async ({api}) => {
    const article = {
        title: 'NEW Test Article',
        description: 'This is a  NEW test article',
        body: 'This is the body of the test article',
        tagList: ['test', 'article']
    };

    // Create article
    const createResponse = await api
        .path('/api/articles')
        .body({ article })
        .postRequest(201);
    expect(createResponse.article.title).toEqual(article.title);
    const slugId = createResponse.article.slug;

    // Update article
    const updateResponse = await api
        .path(`/api/articles/${slugId}`)
        .body({ "article": { "title": "Hello World", "description": "Hello World", "body": "HELLO", "tagList": [] } })
        .putRequest(200);
    const slugIdUpdated = updateResponse.article.slug;

    // Read first article
    const articleResponse = await api
        .path('/api/articles')
        .params({ limit: 10, offset: 0, author: 'kovacsdani' })
        .getRequest(200);

    // Delete article
    const deleteResponse = await api
        .path(`/api/articles/${slugIdUpdated}`)
        .deleteRequest(204);

    // Read first article after delete
    const articleResponse2 = await api
        .path('/api/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articleResponse2.articles[0].title).not.toEqual(article.title);
});

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
    expect(response.articlesCount).shouldEqual(10)

    const response2 = await api
                              .path('/api/tags')
                              .getRequest(200);

    expect(response2.tags[0]).shouldEqual('Test')
    expect(response2.tags.length).shouldBeLessThanOrEqual(10)
});





