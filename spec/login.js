const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

describe("login_ GET", function () {
  const LOGIN_VIEWER_TEXT = "Welcome to Blue Vote";

  it("should respond with login template", function (done) {
    request(app)
      .get("/login")
      .expect(200)
      .expect("Content-Type", /html/)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.text).to.include(LOGIN_VIEWER_TEXT);
        done();
      });
  });
});

describe("login_ POST", function () {
  it("should respond with main template", function (done) {
    request(app)
      .post("/login")
      .expect(302)
      .expect("Location", "/")
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });
});
