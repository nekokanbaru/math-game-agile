import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'];

    const handleBackToHome = () => {
        navigation.navigate('Home');
    };

    return (
        <ImageBackground
            source={require('../assets/images/mathgame.png')}
            style={styles.background}
        >
            <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => handleBackToHome()}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {difficulties.map((difficulty, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => navigation.navigate('SelectLevel', { difficulty })}
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
    },
    buttonText: {
        color: "#cfd4dd",
        fontSize: 50,
        fontFamily: "BebasNeue-Regular",
    }
});

export default DifficultyScreen;
