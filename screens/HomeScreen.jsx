import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math Game</Text>
      <View style={styles.button}>
        <Button 
          title="Play"
          onPress={() => navigation.navigate('Difficulty')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: 100,
    fontSize: 30,
  }
});

export default HomeScreen;
