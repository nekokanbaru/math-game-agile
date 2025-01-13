import { storage } from "./storage";
import { db } from "../../firebase/firebaseInit";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
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
  easy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      medium: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      hard: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      expert: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
};

// Initialize users structure if not already set
const initializeUsers = async () => {
  if (!storage.getString(USERS_KEY)) {
    storage.set(USERS_KEY, JSON.stringify({}));
  }
  if (!storage.getString(CURRENT_USER_KEY)) {
    storage.set(CURRENT_USER_KEY, "default"); // Set a default user
    addUser("default"); // Create the default user
  }
};

// Add a new user
export const addUser = async (username) => {
  const users = getAllUsers();
  if (!users[username]) {
    // Initialize Firebase user data
    await firebaseUpdateHighScoreForLevel(username, "easy", 1, 0); // Initialize Firebase user if not found
    users[username] = { ...defaultScores }; // Initialize scores locally
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
  const users = getAllUsers(); // Retrieve all users
  const usersWithScores = Object.entries(users).map(([username, scores]) => {
    const totalScore = Object.values(scores).reduce((total, levels) =>
      total + Object.values(levels).reduce((sum, score) => sum + score, 0)
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
  return scores[difficulty]?.[level] ?? 0; // Default to 0 if not found
};

// Update high score for a specific level and difficulty for the current user
export const updateHighScoreForLevel = async (difficulty, level, newScore) => {
  const currentUser = getCurrentUser();
  const users = getAllUsers();

  if (users[currentUser]?.[difficulty]?.[level] !== undefined) {
    const currentScore = users[currentUser][difficulty][level];
    if (newScore > currentScore) {
      // Update local storage
      users[currentUser][difficulty][level] = newScore;
      saveUsers(users);

      // Recalculate total score and sync with global leaderboard
      const totalScore = getTotalHighScore();
      await firebaseUpdateHighScoreForLevel(currentUser, difficulty, level, newScore);
      addGlobalScore(currentUser, totalScore);
    }
  } else {
    console.error(`Invalid difficulty or level: ${difficulty} -> ${level}`);
  }
};

// Get total high score for the current user
export const getTotalHighScore = () => {
  const scores = getAllHighScores();
  return Object.values(scores).reduce((total, levels) =>
    total + Object.values(levels).reduce((sum, score) => sum + score, 0)
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
export const getGlobalLeaderboard = async (limitCount = 10) => {
  try {
    const leaderboardRef = collection(db, "scoreboard");
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching global leaderboard:", error);
    return [];
  }
};

// Initialize users on app start
initializeUsers();
