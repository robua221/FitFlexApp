import axios from 'axios';
import {EXERCISE_BASE_URL,EXERCISE_RAPIDAPI_KEY,EXERCISE_RAPIDAPI_HOST} from '@env'
const BASE_URL = EXERCISE_BASE_URL;

const options = {
  method: 'GET',
  url: BASE_URL,
 headers: {
    'x-rapidapi-key': EXERCISE_RAPIDAPI_KEY,
    'x-rapidapi-host': EXERCISE_RAPIDAPI_HOST
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.request(options);
    return response.data.slice(0, 50); 
  } catch (error) {
    console.error('Failed to fetch exercises:', error.message);
    return [];
  }
};
