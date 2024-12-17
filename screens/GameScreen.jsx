import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const GameScreen = ({ route, navigation }) => {
    const { questions, level, difficulty } = route.params; // Get the questions and level from SelectLevel screen

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black');
    const [lives, setLives] = useState([true, true, true]);
    const [gameOver, setGameOver] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]); // State to store shuffled options
    const [timer, setTimer] = useState(120); // Set initial time to 2 minutes (120 seconds)

    const currentQuestion = questions[currentQuestionIndex];

    // Shuffle function to randomize the order of the options
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // Shuffle the options whenever the current question changes
    useEffect(() => {
        if (currentQuestion) {
            setShuffledOptions(shuffleArray([...currentQuestion.options]));
        }
        setFeedback(''); // Reset feedback when changing questions
        setFeedbackColor('black');
    }, [currentQuestionIndex]);

    // Start and manage the timer
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerInterval);
                    setGameOver(true);
                    setFeedback('Time’s up!');
                    return 0; // Timer reached 0, game over
                }
                return prevTime - 1; // Decrement timer
            });
        }, 1000); // Update every second

        // Clean up the interval when the component unmounts or game ends
        return () => clearInterval(timerInterval);
    }, []);

    const handleAnswer = (selectedOption) => {
        if (selectedOption === currentQuestion.answer) {
            setFeedback('Correct!');
            setFeedbackColor('green');
        } else {
            setFeedback('Incorrect.');
            setFeedbackColor('red');
            removeLife();
        }

        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
                setCurrentQuestionIndex(nextIndex);
            } else {
                // If all questions are used, handle end of level
                setGameOver(true);
            }
        }, 1000);
    };

    const removeLife = () => {
        const updatedLives = [...lives];
        const firstIndex = updatedLives.indexOf(true);
        if (firstIndex !== -1) {
            updatedLives[firstIndex] = false;
            setLives(updatedLives);
        }
    };

    const handleLevelSelection = () => {
        navigation.navigate('SelectLevel', { difficulty: difficulty });
    };

    const handleBackToHome = () => {
        navigation.navigate('Home');
    };

    const handleNextLevel = () => {
        if (level < 5) {
            // Increment the level
            const nextLevel = level + 1;

            // Get the next level's questions based on the difficulty
            const nextQuestions = getQuestionsForLevel(difficulty, nextLevel);

            // Reset the current question index to 0
            setCurrentQuestionIndex(0);

            // Reset the game over state for the next level
            setGameOver(false);

            // Reset the timer to 2 minutes for the next level
            setTimer(120);

            // Navigate to the Game screen with the next level and its questions
            navigation.navigate('Game', {
                questions: nextQuestions,
                difficulty: difficulty,
                level: nextLevel,
            });
        }
    };

    const getQuestionsForLevel = (difficulty, level) => {
        const allQuestions = require('../questions3.json'); // Make sure this path is correct

        // Fetch the questions for the given level and difficulty
        const questionsForLevel = allQuestions[difficulty]?.levels.find(
            (lvl) => lvl.level === level
        );

        return questionsForLevel ? questionsForLevel.questions : [];
    };

    // Function to format the timer as mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <ImageBackground
            source={require('../assets/images/mathgame.png')}
            style={styles.background}
        >
            {/* Top Section: Hearts, Pause Icon, Score, Timer */}
            <View style={styles.pauseHeartContainer}>
                <View>
                    <Image
                        style={styles.pauseImage}
                        source={require('../assets/images/pause.png')}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {lives.map((life, index) => (
                        <Animatable.Image
                            key={index}
                            animation={life ? undefined : 'zoomOut'}
                            duration={500}
                            style={styles.heartImage}
                            source={require('../assets/images/heart.png')}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            </View>

            <View style={styles.pauseHeartContainer}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreStopwatchText}>Score: 31</Text>
                </View>
                <View style={styles.stopwatchContainer}>
                    <Image
                        style={styles.stopwatchImage}
                        source={require('../assets/images/stopwatch.png')}
                        resizeMode="cover"
                    />
                    <Text style={styles.scoreStopwatchText}>{formatTime(timer)}</Text>
                </View>
            </View>

            {/* Main Game Section: Question and Options */}
            <View style={styles.container}>
                {gameOver || lives.every(life => !life) ? (
                    <View style={styles.endGameContainer}>
                        <Text style={styles.feedback}>{lives.every(life => !life) ? 'Level Failed!' : 'Level Complete!'}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleLevelSelection}
                            >
                                <Text style={styles.buttonText}>Level Selection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, level === 5 && styles.disabledButton]}
                                onPress={handleNextLevel}
                                disabled={level === 5}
                            >
                                <Text style={styles.buttonText} disabled={lives.every(life => !life)}>Next Level</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={handleBackToHome}
                            disabled={level === 5}
                        >
                            <Text style={styles.buttonText}>Back to home</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {feedback ? (
                            <Text style={[styles.feedback, { color: feedbackColor }]}>{feedback}</Text>
                        ) : (
                            <Text style={styles.question}>{currentQuestion.question}</Text>
                        )}

                        <View style={styles.optionsContainer}>
                            {shuffledOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => handleAnswer(option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    feedback: {
        fontSize: 44,
        fontWeight: 'bold',
        marginBottom: 20,
        bottom: 40,
    },
    question: {
        fontSize: 65,
        marginBottom: 20,
        position: 'relative',
        bottom: 40,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'BebasNeue-Regular',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    optionButton: {
        width: '30%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#fff',
        margin: 30,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 60,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'BebasNeue-Regular',
    },
    pauseHeartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    heartImage: {
        width: 60,
        height: 60,
    },
    pauseImage: {
        width: 60,
        height: 60,
    },
    stopwatchImage: {
        width: 50,
        height: 50,
    },
    scoreStopwatchText: {
        fontSize: 40,
        color: 'white',
        fontFamily: 'BebasNeue-Regular',
    },
    stopwatchContainer: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        padding: 10,
    },
    scoreContainer: {
        borderWidth: 3,
        borderColor: '#FFF',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endGameContainer: {
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'BebasNeue-Regular',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default GameScreen;
