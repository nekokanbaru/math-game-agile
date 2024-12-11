import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const GameScreen = ({ route }) => {
    const { questions } = route.params; // Get the questions passed from SelectLevel screen

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black');
    const [lives, setLives] = useState([true, true, true]);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        setFeedback('');
        setFeedbackColor('black');
    }, [currentQuestionIndex]);

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
                    <Text style={styles.scoreStopwatchText}>0:02</Text>
                </View>
            </View>

            {/* Main Game Section: Question and Options */}
            <View style={styles.container}>
                {feedback ? (
                    <Text style={[styles.feedback, { color: feedbackColor }]}>{feedback}</Text>
                ) : (
                    <>
                        <Text style={styles.question}>{currentQuestion.question}</Text>
                        <View style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => (
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
});

export default GameScreen;
