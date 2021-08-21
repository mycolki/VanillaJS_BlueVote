const supertest = require('supertest');

const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe("login render", function () {
  it("should respond with login template", function (done) {
    request(app)
      .get("/login")
      .expect(200)
      .expect("Content-Type", /html/)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.text).to.include("Welcome to Blue Vote");
        done();
      });
  });
});
