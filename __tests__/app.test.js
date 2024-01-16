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

describe("/api/topics", () => {
  describe("GET", () => {
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
});

describe("/api", () => {
  describe("endpoints", () => {
    test("Status Code 200 - should return object with all endpoints available ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body).length).toBeGreaterThan(0);
          expect(body).toEqual(endPoints);
        });
    });
  });
});

describe("api/articles/:article_id", () => {
  describe("GET", () => {
    test("Status code 200 - returns article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toBeObject();
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.body).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
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
});
