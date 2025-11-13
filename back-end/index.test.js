const supertest = require("supertest");
const app = require("./app.js");

const request = supertest(app);

describe("Endpoints respond to requests", () => {
  test("Returns data and status 200 on request to '/'", () => {
    return request.get("/").then((res) => {
      expect(res.status).toBe(200);
      expect(res.text).toBe("Hello, world!");
    });
  });
  test("Returns user data and status 201 on request to '/users'", () => {
    return request.post("/users").then((res) => {
      expect(res.status).toBe(201);
      expect(res.headers["content-type"]).toContain("application/json");
      expect(res.body.message).toBe("success");
      expect(res.body.data.isDeveloper).toBeTruthy();
      expect(res.body.data.followersOnGithub).toBeGreaterThan(10);
    });
  });
});
