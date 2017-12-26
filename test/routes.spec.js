const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('API Routes', (done) => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done())
      .catch(error => { throw error; });
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done())
      .catch(error => { throw error; });
  });

  describe('GET /api/v1/users', () => {
    it('should return all users', () => {
      return chai.request(server)
        .get('/api/v1/users')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('TEST-nik');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('email');
          response.body[0].email.should.equal('nik@nik.com');
          response.body[0].should.have.property('preferredLocation');
          response.body[0].preferredLocation.should.equal('denver, co');
        })
        .catch(error => { throw error; });
    });
  });

  describe('POST /api/v1/users', () => {
    it("should add new users to users table", (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          id: 3,
          name: 'Jerry Garcia',
          email: 'jerry@theDead.com',
          preferredLocation: 'Denver, CO'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Jerry Garcia');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          response.body[0].should.have.property('email');
          response.body[0].email.should.equal('jerry@theDead.com');
          response.body[0].should.have.property('preferredLocation');
          response.body[0].preferredLocation.should.equal('Denver, CO');
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it("should display an error if request body is missing parameter", (done) => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          id: 3,
          name: 'Jerry Garcia',
          preferredLocation: 'Denver, CO'
        })
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('You are missing the email property');
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

});
