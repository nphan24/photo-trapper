fetchPhotos();

$('.submit-btn').on('click', postPhotos);
$('.append-photos').on('click', '.delete', deletePhoto);

async function fetchPhotos () {
  try {
    let response = await fetch('/api/v1/photos');
    let photosArray = await response.json();

    displayPhotos(photosArray);
    return photosArray
  } catch (error) {
    console.log('error', error)
  }
}

function displayPhotos(photosArray) {
    photosArray.forEach(photo => {
      $('.append-photos').append(`
      <div class=${photo.id}>
        <div class='each-photo'>
          <img src=${photo.url} class='each-image'></img>
          <div class='flex'>
            <h3 class='each-name'>${photo.name}</h3>
            <img src='./assets/trash.svg' class='delete' alt='delete'/>
          </div>
        </div>
      </div>`);
    });
};

async function postPhotos (event) {
  event.preventDefault();
  const photoName = $('.name').val();
  const photoUrl = $('.url').val();

  try {
    const response = await fetch('/api/v1/photos', {
      method: 'POST',
      body: JSON.stringify({
        name: photoName,
        url: photoUrl
      }),
      headers: { 'Content-Type': 'application/json'}
    });
    const photoId = await response.json();

    $('.append-photos').append(`
      <div class=${photoId.id}>
        <div class='each-photo'>
          <img src=${photoUrl} class='each-image'></img>
          <div class='flex'>
            <h3 class='each-name'>${photoName}</h3>
            <img src='./assets/trash.svg' class='delete' alt='delete'/>
          </div>
        </div>
      </div>`);
    $('.name').val('');
    $('.url').val('');
    return photoId;
  } catch (error) {
    console.log('error posting photo', error )
  }
}
 
async function deletePhoto (event) {
  const deletePhotoId = $(this).parent().parent().parent().attr('class');

  try {
      await fetch(`/api/v1/photos/${deletePhotoId}`, {
      method: 'DELETE'
    })
    $(this).parent().parent().parent().remove();
  } catch (error) {
    console.log('error deleting photos', error)
  }
}

