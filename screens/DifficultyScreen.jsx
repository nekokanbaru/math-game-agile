import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback of sound immediately
Sound.setCategory('Playback');

const DifficultyScreen = ({ navigation }) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'];

    // Load the sound
    const clickSound = new Sound(require('../assets/sounds/click.wav'), error => {
        if (error) {
            console.log('Failed to load the sound', error);
        }
    });

    // Handle the button press
    const handleButtonPress = (difficulty) => {
        clickSound.play(() => {
            // Play sound and navigate
            navigation.navigate('SelectLevel', { difficulty });
        });
    };

    const handleBackToHome = () => {
        clickSound.play(() => {
            navigation.navigate('Home');
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
                onPress={handleBackToHome}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {difficulties.map((difficulty, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => handleButtonPress(difficulty)}
                    >
                        <Text style={styles.buttonText}>{difficulty.toUpperCase()}</Text>
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
        gap: 10,
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
    buttonText: {
        color: "#cfd4dd",
        fontSize: 50,
        fontFamily: "BebasNeue-Regular",
    }
});

export default DifficultyScreen;
