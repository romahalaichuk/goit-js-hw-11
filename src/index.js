import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getData } from './api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElement = document.querySelector('.search-form');
const galleryElement = document.querySelector('.gallery');
const loadMoreElement = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');
let page = 1;
let value = '';
formElement.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  value = event.target.elements.searchQuery.value.trim();
  if (!value) return;
  page = 1;
  try {
    const { totalHits, hits } = await getData(value, page);
    if (!hits.length) {
      clearGallery();
      loadMoreElement.classList.add(`is-hidden`);
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    clearGallery();
    if (totalHits <= 50) {
      loadMoreElement.classList.add(`is-hidden`);
    } else {
      loadMoreElement.classList.remove(`is-hidden`);
    }
    const markup = createGallery(hits);
    addMarkup(markup);
    lightbox.refresh();
  } catch (error) {
    onError();
  } finally {
    event.target.reset();
  }
}

function createGallery(items = []) {
  return items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href='${largeImageURL}'>
     <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div></a>
     `;
      }
    )
    .join('');
}

function addMarkup(markup = '') {
  galleryElement.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  galleryElement.innerHTML = '';
}

loadMoreElement.addEventListener('click', onClick);

async function onClick() {
  try {
    page += 1;
    const { totalHits, hits } = await getData(value, page);
    const markup = createGallery(hits);
    addMarkup(markup);
    lightbox.refresh();
    if (page * 50 >= totalHits) {
      loadMoreElement.classList.add('is-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    onError();
  }
}

function onError() {
  clearGallery();
  Notify.warning('Oops! Something went wrong');
}
