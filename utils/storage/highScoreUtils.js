import { storage } from "./storage";
console.log("Storage object loaded:", storage);
import { db } from "../../firebase/firebaseInit";
import { collection, addDoc, getDocs, query, orderBy, limit, collectionGroup } from "firebase/firestore";
import {
  updateHighScoreForLevel as firebaseUpdateHighScoreForLevel,
  getHighScoresForUser,
  getGlobalLeaderboard as firebaseGetGlobalLeaderboard,
} from "../../firebase/firestore";

const HIGH_SCORES_KEY = "math_game_high_scores"; // Legacy support
const USERS_KEY = "math_game_users";
const CURRENT_USER_KEY = "math_game_current_user";

// Default high scores structure
const defaultScores = {
  easy: { 1: { score: 0, completed: false }, 2: { score: 0, completed: false }, 3: { score: 0, completed: false }, 4: { score: 0, completed: false }, 5: { score: 0, completed: false } },
  medium: { 1: { score: 0, completed: false }, 2: { score: 0, completed: false }, 3: { score: 0, completed: false }, 4: { score: 0, completed: false }, 5: { score: 0, completed: false } },
  hard: { 1: { score: 0, completed: false }, 2: { score: 0, completed: false }, 3: { score: 0, completed: false }, 4: { score: 0, completed: false }, 5: { score: 0, completed: false } },
  expert: { 1: { score: 0, completed: false }, 2: { score: 0, completed: false }, 3: { score: 0, completed: false }, 4: { score: 0, completed: false }, 5: { score: 0, completed: false } },
};

// Initialize users structure if not already set
const initializeUsers = async () => {
  if (!storage.getString(USERS_KEY)) {
    storage.set(USERS_KEY, JSON.stringify({}));
  }
  if (!storage.getString(CURRENT_USER_KEY)) {
    storage.set(CURRENT_USER_KEY, "guest"); // Set a default user
    addUser("guest"); // Create the default user
  }
};

// Add a new user
export const addUser = async (username) => {
  const users = getAllUsers();
  if (!users[username]) {
    // Initialize Firebase user data
    await firebaseUpdateHighScoreForLevel(username, "easy", 1, 0); // Initialize Firebase user if not found
    users[username] = JSON.parse(JSON.stringify(defaultScores)); // Initialize scores locally
    saveUsers(users);
  }
  setCurrentUser(username);
};

// Get all users
export const getAllUsers = () => {
  const users = storage.getString(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

export const getAllUsersWithScores = () => {
  const users = getAllUsers();
  const usersWithScores = Object.entries(users).map(([username, scores]) => {
    const totalScore = Object.values(scores).reduce((total, levels) =>
      total + Object.values(levels).reduce((sum, level) => sum + (level.score || 0), 0)
    , 0);
    return { username, score: totalScore };
  });
  return usersWithScores;
};

// Save users
const saveUsers = (users) => {
  storage.set(USERS_KEY, JSON.stringify(users));
};

// Get the current user
export const getCurrentUser = () => storage.getString(CURRENT_USER_KEY);

// Set the current user
export const setCurrentUser = (username) => {
  storage.set(CURRENT_USER_KEY, username);
};

// Get all high scores for the current user
export const getAllHighScores = () => {
  const currentUser = getCurrentUser();
  const users = getAllUsers();
  return users[currentUser] || { ...defaultScores };
};

// Get high score for a specific level and difficulty for the current user
export const getHighScoreForLevel = (difficulty, level) => {
  const scores = getAllHighScores();
  return scores[difficulty]?.[level] ?? { score: 0, completed: false };
};

// Update high score for a specific level and difficulty for the current user
export const updateHighScoreForLevel = async (difficulty, level, newScore) => {
  try {
    const currentUser = getCurrentUser();
    const users = getAllUsers();

    if (!currentUser || !users[currentUser]) {
      console.error("Invalid current user.");
      return;
    }

    // Validate difficulty and level exist for the user
    const userDifficulty = users[currentUser][difficulty];
    if (userDifficulty && userDifficulty[level] !== undefined) {
      const currentLevelData = userDifficulty[level];
      const currentScore = currentLevelData.score;

      if (newScore > currentScore) {
        // Update the local storage
        users[currentUser][difficulty][level].score = newScore;
        users[currentUser][difficulty][level].completed = true; // Mark as completed
        saveUsers(users);

        // If the current user is "guest," skip Firebase update
        if (currentUser === "guest") {
          console.log("Skipping Firebase update for guest user.");
          return;
        }

        // Recalculate total score
        const totalScore = getTotalHighScore();

        // Sync the new high score with Firebase
        await firebaseUpdateHighScoreForLevel(currentUser, difficulty, level, newScore);

        // Update the global leaderboard with the total score
        addGlobalScore(currentUser, totalScore);
      }
    } else {
      console.error(`Invalid difficulty or level: ${difficulty} -> ${level}`);
    }
  } catch (error) {
    console.error("Error updating high score:", error);
  }
};

export const getTotalHighScore = () => {
  const scores = getAllHighScores();
  return Object.values(scores).reduce((total, levels) =>
    total + Object.values(levels).reduce((sum, level) => sum + (level.score || 0), 0)
  , 0);
};

// Add a user's score to the global leaderboard
export const addGlobalScore = async (username, score) => {
  try {
    await addDoc(collection(db, "scoreboard"), {
      username,
      score,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error adding global score:", error);
  }
};

// Fetch top N scores from the global leaderboard

export const getGlobalLeaderboard = async (limitCount = 50) => {
  try {
    const leaderboard = [];

    // Query all the 'users' collection
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    if (usersSnapshot.empty) {
      console.warn("No users found.");
      return [];
    }

    // Calculate total score for each user
    const userScoresMap = {}; // Keep track of total scores for each user

    // Loop through all users
    for (const userDoc of usersSnapshot.docs) {
      const username = userDoc.id; // Get the username (document ID)
      const scoresData = userDoc.data().scores; // Access the 'scores' field

      // Check if 'scores' exists
      if (!scoresData) {
        console.log(`No scores found for user: ${username}`);
        continue;
      }

      let totalScore = 0;

      // Sum up the scores for each difficulty (easy, medium, hard, expert)
      for (const difficulty of ['easy', 'medium', 'hard', 'expert']) {
        const levels = scoresData[difficulty]; // Get the levels map for the difficulty
        if (levels) {
          // Sum up the levels' scores
          totalScore += Object.values(levels).reduce((sum, score) => sum + score, 0);
        }
      }

      // Store the user's total score
      userScoresMap[username] = totalScore;
    }

    // Prepare leaderboard with the total score for each user
    Object.keys(userScoresMap).forEach((username) => {
      leaderboard.push({
        username,
        score: userScoresMap[username],
      });
    });

    // Sort the leaderboard by total score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Return the top N users based on the limit
    return leaderboard.slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching global leaderboard:", error);
    return [];
  }
};

// Initialize users on app start
initializeUsers();
