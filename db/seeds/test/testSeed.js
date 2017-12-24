const usersInfo = require('../../../data/test-usersData');
const bandsInfo = require('../../../data/test-bandsData');
const venuesInfo = require('../../../data/test-venueData');
const simpleUsers = require('../../../data/test-usersSimple');

const createBandUserJoin = (knex, band, user) => {

  return knex('users').where('name', user).first()
    .then(userRecord => {

      return knex('bands').where('bandName', band).first()
        .then(bandRecord => {
          return knex('bands_users').insert({
            bandId: bandRecord.id,
            usersId: userRecord.id
          });
        });
    });
};

const createUserVenueJoin = (knex, venue, user) => {
  return knex('users').where('name', user).first()
    .then(userRecord => {
      return knex('venues').where('venuesName', venue).first()
        .then(venueRecord => {
          return knex('users_venues').insert({
            venueId: venueRecord.id,
            usersId: userRecord.id
          });
        });
    });
};



exports.seed = function (knex, Promise) {
  return knex('users_venues').del()
    .then(() => knex('bands_users').del())
    .then(() => knex('venues').del())
    .then(() => knex('bands').del())
    .then(() => knex('users').del())
    .then(() => knex('bands').insert(bandsInfo, 'id'))
    .then(() => knex('venues').insert(venuesInfo, 'id'))
    .then(() => knex('users').insert(simpleUsers, 'id'))
    .then(() => {
      let pendingPromises = [];
      usersInfo.forEach(user => {
        let bands = user.favBands;
        let venues = user.favVenues;
        bands.forEach(band => {
          pendingPromises.push(createBandUserJoin(knex, band, user.name));
        });
        venues.forEach(venue => {
          pendingPromises.push(createUserVenueJoin(knex, venue, user.name));
        });
      });
      return Promise.all(pendingPromises);
    })
    .then(() => console.log('Test Seeding Complete!'))
    .catch(error => console.log({ error }));
};