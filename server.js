const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/api/v1/users', (request, response) => {
  database('users').select()
    .then(users => {
      return response.status(200).json(users);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/bands', (request, response) => {
  database('bands').select()
    .then(bands => {
      return response.status(200).json(bands);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/bands_users', (request, response) => {
  database('bands_users').select()
    .then(bands => {
      return response.status(200).json(bands);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/venues', (request, response) => {
  database('favorite_venues').select()
    .then(venues => {
      return response.status(200).json(venues);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:id', (request, response) => {
  database('users').where('id', request.params.id).select()
    .then(user => {
      if (user.length) {
        return response.status(200).json(user);
      } else {
        return response.status(404).json({ error: `No user for id ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:id/favorite_bands', (request, response) => { //needs updating
  database('bands_users').where('userId', request.params.id).select()
    .then(bands => {
      if (bands.length) {
        return response.status(200).json(bands);
      } else {
        return response.status(404).json({ error: `No favorite bands daved for user ${request.params.id}`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:id/favorite_venues', (request, response) => { //neds updating
  database('users_venues').where('userId', request.params.id).select()
    .then(venues => {
      if (venues.length) {
        return response.status(200).json(venues);
      } else {
        return response.status(404).json({ error: `No favorite bands saved for user ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/bands/:id/fans', (request, response) => {
  database('users_bands').where('bandId', request.params.id).select()
    .then(fans => {
      if (fans.length) {
        return response.status(200).json(fans);
      } else {
        return response.status(404).json({ error: `No fans following to band ${request.params.id}`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/venues/:id/fans', (request, response) => {
  database('users_venues').where('venueId', request.params.id).select()
    .then(fans => {
      if (fans.length) {
        return response.status(200).json(fans);
      } else {
        return response.status(404).json({ error: `No fans following to venue ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/users', (request, response) => {
  const newUser = request.body;
  console.log(request);

  for ( let requiredParameter of ['name', 'email', 'preferredLocation']) {
    if (!newUser[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('users').insert(newUser, '*')
    .then(insertedUser => response.status(201).json(insertedUser))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/bands', (request, response) => {
  const newBand = request.body;

  for ( let requiredParameter of ['bandName', 'apiKey']) {
    if (!newBand[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('bands').insert(newBand, '*')
    .then(insertedBand=> response.status(201).json(insertedBand))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/venues', (request, response) => {
  const newVenue = request.body;

  for ( let requiredParameter of ['venuesName', 'apiKey']) {
    if (!newVenue[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('venues').insert(newVenue, '*')
    .then(insertedVenue => response.status(201).json(insertedVenue))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/users/:id/bands_users/:bandid', (request, response) => {
  const { id } = request.params;
  const bandId  = request.body;
  console.log(bandId);
  const favoriteBand = Object.assign({}, {bandId: bandId}, {usersId: id});
  for ( let requiredParameter of ['bandId', 'usersId']) {
    if (!favoriteBand[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('bands_users').insert(favoriteBand, '*')
    .then(insertedBand => response.status(201).json(insertedBand))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/users/:id/users_venues', (request, response) => {
  const { id } = request.parmas;
  const { venueId } = request.body;
  const favoriteVenue = Object.assign({}, {venueId}, {userId: id});

  for ( let requiredParameter of ['venueId', 'usersId']) {
    if (!favoriteVenue[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('users_venues').insert(favoriteVenue, '*')
    .then(insertedVenue => response.status(201).json(insertedVenue))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});
