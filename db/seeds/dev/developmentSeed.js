// const createVenue = (knex, venue, fan) => {
//   return knex('users').where('id', fan).first()
//     .then(venueRecord => {
//       return knex('favorite_venues').insert({//pretty sure I need to be doing a check here to see if band is already in the table
//         name: venue.name,
//         fans: [...fan]
//       });
//     });
// };

// const createBand = (knex, band, fan) => {
//   return knex('users').where('id', fan).first()
//     .then(bandRecord => {
//       return knex('favorite_bands').insert({
//         name: band.name,
//         fans: [...fan]
//       });
//     });
// };

const usersInfo = require('../../../data/usersData');
const bandsInfo = require('../../../data/bandsData');
const venuesInfo = require('../../../data/venueData');
const favBands = require('../../../data/bands_usersData');
const favVenues = require('../../../data/usersVenuesData');



exports.seed = function (knex, Promise) {
  return knex('favorite_bands_join').del()
    .then(() => knex('favorite_venues_join').del())
    .then(() => knex('favorite_bands').del())
    .then(() => knex('favorite_venues').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert(usersInfo, 'id'))
    .then(() => knex('bands').insert(bandsInfo, 'id'))
    .then(() => knex('venues').insert(venuesInfo, 'id'))
    .then(() => knex('bands_users').insert(

    ))
    // .then(() => {
    //   let favVenuesPromises = [];
    //   favVenuesData.forEach(venue => {
    //     let fans = venue.fans;
    //     fans.forEach(fan => {
    //       favVenuesPromises.push(createVenue(knex, venue, fan));
    //     });
    //   });
    // })
    // .then(() => {
    //   let favBandsPromises = [];
    //   favBandsData.forEach(band => {
    //     let fans = bands.fans;
    //     fans.forEach(fan => {
    //       favBandsPromises.push(createBand(knex, band, fan));
    //     });
    //   });
    // });
};

