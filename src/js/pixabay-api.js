import axios from 'axios';

const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY || '';
const PER_PAGE = 15;

const pixabayApi = axios.create({
  baseURL: 'https://pixabay.com/api/',
});

export async function getImagesByQuery(query, page) {
  if (!PIXABAY_API_KEY) {
    throw new Error('Pixabay API key is missing.');
  }

  const { data } = await pixabayApi.get('', {
    params: {
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: PER_PAGE,
    },
  });

  return data;
}
