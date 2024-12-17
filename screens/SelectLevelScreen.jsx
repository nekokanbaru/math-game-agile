import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';

const SelectLevelScreen = ({ route, navigation }) => {
    const { difficulty } = route.params;
    const levels = require('../questions3.json')[difficulty]?.levels || []; // Fetch levels based on difficulty

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
                        onPress={() => handleBackToDifficulty()}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {levels.map((level, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => navigation.navigate('Game', { questions: level.questions, difficulty: difficulty, level: level.level })}
                    >
                        <Text style={styles.buttonText}>Level {level.level}</Text>
                    </TouchableOpacity>
                ))}
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
    },
    button: {
        width: 300,
        padding: 5,
        backgroundColor: '#002248', // Transparent white background
        borderWidth: 3,
        borderColor: "#FFF",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: "center",  // Glow color
        shadowOpacity: 0.5,   // Strength of the glow
        shadowRadius: 1,     // Spread of the glow
        elevation: 1,        // For Android shadow
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
        backgroundColor: '#002248', // Transparent white background
        borderWidth: 3,
        borderColor: "#FFF",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: "center",  // Glow color
        shadowOpacity: 0.5,   // Strength of the glow
        shadowRadius: 1,     // Spread of the glow
        elevation: 1,        // For Android shadow
    },
    backButtonText: {
        color: "#cfd4dd",
        fontSize: 30,
        fontFamily: "BebasNeue-Regular",
    }
});

export default SelectLevelScreen;
