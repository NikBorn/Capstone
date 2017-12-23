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
  database('favorite_bands').select()
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

app.get('/api/v1/users/:id/favorite_bands', (request, response => { //needs updating
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
}));

app.get('/api/v1/users/:id/favorite_venues', (request, response => { //neds updating
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
}));

app.get('/api/v1/bands/:id/fans', (request, response => {
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
}));

app.get('/api/v1/venues/:id/fans', (request, response => {
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
}));

app.post('/api/v1/users', (request, response) => {
  const { name, email, preferredLocation } = request.body;

  for ( let requiredParameter of ['name', 'usersId']) {
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

app.post('/api/v1/users/:id/bands_users', (request, response) => {
  const { id } = request.parmas;
  const { bandId } = request.body;
  const favoriteBand = Object.assign({}, {bandId}, {userId: id});

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
