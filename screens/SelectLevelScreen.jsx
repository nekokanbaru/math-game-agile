import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const SelectLevelScreen = ({ route, navigation }) => {
    const { difficulty } = route.params;
    const levels = require('../questions3.json')[difficulty]?.levels || []; // Fetch levels based on difficulty

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Level</Text>
            {levels.map((level, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => navigation.navigate('Game', { questions: level.questions })}
                >
                    <Text style={styles.buttonText}>Level {level.level}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'blue',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white'
    },
    button: {
        width: 200,
        padding: 10,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: "#FFF",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: "#FFF",
        fontSize: 20,
    }
});

export default SelectLevelScreen;
