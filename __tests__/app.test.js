const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("healthCheck", () => {
  test("should receive status code of 200", () => {
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

    test("should respond with 404 error when endpoint not found", () => {
      return request(app).get("/api/toopiics").expect(404);
    });
  });
});

describe("/api", () => {
  describe("endpoints", () => {
    test("should return 200 status + object with all endpoints available ", () => {
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

