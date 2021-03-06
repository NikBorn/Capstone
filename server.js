const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use((request, response, next)=>{
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

app.get('/api/v1/bands/:id', (request, response) => {
  database('bands').where('id', request.params.id).select()
    .then(band => {
      if (band.length) {
        return response.status(200).json(band);
      } else {
        return response.status(404).json({ error: `No bandname for id ${request.params.id}`});
      }
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

app.get('/api/v1/shows', (request, response) => {
  database('shows').select()
    .then(shows => {
      return response.status(200).json(shows);
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

app.get('/api/v1/users/email/:email', (request, response) => {
  database('users').where('email', request.params.email).select()
    .then(user => {
      if (user.length) {
        return response.status(200).json(user);
      } else {
        return response.status(404).json({ error: `No user for email` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:id/favorite_bands', (request, response) => { //needs updating
  database('bands_users').where('usersId', request.params.id).select()
    .then(bands => {
      if (bands.length) {
        return response.status(200).json(bands);
      } else {
        return response.status(404).json({ error: `No favorite bands saved for user ${request.params.id}`});
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/shows/:id', (request, response) => { //needs updating
  database('shows').where('id', request.params.id).select()
    .then(shows => {
      if (shows.length) {
        return response.status(200).json(shows);
      } else {
        return response.status(404).json({ error: `No favorite shows saved for ID ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/users/:id/favorite_shows', (request, response) => { //neds updating
  database('users_shows').where('usersId', request.params.id).select()
    .then(shows => {
      if (shows.length) {
        return response.status(200).json(shows);
      } else {
        return response.status(404).json({ error: `No favorite shows saved for user ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/bands/:id/fans', (request, response) => {
  database('bands_users').where('bandId', request.params.id).select()
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

app.get('/api/v1/shows/:id/fans', (request, response) => {
  database('users_shows').where('showId', request.params.id).select()
    .then(fans => {
      if (fans.length) {
        return response.status(200).json(fans);
      } else {
        return response.status(404).json({ error: `No fans following to show ${request.params.id}` });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/users', (request, response) => {
  const newUser = request.body;

  for ( let requiredParameter of ['name', 'email']) {
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

  for ( let requiredParameter of ['bandName']) {
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

app.post('/api/v1/shows', (request, response) => {
  const newShow = request.body;
  for (let requiredParameter of ['title', 'apiKey', 'venue', 'date', 'latitude', 'longitude', 'description']) {
    if (!newShow[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('shows').insert(newShow, '*')
    .then(insertedShow => response.status(201).json(insertedShow))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/users/:userid/bands_users/:bandid', (request, response) => {
  const { userid, bandid } = request.params;

  const favoriteBand = Object.assign({}, {bandId: bandid}, {usersId: userid});


  database('bands_users').insert(favoriteBand, '*')
    .then(insertedBand => response.status(201).json(insertedBand))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.post('/api/v1/users/:userid/users_shows/:showid', (request, response) => {
  const { userid, showid } = request.params;

  const favoriteShow = Object.assign({}, {usersId: userid}, {showId: showid});

  database('users_shows').insert(favoriteShow, '*')
    .then(insertedShow => response.status(201).json(insertedShow))
    .catch(error => response.status(500).json({ error: `Internal Server Error ${error}`}));
});

app.delete('/api/v1/users/:userid/bands_users/:bandid', (request, response) => {
  const { userid, bandid } = request.params;

  database('bands_users').where({usersId: userid,
    bandId: bandid}).del()
    .then(band => band ?
      response.sendStatus(204)
      :
      response.status(422).json({ error: `Nothing to delete with id ${bandid || userId}`})
    )
    .catch(error =>  response.status(500).json({ error }));
});

app.delete('/api/v1/users/:userid/users_shows/:showid', (request, response) => {
  const { userid, showid } = request.params;

  database('users_shows').where({usersId: userid,
    showId: showid}).del()
    .then(show => show  ?
      response.sendStatus(204)
      :
      response.status(422).json({ error: `Nothing to delete with id ${showId || userId}` })
    )
    .catch(error =>  response.status(500).json({ error }));
});

app.patch('/api/v1/users/:id', (request, response) => {
  let { email, preferredLocation } = request.body;
  const { id } = request.params;

  if (email){
    database('users').where('id', id).update('email', email)
      .then(updatedUser => {
        updatedUser ? response.status(204)
          :
          response.status(404).json({
            error: `Could not find a user with id: ${id}`
          });
      })
      .catch(error => response.status(500).json({error: `internal server error ${error}`}));
  }

  if (preferredLocation){
    database('users').where('id', id).update('preferredLocation', preferredLocation)
      .then(updatedUser => {
        updatedUser ? response.status(204)
          :
          response.status(404).json({
            error: `Could not find a user with id: ${id}`
          });
      })
      .catch(error => response.status(500).json({error: `internal server error ${error}`}));
  }

});

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});


module.exports = app;