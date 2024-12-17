import React from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/images/mathgame.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Text with outline */}
        <Text style={[styles.title, styles.titleOutline]}>MATH</Text>
        <Text style={[styles.title, styles.titleOutline]}>GAME</Text>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={require('../user.png')}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity title="Play"
          onPress={() => navigation.navigate('Difficulty')} style={styles.button}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SCOREBOARD</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 100,
    color: "#cfd4dd",
    marginBottom: 10,
    fontFamily: 'BebasNeue-Regular',
  },

  profileImage: {
    resizeMode: 'cover',
    height: 200,
    width: 200,
  },
  profileImageContainer: {
    translateY: -43,
    alignSelf: 'center',
    marginBottom: '30',
  },
  button: {
    width: 300,
    padding: 10,
    backgroundColor: "#002248",
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#FFF",  // Glow color
    shadowOpacity: 0.1,   // Strength of the glow
    shadowRadius: 1,     // Spread of the glow
    elevation: 1,        // For Android shadow
  },
  buttonText: {
    color: "#cfd4dd",
    fontSize: 50,
    fontFamily: "BebasNeue-Regular",
  }
});

export default HomeScreen;
