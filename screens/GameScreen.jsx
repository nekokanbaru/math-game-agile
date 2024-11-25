import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import questions from '../questions.json';

const GameScreen = () => {
    const [usedQuestions, setUsedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getRandomIndex([]));
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('black'); // Default color

    // Function to get a random index that hasn't been used yet
    function getRandomIndex(usedIndices) {
        const remainingIndices = questions
            .map((_, index) => index)
            .filter((index) => !usedIndices.includes(index));
        return remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    }

    // Handle the answer selection
    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.answer) {
            setFeedback('Correct!');
            setFeedbackColor('green'); // Set to green for correct answer
        } else {
            setFeedback('Incorrect.');
            setFeedbackColor('red'); // Set to red for incorrect answer
        }

        // Update the used questions list and load the next question
        setTimeout(() => {
            const updatedUsedQuestions = [...usedQuestions, currentQuestionIndex];
            if (updatedUsedQuestions.length === questions.length) {
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
                        {questions[currentQuestionIndex].question}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {questions[currentQuestionIndex].options.map((option, index) => (
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
        gap: '50',
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
