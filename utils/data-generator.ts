import  articleRequestPayload  from '../request-objects/articles/POST-article.json';
import { faker } from '@faker-js/faker';

export function getRandomArticle() {
    //create clone of my object
    //recommended: deep cloning (independent copy), no mutation
    const articleRequest = structuredClone(articleRequestPayload);
    articleRequest.article.title = faker.lorem.words(3);
    articleRequest.article.description = faker.lorem.sentence();
    articleRequest.article.body = faker.lorem.paragraphs(2);
    articleRequest.article.tagList = [faker.lorem.word(), faker.lorem.word()];

    return articleRequest;
}