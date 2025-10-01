import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';

// Add favorite
export const addFavorite = async (userId, exercise) => {
  try {
   
    const docRef = await addDoc(collection(db, 'favorites'), {
      userId,
      ...exercise,
      gifUrl: exercise.gifUrl || '', 
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

// Remove favorite by ID
export const removeFavorite = async (userId, exerciseId) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('id', '==', exerciseId)
    );
    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map(document => deleteDoc(doc(db, 'favorites', document.id)));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

// Get all favorites for current user
export const getFavoritesByUser = async (userId) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// Clear all favorites for current user
export const clearFavorites = async (userId) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'favorites', document.id)));
    await Promise.all(deletePromises); 
  } catch (error) {
    console.error("Error clearing favorites:", error);
  }
};
