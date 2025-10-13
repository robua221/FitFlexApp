
import axios from 'axios';
import {EXERCISE_IMAGE,EXERCISE_RAPIDAPI_KEY,EXERCISE_RAPIDAPI_HOST} from '@env'
const options = {
  method: 'GET',
  baseURL: EXERCISE_IMAGE,
  headers: {
   'x-rapidapi-key': EXERCISE_RAPIDAPI_KEY,
    'x-rapidapi-host': EXERCISE_RAPIDAPI_HOST
  },
};

export const fetchExerciseGif = async (exerciseId, resolution = 'low') => {
  try {
    const response = await axios.get('', {
      ...options,
      params: { id: exerciseId, resolution },
      responseType: 'arraybuffer', 
    });

    const base64Gif = `data:image/gif;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    return base64Gif;
  } catch (error) {
    console.error('Error fetching exercise GIF:', error.message);
    return null;
  }
};
