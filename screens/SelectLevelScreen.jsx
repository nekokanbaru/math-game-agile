import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { getCurrentUser, getAllUsers } from '../utils/storage/highScoreUtils';

const SelectLevelScreen = ({ route, navigation }) => {
    const { difficulty } = route.params; // Receive difficulty from route params
    const levels = require('../questions3.json')[difficulty]?.levels || []; // Fetch levels based on difficulty
    const users = getAllUsers();
    const userProgress = users[getCurrentUser()][difficulty];

    const handleBackToDifficulty = () => {
        navigation.navigate('Difficulty');
    };

    return (
        <ImageBackground
            source={require('../assets/images/mathgame.png')}
            style={styles.background}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToDifficulty}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {levels.map((level, index) => {
                    // The first level is always enabled, subsequent levels depend on progress
                    const isEnabled = index === 0 || userProgress[index]?.completed;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.button,
                                !isEnabled && styles.disabledButton // Apply disabled style if the button is locked
                            ]}
                            onPress={() => isEnabled && navigation.navigate('Game', {
                                questions: level.questions,
                                difficulty: difficulty,
                                level: level.level
                            })}
                            disabled={!isEnabled} // Disable the button if it's not unlocked
                        >
                            <Text style={styles.buttonText}>Level {level.level}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginTop: 80,
    },
    button: {
        width: 300,
        padding: 5,
        backgroundColor: '#002248',
        borderWidth: 3,
        borderColor: "#FFF",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: "center",
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    disabledButton: {
        backgroundColor: '#555555', // Greyed-out color for disabled buttons
        borderColor: '#777777',
    },
    buttonText: {
        color: "#cfd4dd",
        fontSize: 50,
        fontFamily: "BebasNeue-Regular",
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 50,
        width: 100,
        padding: 5,
        backgroundColor: '#002248',
        borderWidth: 3,
        borderColor: "#FFF",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: "center",
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    backButtonText: {
        color: "#cfd4dd",
        fontSize: 30,
        fontFamily: "BebasNeue-Regular",
    },
});

export default SelectLevelScreen;
