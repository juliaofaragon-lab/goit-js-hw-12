import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  hideLoadMoreButton,
  hideLoader,
  showLoadMoreButton,
  showLoader,
} from './js/render-functions.js';

const refs = {
  form: document.querySelector('.form'),
  loadMoreButton: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const PER_PAGE = 15;

let currentQuery = '';
let currentPage = 1;
let totalPages = 0;

hideLoader();
hideLoadMoreButton();

refs.form.addEventListener('submit', handleSearchSubmit);
refs.loadMoreButton.addEventListener('click', handleLoadMoreClick);

async function handleSearchSubmit(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['search-text'].value.trim();

  if (!searchQuery) {
    clearGallery();
    hideLoadMoreButton();
    showInfoToast('Please fill in the search field.');
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  totalPages = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      showWarningToast(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    totalPages = Math.ceil(data.totalHits / PER_PAGE);
    createGallery(data.hits);
    updateLoadMoreState();
  } catch (error) {
    showErrorToast(getErrorMessage(error));
  } finally {
    hideLoader();
  }
}

async function handleLoadMoreClick() {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    createGallery(data.hits);
    scrollPage();
    updateLoadMoreState();
  } catch (error) {
    currentPage -= 1;
    showErrorToast(getErrorMessage(error));
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
}

function updateLoadMoreState() {
  if (currentPage >= totalPages) {
    hideLoadMoreButton();
    showInfoToast("We're sorry, but you've reached the end of search results.");
    return;
  }

  showLoadMoreButton();
}

function scrollPage() {
  const firstCard = refs.gallery.firstElementChild;

  if (!firstCard) {
    return;
  }

  const cardHeight = firstCard.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function getErrorMessage(error) {
  if (error.message === 'Pixabay API key is missing.') {
    return 'Add your Pixabay API key to the Vite environment variables to enable search.';
  }

  return 'Something went wrong. Please try again later.';
}

function showInfoToast(message) {
  iziToast.info({
    message,
    position: 'topRight',
    maxWidth: 360,
  });
}

function showWarningToast(message) {
  iziToast.warning({
    message,
    position: 'topRight',
    maxWidth: 360,
  });
}

function showErrorToast(message) {
  iziToast.error({
    message,
    position: 'topRight',
    maxWidth: 360,
  });
}
