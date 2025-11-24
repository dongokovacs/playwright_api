
import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expects';
import { APILogger } from '../../utils/logger';




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
                    .params({limit:10, offset:0})
                    .path('/api/articles')
                    .getRequest(200);

    expect(response.articles.length).toBeLessThan(11)

    const response2 = await api
                    .path('/api/tags')
                    .getRequest(200);

    expect(response2.tags[0]).shouldEqual('Test')
    //expect(response2.tags.length).shouldBeLessThanOrEqual(10)
});





