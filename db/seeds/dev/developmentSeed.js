const usersInfo = require('../../../data/usersData');
const bandsInfo = require('../../../data/bandsData');
const showsInfo = require('../../../data/showsData');
const favBands = require('../../../data/bands_usersData');
const favShows = require('../../../data/usersShowsData');
const simpleUsers = require('../../../data/usersSimple');

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

const createUserShowJoin = (knex, show, user) => {
  return knex('users').where('name', user).first()
    .then(userRecord => {
      return knex('shows').where('title', show).first()
        .then(showRecord => {
          return knex('users_shows').insert({
            showId: showRecord.id,
            usersId: userRecord.id
          });
        });
    });
};



exports.seed = function (knex, Promise) {
  return knex('users_shows').del()
    .then(() => knex('bands_users').del())
    .then(() => knex('shows').del())
    .then(() => knex('bands').del())
    .then(() => knex('users').del())
    .then(() => knex('bands').insert(bandsInfo, 'id'))
    .then(() => knex('shows').insert(showsInfo, 'id'))
    .then(() => knex('users').insert(simpleUsers, 'id'))
    .then( () => {
      let pendingPromises = [];
      usersInfo.forEach(user => {
        let bands = user.favBands;
        let shows = user.favShows;
 
        bands.forEach(band => {
          pendingPromises.push(createBandUserJoin(knex, band, user.name));
        });
        shows.forEach(show => {
          pendingPromises.push(createUserShowJoin(knex, show, user.name));
        });
      });
      return Promise.all(pendingPromises);
    })
    .then(() => console.log('Dev Seeding Complete!'))
    .catch(error => console.log({ error }));
};
