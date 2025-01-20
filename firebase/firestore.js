import { doc, getDoc, setDoc, updateDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { db } from "./firebaseInit";

// Update highscore for a specific levelrr
export const updateHighScoreForLevel = async (username, difficulty, level, newScore) => {
  try {
    const userRef = doc(db, "users", username); // Use username as document ID
    const userDoc = await getDoc(userRef);

    const defaultScores = {
      easy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      medium: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      hard: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      expert: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    if (!userDoc.exists()) {
      // Create the document if it doesn't exist
      await setDoc(userRef, {
        username,
        scores: defaultScores
      });
    }

    // Update the score only if it's higher than the current one
    const currentScores = userDoc.exists() ? userDoc.data().scores : defaultScores;
    if (!currentScores[difficulty][level] || newScore > currentScores[difficulty][level]) {
      currentScores[difficulty][level] = newScore;

      await updateDoc(userRef, { scores: currentScores });
    } else {
      console.log("Score not high enough to update.");
    }
  } catch (error) {
    console.error("Error updating highscore: ", error);
  }
};

// Fetch all highscores for a user
export const getHighScoresForUser = async (username) => {
  try {
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().scores;
    } else {
      console.error("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching highscores: ", error);
    return null;
  }
};

// Fetch global leaderboard
export const getGlobalLeaderboard = async (limitCount = 10) => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const leaderboard = [];

    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      const totalScore = Object.values(user.scores).reduce((total, levels) =>
        total + Object.values(levels).reduce((sum, score) => sum + score, 0), 0
      );

      leaderboard.push({ username: user.username, totalScore });
    });

    return leaderboard.sort((a, b) => b.totalScore - a.totalScore).slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching global leaderboard: ", error);
    return [];
  }
}