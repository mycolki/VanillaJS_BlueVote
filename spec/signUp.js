const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

const SIGNUP_VIEWER_TEXT = "SIGN UP NOW";
const SIGNUP_QUERY_STRING = "email=newUser@gmail.com&&password=1234&&checkedPassword=1234";

describe("GET /signUp", function () {
  it("should respond with signUp template", function (done) {
    request(app)
      .get("/signUp")
      .expect(200)
      .expect("Content-Type", /html/)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.text).to.include(SIGNUP_VIEWER_TEXT);
        done();
      });
  });
});

describe("POST /signUp", function () {
  it("should redirect to login", function (done) {
    request(app)
      .post("/signUp")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(SIGNUP_QUERY_STRING)
      .expect(302)
      .expect("Location", "/login")
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });
});
