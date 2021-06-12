const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
// const expect = chai.expect;
const server = require('../server');
const IssueModel = require('../models/issue.model.js')

chai.use(chaiHttp);

// Test Objects
const detailedIssue = new IssueModel({
  issue_title: "Chai Test I",
  issue_text: "This is a Chai test with all fields",
  created_by: "API Developer",
  assigned_to: "Adam Nobody",
  open: false,
  status_text: "Closed"
})

const requiredFieldsIssue = new IssueModel({
  issue_title: "Chai Test II",
  issue_text: "This is a Chai test with only the required fields",
  created_by: "API Developer",
})

const incompleteIssue = new IssueModel({
  status_text: "Unresolved"
})

const singleFieldUpdate = {
  _id: "60c4011812dddb0c5da5347b",
  open: true
}

const multiFieldUpdate = {
  _id: "60c4011812dddb0c5da5347b",
  open: false,
  issue_title: "Update Test",
  issue_text: "updated field"
}

const idOnly = {_id: "60c4011812dddb0c5da5347b"}


// Test Suite
suite('Functional Tests', function () {

  // #1 Create an issue with every field: POST request to /api/issues/{project}
  test('POST an issue with every field', function (done) {
    chai
      .request(server)
      .post("/api/issues/chaitest")
      .send(detailedIssue)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.issue_title, "Chai Test I")
        assert.equal(res.body.issue_text, "This is a Chai test with all fields")
        assert.equal(res.body.created_by, "API Developer")
        assert.equal(res.body.assigned_to, "Adam Nobody")
        assert.equal(res.body.status_text, "Closed")
        assert.isBoolean(res.body.open)

        done();
      })
  });
  // #2 Create an issue with only required fields: POST request to /api/issues/{project}
  test('POST an issue with required fields only', function (done) {
    chai
      .request(server)
      .post("/api/issues/chaitest")
      .send(requiredFieldsIssue)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.issue_title, "Chai Test II")
        assert.equal(res.body.issue_text, "This is a Chai test with only the required fields")
        assert.equal(res.body.created_by, "API Developer")

        done();
      })
  });
  // #3 Create an issue with missing required fields: POST request to /api/issues/{project}
  test('POST an issue without the required fields', function (done) {
    chai
      .request(server)
      .post("/api/issues/chaitest")
      .send(incompleteIssue)
      .end((err, res) => {
        assert.equal(res.status, 200) // should be 400, but FCC expects 200
        assert.equal(res.type, "application/json")
        assert.equal(res.body.error, "required field(s) missing")

        done()
      })
  });
  // #4 View issues on a project: GET request to /api/issues/{project}
  test('GET list of all issues for a project', function (done) {
    chai
      .request(server)
      .get("/api/issues/chaitest")
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")

        done()
      })
  })
  // #5 View issues on a project with one filter: GET request to /api/issues/{project}
  test('GET list of issues for a project with one filter', function (done) {
    chai
      .request(server)
      .get("/api/issues/chaitest?open=false")
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")

        done()
      })
  })
  // #6 View issues on a project with multiple filters: GET request to /api/issues/{project}
  test('GET list of issues for a project with multiple filters', function (done) {
    chai
      .request(server)
      .get("/api/issues/chaitest?open=false&assigned_to=Adam%20Nobody&requested_by=API%20Developer")
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")

        done()
      })
  })
  // #7 Update one field on an issue: PUT request to /api/issues/{project}
  test('PUT request to update one field', function (done) {
    chai
      .request(server)
      .put("/api/issues/chaitest")
      .send(singleFieldUpdate)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.result, "successfully updated")

        done()
      })
  })
  // #8 Update multiple fields on an issue: PUT request to /api/issues/{project}
  test('PUT request to update multiple fields', function (done) {
    chai
      .request(server)
      .put("/api/issues/chaitest")
      .send(multiFieldUpdate)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.result, "successfully updated")

        done()
      })
  })
  // #9 Update an issue with missing _id: PUT request to /api/issues/{project}
  test('PUT request to update with missing _id', function (done) {
    chai
      .request(server)
      .put("/api/issues/chaitest")
      .send({ open: true })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.error, "missing _id")

        done()
      })
  })
  // #10 Update an issue with no fields to update: PUT request to /api/issues/{project}
  test('PUT request to update with only the _id', function (done) {
    chai
      .request(server)
      .put("/api/issues/chaitest")
      .send(idOnly)
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.error, "no update field(s) sent")

        done()
      })
  })
  // #11 Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test('PUT request with imvalid _id', function (done) {
    chai
      .request(server)
      .put("/api/issues/chaitest")
      .send({ _id: "invalid_id" })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.type, "application/json")
        assert.equal(res.body.error, "no update field(s) sent")

        done()
      })
  })
  // #12 Delete an issue: DELETE request to /api/issues/{project}
  // #13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // #14 Delete an issue with missing _id: DELETE request to /api/issues/{project}

});
