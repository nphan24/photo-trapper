const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ entended: true }));
app.use(express.static('public'));

app.locals.title = 'Photo Trapper';
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/photos', (request, response) => {
  db('photos').select()
    .then((photos) => {
      response.status(200).json(photos)
    })
    .catch((error) => {
      response.status(404).json({ message: error })
    })
});

app.post('/api/v1/photos', (request, response) => {
  const photo = request.body;
  console.log('body', request.body);

  if (!photo.name || !photo.url ) {
    return response.status(406).send({error: 'Missing a Parameter'})
  }

  db('photos').insert(photo, 'id')
    .then((photo) => {
      response.status(201).json({ id: photo[0]})
    })
    .catch((error) => {
      response.status(500).json({error: error, message: 'Failed to post that photo'})
    })
});

app.delete('/api/v1/photos', (request, response) => {
  const id = request.body.id;

  db('photos').where('id', id).del()
    .then(() => {
      response.status(200).json({message: 'Photo deleted successfully'})
    })
    .catch((error) => {
      response.status(500).json({error: error, message: 'Unable to delete photo'})
    })
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports =  { app, db };