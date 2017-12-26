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

  describe('POST /api/v1/bands', () => {
    it("should add new band to bands table", (done) => {
      chai.request(server)
        .post('/api/v1/bands')
        .send({
          id: 25,
          bandName: 'The Grateful Dead',
          apiKey: 29
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('bandName');
          response.body[0].bandName.should.equal('The Grateful Dead');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(25);
          response.body[0].should.have.property('apiKey');
          response.body[0].apiKey.should.equal(29);
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
          id: 25,
          bandName: 'The Grateful Dead'
        })
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('You are missing the name property');
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/venues', () => {
    it("should add new venue to venuess table", (done) => {
      chai.request(server)
        .post('/api/v1/venues')
        .send({
          id: 25,
          venuesName: 'Ogden Theater',
          apiKey: 15
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('venuesName');
          response.body[0].venuesName.should.equal('Ogden Theater');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(25);
          response.body[0].should.have.property('apiKey');
          response.body[0].apiKey.should.equal(15);
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it("should display an error if request body is missing parameter", (done) => {
      chai.request(server)
        .post('/api/v1/venues')
        .send({
          id: 25,
          venuesName: 'Ogden Theater'
        })
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('You are missing the apiKey property');
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/users/:id/bands_users/:bandid', () => {
    it("should add new favband ID and user ID to the bands_users joins table", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/bands_users/1')
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('bandId');
          response.body[0].bandId.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('usersId');
          response.body[0].usersId.should.equal(1);
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it("should display an error if request body is missing url param", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/bands_users/')
        .then(response => {
          response.should.have.status(404);
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/users/:userid/users_venues/:venueid', () => {
    it("should add new favband ID and user ID to the users_venues joins table", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/users_venues/1')
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('venueId');
          response.body[0].venueId.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('usersId');
          response.body[0].usersId.should.equal(1);
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it("should display an error if request body is missing url param", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/users_venues/')
        .then(response => {
          response.should.have.status(404);
          done();
        })
        .catch(error => {
          throw error;
        });
    });
  });

});
