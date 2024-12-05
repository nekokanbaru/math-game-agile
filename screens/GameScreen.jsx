import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import questions from '../questions2.json';

const GameScreen = ({ route }) => {
    const { difficulty } = route.params;
    const filteredQuestions = questions.filter(
        (question) => question.difficulty === difficulty
    );

    const [usedQuestions, setUsedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black');

    useEffect(() => {
        setCurrentQuestionIndex(getRandomIndex([]));
    }, []);

    function getRandomIndex(usedIndices) {
        const remainingIndices = filteredQuestions
            .map((_, index) => index)
            .filter((index) => !usedIndices.includes(index));
        return remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    }

    const handleAnswer = (selectedOption) => {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        if (selectedOption === currentQuestion.answer) {
            setFeedback('Correct!');
            setFeedbackColor('green');
        } else {
            setFeedback('Incorrect.');
            setFeedbackColor('red');
        }

        setTimeout(() => {
            const updatedUsedQuestions = [...usedQuestions, currentQuestionIndex];
            if (updatedUsedQuestions.length === filteredQuestions.length) {
                setUsedQuestions([]);
            } else {
                setUsedQuestions(updatedUsedQuestions);
            }
            setCurrentQuestionIndex(getRandomIndex(updatedUsedQuestions));
            setFeedback('');
            setFeedbackColor('black');
        }, 1000);
    };

    return (
        <ImageBackground
            source={require('../assets/images/mathgame.png')}
            style={styles.background}
        >
            <View style={styles.pauseHeartContainer}>
                <View>
                    <Image
                        style={styles.pauseImage}
                        source={require('../assets/pause.png')}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        style={styles.heartImage}
                        source={require('../assets/heart.png')}
                        resizeMode="cover"
                    />
                    <Image
                        style={styles.heartImage}
                        source={require('../assets/heart.png')}
                        resizeMode="cover"
                    />
                    <Image
                        style={styles.heartImage}
                        source={require('../assets/heart.png')}
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View style={styles.pauseHeartContainer}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreStopwatchText}>Score: 31</Text>
                </View>
                <View style={styles.stopwatchContainer}>
                    <Image
                        style={styles.stopwatchImage}
                        source={require('../assets/stopwatch.png')}
                        resizeMode="cover"
                    />
                    <Text style={styles.scoreStopwatchText}>0:02</Text>
                </View>
            </View>
            <View style={styles.container}>
                {feedback ? (
                    <Text style={[styles.feedback, { color: feedbackColor }]}>{feedback}</Text>
                ) : (
                    <>
                        <Text style={styles.question}>
                            {filteredQuestions[currentQuestionIndex].question}
                        </Text>
                        <View style={styles.optionsContainer}>
                            {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionButton}
                                    onPress={() => handleAnswer(option)}
                                >
                                    <Text style={styles.optionText}>{option.toString()}</Text>
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
        justifyContent: "center",
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
        bottom: 40, // Podignuto pitanje
        textAlign: 'center',
        color: 'white',
        fontFamily: "BebasNeue-Regular",
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    optionButton: {
        width: '20%',
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
        fontFamily: "BebasNeue-Regular",
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
        fontFamily: "BebasNeue-Regular",
    },
    stopwatchContainer: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: "#FFF",
        padding: 10
    },
    scoreContainer: {
        borderWidth: 3,
        borderColor: "#FFF",
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default GameScreen;
