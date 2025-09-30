import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, getDocs, query, where, doc } from 'firebase/firestore';

// Add favorite
export const addFavorite = async (userId, exercise) => {
  try {
    const docRef = await addDoc(collection(db, 'favorites'), {
      userId,
      ...exercise, // includes exercise.id, name, etc.
    });
    return docRef.id; // Firestore doc ID
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

// Remove favorite by exercise.id
export const removeFavorite = async (userId, exerciseId) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('id', '==', exerciseId) // match exercise.id
    );
    const snapshot = await getDocs(q);
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'favorites', document.id));
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

// Get all favorites for current user
export const getFavoritesByUser = async (userId) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(document => ({
      docId: document.id, // Firestore document ID
      ...document.data(), // exercise fields
    }));
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
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'favorites', document.id));
    }
  } catch (error) {
    console.error("Error clearing favorites:", error);
  }
};
