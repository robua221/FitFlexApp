
import axios from 'axios';

const options = {
  method: 'GET',
  baseURL: 'https://exercisedb.p.rapidapi.com/image',
  headers: {
      'x-rapidapi-key': 'e068936fdfmshc1c299760b8c16ep1e2f3ejsn898441aaa8c7',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
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
