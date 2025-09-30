import axios from 'axios';

const BASE_URL = 'https://exercisedb.p.rapidapi.com/exercises';

const options = {
  method: 'GET',
  url: BASE_URL,
 headers: {
    'x-rapidapi-key': 'e068936fdfmshc1c299760b8c16ep1e2f3ejsn898441aaa8c7',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.request(options);
    return response.data.slice(0, 20); 
  } catch (error) {
    console.error('Failed to fetch exercises:', error.message);
    return [];
  }
};
