const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

const users = {
  userArandomID: {
    id: "userArandomID",
    email: "a@a.co",
    password: "a",
  },
  userBrandomID: {
    id: "userBrandomID",
    email: "b@b.co",
    password: "b",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("a@a.co", users);
    const userId = "userArandomID";
    assert.strictEqual(user.id, userId, "pass!");
  });
});
