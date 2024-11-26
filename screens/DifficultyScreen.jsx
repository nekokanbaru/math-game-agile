import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'];

    return (
        <View style={styles.container}>
            {difficulties.map((difficulty, index) => (
                <View style={styles.optionButton} key={index}>
                    <Button
                        key={difficulty}
                        title={difficulty.toUpperCase()}
                        onPress={() => navigation.navigate('Game', { difficulty })}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    optionButton: {
        width: '40%',
        margin: 5,
    },
});

export default DifficultyScreen;
