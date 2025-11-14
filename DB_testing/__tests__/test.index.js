const mongoose = require("mongoose");
const User = require("../models/user");
const fixtures = require("../fixtures");

const MONGO_URL = "mongodb://localhost:27017/aroundtheus";

beforeAll(() => {
  mongoose.connect(MONGO_URL);
});

afterAll(() => {
  return mongoose.disconnect();
});

describe("Database tests", () => {
  beforeEach(() => {
    return User.create(fixtures.user);
  });
  afterEach(() => {
    return User.deleteOne({ email: fixtures.user.email });
  });
  test("Returns created user data", () => {
    return User.findOne({ name: fixtures.user.name }).then((user) => {
      expect(user).toBeTruthy();
      expect(user.name).toBe(fixtures.user.name);
      expect(user.about).toBe(fixtures.user.about);
      expect(user.email).toBe(fixtures.user.email);
      expect(user.avatar).toBe(fixtures.user.avatar);
    });
  });
});
