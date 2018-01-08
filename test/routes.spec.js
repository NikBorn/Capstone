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

  describe('GET /api/v1/shows', () => {
    it('should return all shows', () => {
      return chai.request(server)
        .get('/api/v1/shows')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('Test-Joe Russo Almost Dead');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('apiKey');
          response.body[0].apiKey.should.equal(12);
          response.body[0].should.have.property('venue');
          response.body[0].venue.should.equal('Red Rocks');
          response.body[0].should.have.property('date');
          response.body[0].date.should.equal('2018-06-023T07:00:00Z');
          response.body[0].should.have.property('latitude');
          response.body[0].latitude.should.equal('-105.028102');
          response.body[0].should.have.property('longitude');
          response.body[0].longitude.should.equal('39.723253');
          response.body[0].should.have.property('description');
          response.body[0].description.should.equal('New Years Eve at the Vail Ale House with amazingmusic provided by The Drunken Hearts and The Grant Farm');
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

  describe('GET /api/v1/users/email/:email', () => {
    it('shold return a specific user by email', () => {
      return chai.request(server)
        .get('/api/v1/users/email/nik@nik.com')
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

    it('should not return a user if no user with that email exists', () => {
      return chai.request(server)
        .get('/api/v1/users/email/nik@nik.coms')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No user for email');
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

  describe('GET /api/v1/users/:id/favorite_shows', () => {
    it('should return an array of a users favorite shows', () => {
      return chai.request(server)
        .get('/api/v1/users/1/favorite_shows')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('showId');
          response.body[0].should.have.property('usersId');
          response.body[0].usersId.should.equal(1);
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no favorite shows saved for that user', () => {
      return chai.request(server)
        .get('/api/v1/users/3/favorite_shows')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('No favorite shows saved for user 3');
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

  describe('GET /api/v1/shows/:id/fans', () => {
    it('should return an array of shows fans', () => {
      return chai.request(server)
        .get('/api/v1/shows/1/fans')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('showId');
          response.body[0].showId.should.equal(1);
          response.body[0].should.have.property('usersId');
          response.body[0].usersId.should.equal(1);
          response.body[0].should.have.property('id');
        })
        .catch(error => { throw error; });
    });
    it('should return an error if no fans are following that show', () => {
      return chai.request(server)
        .get('/api/v1/shows/1000/fans')
        .then(response => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.error.should.equal('No fans following to show 1000');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/bands/:id', () => {
    it('should return a band based on id', () => {
      return chai.request(server)
        .get('/api/v1/bands/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);       
          response.body[0].should.have.property('bandName');
          response.body[0].bandName.should.equal('TEST-REM');
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

  describe('POST /api/v1/shows', () => {
    it("should add new venue to shows table", (done) => {
      chai.request(server)
        .post('/api/v1/shows')
        .send({
          id: 25,
          title: 'Phil Lesh and Friends',
          apiKey: 15,
          venue: 'Terripain Crossroads',
          date: '2018-03-23T07:00:00Z',
          latitude: '-120.342',
          longitude: '45.876',
          description: 'Come see Phil, John Scofeild, John Molo and More.'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('Phil Lesh and Friends');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(25);
          response.body[0].should.have.property('apiKey');
          response.body[0].apiKey.should.equal(15);
          response.body[0].should.have.property('venue');
          response.body[0].venue.should.equal('Terripain Crossroads');
          response.body[0].should.have.property('date');
          response.body[0].date.should.equal('2018-03-23T07:00:00Z');
          response.body[0].should.have.property('latitude');
          response.body[0].latitude.should.equal('-120.342');
          response.body[0].should.have.property('longitude');
          response.body[0].longitude.should.equal('45.876');
          response.body[0].should.have.property('description');
          response.body[0].description.should.equal('Come see Phil, John Scofeild, John Molo and More.');
          done();
        })
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing parameter", (done) => {
      chai.request(server)
        .post('/api/v1/shows')
        .send({
          id: 25,
          title: 'Phil Lesh and Friends',
          venue: 'Terripain Crossroads',
          date: '2018-03-23T07:00:00Z',
          latitude: '-120.342',
          longitude: '45.876',
          description: 'Come see Phil, John Scofeild, John Molo and More.'
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

  describe('POST /api/v1/users/:userid/users_shows/:showid', () => {
    it("should add new favband ID and user ID to the users_show joins table", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/users_shows/1')
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('showId');
          response.body[0].showId.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('usersId');
          response.body[0].usersId.should.equal(1);
          done();
        })
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing url param", (done) => {
      chai.request(server)
        .post('/api/v1/users/1/users_shows/')
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

  describe('DELETE /api/v1/users/:userid/users_shows/:showsid', () => {
    it("should delete shows from users_shows table", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/users_shows/1')
        .then(response => {
          response.should.have.status(204);
          done();
        })
        .catch(error => { throw error; });
    });
    it.skip("should serve an error if venue is not found", (done) => {
      chai.request(server)
        .delete('/api/v1/users/1/users_shows/100')
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
