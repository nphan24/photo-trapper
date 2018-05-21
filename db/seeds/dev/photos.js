
exports.seed = function(knex, Promise) {
  return (knex('photos').del()
    .then(() => {
      return Promise.all([
        knex('photos').insert([
        {name: 'photo 1', url: 'https://www.popsci.com/sites/popsci.com/files/styles/1000_1x_/public/images/2017/10/terrier-puppy.jpg?itok=rIgh3ArV&fc=50,50'},
        {name: 'photo 2', url: 'https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/The-stages-of-puppy-growth.jpg?itok=9ptPJwY8'},
        {name: 'photo 3', url: 'https://gfp-2a3tnpzj.stackpathdns.com/wp-content/uploads/2016/07/Dachshund-600x600.jpg'}
      ], 'id')
  .then(() => console.log('Seeding Success!'))
  .catch((error) => console.log(`Error Seeding data: ${error}`))
    ])
  }))
}
