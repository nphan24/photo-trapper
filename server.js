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

  if (!photo.name || !photo.url ) {
    return response.status(422).send({error: 'Missing a Parameter'})
  }

  db('photos').insert(photo, 'id')
    .then((photo) => {
      response.status(201).json({ id: photo[0]})
    })
    .catch((error) => {
      response.status(500).json({error: error, message: 'Failed to post that photo'})
    })
});

app.delete('/api/v1/photos/:id', (request, response) => {
  const id = request.params.id;

  db('photos').where('id', id).del()
    .then((photo) => {
      if (photo > 0) {
        response.status(200).json({message: 'Photo deleted successfully'})
      } else {
        response.status(404).json({message: 'Unable to delete'})
      }
    })
    .catch((error) => {
      response.status(500).json({ error: error })
    })
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports =  { app, db };