import { storage } from './storage';

const HIGH_SCORES_KEY = 'math_game_high_scores';
const TOTAL_HIGH_SCORES_KEY = 'math_game_total_high_scores'

// Initialize high scores structure if not already set
const initializeHighScores = () => {
  const defaultScores = 
    {
      "easy": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      "medium": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      "hard": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      "expert": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
    }
;

  if (!storage.getString(HIGH_SCORES_KEY)) {
    storage.set(HIGH_SCORES_KEY, JSON.stringify(defaultScores));
  }
};

// Get all high scores
export const getAllHighScores = () => {
  try {
    const scores = storage.getString(HIGH_SCORES_KEY);
    const total = storage.getString(TOTAL_HIGH_SCORES_KEY)
    console.log("scores: ", scores)
    console.log("total: ", total)
    return scores ? JSON.parse(scores) : null;
  } catch (error) {
    console.error('Error retrieving high scores:', error);
    return null;
  }
};

export const getTotalHighScore = () => {
  try {
    const scores = storage.getString(HIGH_SCORES_KEY);
    if(!scores){
      console.error('No scores found in storage');
      return null;
    }

    const parsedScores = JSON.parse(scores);
    let totalHighScore = 0;

    Object.values(parsedScores).forEach((levels) => {
      Object.values(levels).forEach((score) => {
        totalHighScore += score;
      })
    })

    storage.set(TOTAL_HIGH_SCORES_KEY, JSON.stringify(totalHighScore));
    console.log("stringified: ", JSON.stringify(totalHighScore))

  }
  catch (error) {
    console.error('Error calculating total high score: ', error);
    return null;
  }
}

// Get high score for a specific level and difficulty
export const getHighScoreForLevel = (difficulty, level) => {
  const scores = getAllHighScores();
  return scores && scores[difficulty] && scores[difficulty][level] !== undefined
    ? scores[difficulty][level]
    : 0; // Default to 0 if not found
};

// Save updated high scores
const saveHighScores = (scores) => {
  try {
    getTotalHighScore();
    storage.set(HIGH_SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving high scores:', error);
  }
};

// Update high score for a specific level and difficulty
export const updateHighScoreForLevel = (difficulty, level, newScore) => {
  const scores = getAllHighScores();

  if (scores && scores[difficulty] && scores[difficulty][level] !== undefined) {
    if (newScore > scores[difficulty][level]) {
      scores[difficulty][level] = newScore;
      saveHighScores(scores);
    }
  } else {
    console.error(`Invalid difficulty or level: ${difficulty} -> ${level}`);
  }
};

// Initialize the high scores on app start
initializeHighScores(); // Reinitialize with the updated structure
