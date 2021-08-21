const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

const LOGIN_VIEWER_TEXT = "Welcome to Blue Vote";
const LOGIN_QUERY_STRING = "email=mycolki@gmail.com&&password=1111";

describe("GET /login", function () {
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

describe("POST /login", function () {
  it("should redirect to main", function (done) {
    request(app)
      .post("/login")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(LOGIN_QUERY_STRING)
      .expect(302)
      .expect("Location", "/")
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });
});
