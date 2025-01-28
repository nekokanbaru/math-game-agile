import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback of sound immediately
Sound.setCategory('Playback');

const SelectLevelScreen = ({ route, navigation }) => {
    const { difficulty } = route.params;
    const levels = require('../questions3.json')[difficulty]?.levels || []; // Fetch levels based on difficulty

    // Load the sound
    const clickSound = new Sound(require('../assets/sounds/click.wav'), error => {
        if (error) {
            console.log('Failed to load the sound', error);
        }
    });

    // Handle button press with sound
    const handleButtonPress = (level) => {
        clickSound.play(() => {
            navigation.navigate('Game', { questions: level.questions, difficulty: difficulty, level: level.level });
        });
    };

    // Handle back navigation with sound
    const handleBackToDifficulty = () => {
        clickSound.play(() => {
            navigation.navigate('Difficulty');
        });
    };

    useEffect(() => {
        // Cleanup the sound on unmount
        return () => clickSound.release();
    }, []);

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
                {levels.map((level, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => handleButtonPress(level)}
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
        marginTop: 80
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
