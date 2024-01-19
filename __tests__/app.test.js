const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("healthCheck", () => {
  test("Status code 200 - Health check on api", () => {
    return request(app).get("/api/healthCheck").expect(200);
  });
});

describe("GET", () => {
  describe("/api/topics", () => {
    test("Status code 200 - returns an array of topic objects, each of which should have the following properties: slug, description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(Array.isArray(topics)).toBe(true);
          expect(topics.length).toBeGreaterThan(0);
          topics.forEach((element) => {
            expect(typeof element.slug).toBe("string");
            expect(typeof element.description).toBe("string");
          });
        });
    });

    test("Status code 404 - invalid endpoint", () => {
      return request(app).get("/api/toopiics").expect(404);
    });
  });

  describe("/api/endpoints", () => {
    test("Status Code 200 - should return object with all endpoints available ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const mainBody = body.endpoints;
          expect(Object.keys(mainBody).length).toBeGreaterThan(0);
          expect(mainBody).toEqual(endPoints);
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    test("Status code 200 - returns article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toBeObject();
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: "11",
            })
          );
        });
    });

    test("Status code 404 - sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("Status code 400 - sends an appropriate status code and error message when given invalid id", () => {
      return request(app)
        .get("/api/articles/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("/api/articles", () => {
    test("Status code 200 - returns article object with correct properties ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const allArticles = body.articles;
          expect(Array.isArray(allArticles)).toBe(true);
          expect(allArticles.length).toBeGreaterThan(0);
          expect(allArticles).toBeSortedBy("created_at");
          allArticles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("Status code 200 - should return an array of comments for the given article_id with the correct properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const allComments = body.comments;
          expect(Array.isArray(allComments)).toBe(true);
          expect(allComments.length).toBeGreaterThan(0);
          expect(allComments).toBeSortedBy("created_at");
          allComments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });

    test("Status code 404 - sends an appropriate status and error message when given a valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comments not found");
        });
    });

    test("Status code 400 - sends an appropriate status and error message when given a invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalidId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("/api/users", () => {
    test("Status code 200 - returns an array of user objects with correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const usersArray = body.users;
          expect(Array.isArray(usersArray)).toBe(true);
          expect(usersArray.length).toBeGreaterThan(0);
          usersArray.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("/api/articles (topic query)", () => {
    test("Status 200 - Should respond with all articles filtered by topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const filteredArticles = body.articles;
          expect(Array.isArray(filteredArticles)).toBe(true);
          expect(filteredArticles.length).toBeGreaterThan(0);
          filteredArticles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });

    test("Status 200 - Should respond with an empty array when when given a valid topic with no articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const filteredArticles = body.articles;
          expect(Array.isArray(filteredArticles)).toBe(true);
          expect(filteredArticles.length).toBe(0);
        });
    });

    test("Status 404 - Should respond with correct error code when given an invalid query", () => {
      return request(app)
        .get("/api/articles?topic=invalid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid topic");
        });
    });

    test("Status 404 - Should respond with correct error when passed invalid query", () => {
      return request(app)
        .get("/api/articles?invalidQuery=mitch")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid query");
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("Status code 201 - Should add a comment for an article and respond with the posted comment", () => {
      const newComment = { username: "butter_bridge", body: "test body" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(Object.keys(body).length).toBeGreaterThan(0);
          expect(body.newComment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });

    test("Status code 404 - sends an appropriate status and error message when given a valid but non-existent id", () => {
      const newComment = { username: "butter_bridge", body: "test body" };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("Status code 400 - sends an appropriate status code and error message when given invalid id", () => {
      const newComment = { username: "butter_bridge", body: "test body" };
      return request(app)
        .post("/api/articles/invalidId/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("Status code 404 - Should return error if request does not contain correct key value pairs", () => {
      const newComment = { body: "test body" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test("Status code 200 - Should update comment votes and return the updated article", () => {
      const requestObj = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/1")
        .send(requestObj)
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body).length).toBeGreaterThan(0);
          expect(body.newArticle).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 105,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });

    test("Status code 404 - sends an appropriate status and error message when given a valid but non-existent id", () => {
      const requestObj = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/9999")
        .send(requestObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });

    test("Status code 400 - sends an appropriate status code and error message when given invalid id", () => {
      const requestObj = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/invalidId")
        .send(requestObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("Status code 404 - Should return error if request does not contain valid key", () => {
      const requestObj = { invalid_key: 5 };
      return request(app)
        .patch("/api/articles/1")
        .send(requestObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("Status code 404 - Should return error if request does not contain valid value data type", () => {
      const requestObj = { inc_votes: "invalid_data" };
      return request(app)
        .patch("/api/articles/1")
        .send(requestObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    test("Status code 204 - Should delete comment with provided id and not return anything", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("Status code 404 - sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
    });

    test("Status code 400 - sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
