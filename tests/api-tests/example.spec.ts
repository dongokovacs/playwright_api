import { test, expect } from '@playwright/test';


let authToken: string;

test.beforeAll(async ({request}) => {
  const loginRes = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: {
          email: 'kovacsdani04@gmail.com',
          password: '19900604'
        }
      }
  });
  const tokenRes = await loginRes.json();
  authToken = `Token ${tokenRes.user.token}`;
});

test.afterAll(async () => {
});
  test('GET test tags', async ({ request }) => {
    const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags', {
      headers: {
        Authorization: authToken
      }
    });
    expect(tagsResponse.ok()).toBeTruthy();
    expect(tagsResponse.headers()['content-type']).toContain('application/json');
    const tagsResponseJSON = await tagsResponse.json();
    expect(tagsResponseJSON).toHaveProperty('tags');
  });

  const newArticleTitle = 'My Articled';

  test('Create, delete article', async ({ request }) => {
    const articleRes = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
      data: {
        article: {
          title: newArticleTitle + ' create delete',
          description: 'Article description',
          body: 'Article body',
          tagList: ['tag1', 'tag2']
        }
      },
      headers: {
        Authorization: authToken
      }
    });

    const newArticleRes = await articleRes.json();
    expect(articleRes.status()).toEqual(201);

    const slugID = newArticleRes.article.slug;

    //delete the article
    const deleteNewArticleRes = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
      headers: {
        Authorization: authToken
      }
    });
    expect(deleteNewArticleRes.status()).toEqual(204);
  });

  test('Create, update, delete article', async ({ request }) => {
    const articleRes = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
      data: {
        article: {
          title: newArticleTitle,
          description: 'Article description',
          body: 'Article body',
          tagList: ['tag1', 'tag2']
        }
      },
      headers: {
        Authorization: authToken
      }
    });

    const newArticleRes = await articleRes.json();
    console.log(newArticleRes);
    expect(articleRes.status()).toEqual(201);
    expect(newArticleRes.article.title).toEqual(newArticleTitle);

    //get list of articles
    const articleListAfterCreate = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
      headers: {
        Authorization: authToken
      }
    });
    const articleListAfterCreateResJSON = await articleListAfterCreate.json();
    expect(articleListAfterCreateResJSON.articles[0].title).toEqual(newArticleTitle);
    const slugID = newArticleRes.article.slug;


    //put
    const updatedArticleRes = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
      data: {
        article: {
          title: newArticleTitle + ' edited',
          description: 'Article description edited',
          body: 'Article body edited',
          tagList: ['tag1', 'tag2', 'tag3']
        }
      },
      headers: {
        Authorization: authToken
      }
    });
    expect(updatedArticleRes.status()).toEqual(200);
    const updatedArticleResJSON = await updatedArticleRes.json();
    expect(updatedArticleResJSON.article.title).toEqual(newArticleTitle + ' edited');

    const newSlugID = updatedArticleResJSON.article.slug;

    //get list of articles after PUT
    const articleListAfterPUTRequest = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
      headers: {
        Authorization: authToken
      }
    });
    const articleListAfterPUTRequestResJSON = await articleListAfterPUTRequest.json();
    expect(articleListAfterPUTRequestResJSON.articles[0].title).toEqual(newArticleTitle + ' edited');

    //delete the updated article
    const deleteNewArticleRes = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugID}`, {
      headers: {
        Authorization: authToken
      }
    });
    expect(deleteNewArticleRes.status()).toEqual(204);
  });
