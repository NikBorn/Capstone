const usersInfo = require('../../../data/usersData');
const bandsInfo = require('../../../data/bandsData');
const venuesInfo = require('../../../data/venueData');
const favBands = require('../../../data/bands_usersData');
const favVenues = require('../../../data/usersVenuesData');

const createBandUserJoin = (knex, band, user) => {
  console.log('user', user)
  return knex('users').where('name', user).first()
    .then(userRecord => {
      console.log('userRecord', userRecord)
      return knex('bands').where('bandName', band).first()
        .then(bandRecord => {
            console.log(userRecord)
            console.log(bandRecord)
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
          return knex('bands_users').insert({
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
    .then(() => {
      let userObjects = []
      usersInfo.forEach(user => {
        userObjects.push({ name: user.name, email: user.email, preferredLocation: user.preferredLocation })
      })
      console.log(userObjects)
      knex('users').insert(userObjects, 'id')
    })
    .then( () => {
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

    .then(() => console.log('Dev Seeding Complete!'))
    .catch(error => console.log({ error }));
};

