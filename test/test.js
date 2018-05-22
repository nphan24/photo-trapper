const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, db } = require('../server');

chai.use(chaiHttp);

describe('client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  })

  it('should return 404 for a route that does not exist', (done) => {
    chai.request(app)
      .get('/puppies')
      .end((error, response) => {
        response.should.status(404);
        done();
      });
  });
});

describe('Testing endpoints', () => {
  beforeEach(done => {
    db.migrate.rollback()
      .then(()=> {
        db.migrate.latest()
          .then(()=> {
            return db.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('GET all photos', (done) => {
    chai.request(app)
      .get('/api/v1/photos')
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(200);
        response.body.should.be.an('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('url');
        response.body[0].should.have.property('id');
        response.body[0].name.should.equal('photo 1');
        response.body[0].id.should.equal(1);
        response.body[1].name.should.equal('photo 2');
        response.body[1].id.should.equal(2);
        response.body[2].name.should.equal('photo 3');
        response.body[2].id.should.equal(3);
        done();
      });
  });

  it('POST photos to the database', (done) => {
    chai.request(app)
      .post('/api/v1/photos')
      .send({
        'name': 'photo 4', 
        'url': 'http://www.lazerhorse.org/wp-content/uploads/2014/06/Pomeranian-Puppy-cute-clipped.jpg'
      })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(201);
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        done();
      });
  });

  it('should return an error if invalid body is given', (done) => {
      chai.request(app)
      .post('/api/v1/photos')
      .send({
        'name': 'photo 5'
      })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(422);
        response.body.should.be.an('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('Missing a Parameter');
        done();
      });
  });

  it('DELETE from the database', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/3')
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(200);
        response.body.should.have.property('message');
        response.body.message.should.equal('Photo deleted successfully');
        done();
      });
  });

  it('should return an error, unable to delete a photo', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/4')
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(404);
        response.body.should.have.property('message');
        response.body.message.should.equal('Unable to delete');
        done();
      });
  });

  it('should return an error if invalid endpoint', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/nothing')
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(500);
        response.body.should.have.property('error');
        done();
      });
  });
});
