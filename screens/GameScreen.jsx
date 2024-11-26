import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import questions from '../questions2.json';

const GameScreen = ({ route }) => {
    const { difficulty } = route.params; // Get selected difficulty
    const filteredQuestions = questions.filter(
        (question) => question.difficulty === difficulty
    );

    const [usedQuestions, setUsedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black'); // Default color

    useEffect(() => {
        setCurrentQuestionIndex(getRandomIndex([]));
    }, []);

    // Function to get a random index that hasn't been used yet
    function getRandomIndex(usedIndices) {
        const remainingIndices = filteredQuestions
            .map((_, index) => index)
            .filter((index) => !usedIndices.includes(index));
        return remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    }

    // Handle the answer selection
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
                // Reset if all questions are used
                setUsedQuestions([]);
            } else {
                setUsedQuestions(updatedUsedQuestions);
            }
            setCurrentQuestionIndex(getRandomIndex(updatedUsedQuestions));
            setFeedback('');
            setFeedbackColor('black'); // Reset color for next question
        }, 1000);
    };

    return (
        <View style={styles.container}>
            {feedback ? (
                <Text style={[styles.feedback, { color: feedbackColor }]}>
                    {feedback}
                </Text>
            ) : (
                <>
                    <Text style={styles.question}>
                        {filteredQuestions[currentQuestionIndex].question}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
                            <View style={styles.optionButton} key={index}>
                                <Button
                                    title={option.toString()}
                                    onPress={() => handleAnswer(option)}
                                />
                            </View>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    feedback: {
        fontSize: 44,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    question: {
        fontSize: 44,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '80%',
    },
    optionButton: {
        width: '40%',
        margin: 5,
    },
});

export default GameScreen;
