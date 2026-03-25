import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images.map(createCardMarkup).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('is-visible');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.add('is-visible');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.remove('is-visible');
}

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<li class="gallery__item">
    <a class="gallery__link" href="${largeImageURL}">
      <img
        class="gallery__image"
        src="${webformatURL}"
        alt="${tags}"
        loading="lazy"
      />
    </a>
    <div class="gallery__info">
      <p class="gallery__info-item"><span class="gallery__info-label">Likes</span>${likes}</p>
      <p class="gallery__info-item"><span class="gallery__info-label">Views</span>${views}</p>
      <p class="gallery__info-item"><span class="gallery__info-label">Comments</span>${comments}</p>
      <p class="gallery__info-item"><span class="gallery__info-label">Downloads</span>${downloads}</p>
    </div>
  </li>`;
}
