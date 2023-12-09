import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const getData = async (searchQuery, page = 1) => {
  try {
    const urlSeaParams = new URLSearchParams({
      key: '40486254-4681fff754f8735bda72aa19c',
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
