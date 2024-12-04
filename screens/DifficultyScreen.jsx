import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'];

    return (
        <ImageBackground
            source={{
                uri: "https://cdn.discordapp.com/attachments/1187564659130253483/1312158372581347398/mathgame.png?ex=674d7476&is=674c22f6&hm=f55bab1d0e613c310027d53f410a9c89271798126e0d2d23fb92bd7fd0e2892a&",
            }}
            style={styles.background}
        >
            <View style={styles.container}>
                {difficulties.map((difficulty, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => navigation.navigate('Game', { difficulty })}
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
        backgroundColor: 'transparent', // Transparent white background
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
        color: "#1E3A8A",
        fontSize: 50,
        fontFamily: "BebasNeue-Regular",
        textShadowColor: "#FFF", // Neon bela boja za ivice
        textShadowOffset: { width: 2, height: 2 }, // Manji offset za oštriji efekat
        textShadowRadius: 3, // Manji radijus za oštriji glow
    }
});

export default DifficultyScreen;
