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

  describe('GET /api/v1/bands', () => {
    it('should return all bands', () => {
      return chai.request(server)
        .get('/api/v1/bands')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(10);
          response.body[0].should.have.property('bandName');
          response.body[0].bandName.should.equal('TEST-REM');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/venues', () => {
    it('should return all venues', () => {
      return chai.request(server)
        .get('/api/v1/venues')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.have.property('venuesName');
          response.body[0].venuesName.should.equal('TEST-Red Rocks');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('shold return a specific user', () => {
      return chai.request(server)
        .get('/api/v1/users/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
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

    it('should not return a user if no user with that id exists', () => {
      return chai.request(server)
        .get('/api/v1/users/10')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No user for id 10');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/users/:id/favorite_bands', () => {
    it('should return an array of a users favorite bands', () => {
      return chai.request(server)
        .get('/api/v1/users/2/favorite_bands')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(5);
          response.body[0].should.have.property('bandId');
          response.body[0].should.have.property('usersId');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no favorite bands saved for that user', () => {
      return chai.request(server)
        .get('/api/v1/users/3/favorite_bands')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No favorite bands saved for user 3');   
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/users/:id/favorite_venues', () => {
    it('should return an array of a users favorite venues', () => {
      return chai.request(server)
        .get('/api/v1/users/1/favorite_venues')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('venueId');
          response.body[0].should.have.property('usersId');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no favorite venues saved for that user', () => {
      return chai.request(server)
        .get('/api/v1/users/3/favorite_venues')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No favorite venues saved for user 3');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/bands/:id/fans', () => {
    it('should return an array of bands fans', () => {
      return chai.request(server)
        .get('/api/v1/bands/1/fans')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('bandId');
          response.body[0].should.have.property('usersId');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no fans are following that band', () => {
      return chai.request(server)
        .get('/api/v1/bands/1000/fans')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No fans following to band 1000');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/venues/:id/fans', () => {
    it('should return an array of venues fans', () => {
      return chai.request(server)
        .get('/api/v1/venues/1/fans')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('venueId');
          response.body[0].should.have.property('usersId');
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no fans are following that venue', () => {
      return chai.request(server)
        .get('/api/v1/venues/1000/fans')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No fans following to venue 1000');
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing url param", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/bands_users/')
        .then(response => {
          response.should.have.status(404);
          done();
        })
        .catch(error => { throw error; });
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
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing url param", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/users_venues/')
        .then(response => {
          response.should.have.status(404);
          done();
        })
        .catch(error => { throw error; });
    });
  });

  describe('DELETE /api/v1/users/:userid/bands_users/:bandid', () => {
    it("should delete band from bands_users table", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/bands_users/1')
        .then(response => {
          response.should.have.status(204);
          done();
        })
        .catch(error => { throw error; });
    });
    it("should serve an error if band is not found", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/bands_users/100')
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('Nothing to delete with id 100');
          done();
        })
        .catch(error => { throw error; });
    });
  });

  describe('DELETE /api/v1/users/:userid/users_venues/:venueid', () => {
    it("should delete venue from users_venues table", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/users_venues/1')
        .then(response => {
          response.should.have.status(204);
          done();
        })
        .catch(error => { throw error; });
    });
    it("should serve an error if venue is not found", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/users_venues/100')
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('Nothing to delete with id 100');
          done();
        })
        .catch(error => { throw error; });
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it.skip("should update user in users table", (done) => {
      chai.request(server)
        .patch('/api/v1/users/1')
        .send({
          email: 'email@email.com'
        })
        .then(response => {
          response.should.have.status(204);
          done();
        })
        .catch(error => { throw error; });
    });
    it('should return 404 error for user that does not exist', (done) => {
      chai.request(server)
        .patch('/api/v1/users/100')
        .send({
          email: 'email@email.com'
        })
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('Could not find a user with id: 100');
          done();
        })
        .catch(error => { throw error; });
    });
  });


});
