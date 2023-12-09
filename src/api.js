import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const getData = async (searchQuery, page = 1) => {
  try {
    const urlSeaParams = new URLSearchParams({
      key: '41161675-f88d2cdd35bb94a414d04c132',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: searchQuery,
      page,
      per_page: 50,
    });

    const response = await axios.get(`?${urlSeaParams}`);
    return response.data;
  } catch (error) {
    Notify.warning('Oops! Something went wrong');
  }
};
