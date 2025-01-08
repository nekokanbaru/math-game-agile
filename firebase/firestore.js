import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";

// Initialize Firestore
const db = getFirestore(app);

// Function to add a user's score to the database
export const addScore = async (username, score) => {
  try {
    await addDoc(collection(db, "scoreboard"), {
      username,
      score,
    });
    console.log("Score added successfully!");
  } catch (error) {
    console.error("Error adding score: ", error);
  }
};

// Function to fetch the top scores from the leaderboard
export const getTopScores = async (limitCount = 10) => {
  try {
    const q = query(collection(db, "scoreboard"), orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });

    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    return [];
  }
};
