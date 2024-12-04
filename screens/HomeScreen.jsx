import React from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: "https://cdn.discordapp.com/attachments/1187564659130253483/1312158372581347398/mathgame.png?ex=674b7a36&is=674a28b6&hm=863788692edfca7141f235c4f38c226e43847f36b91613b5c806150f663ec2b8&",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>MATH</Text>
        <Text style={styles.title}>GAME</Text>
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
    color: "#1E3A8A",
    marginBottom: 20,
    fontFamily: 'BebasNeue-Regular',
    textShadowColor: "#FFF", // Neon bela boja za ivice
    textShadowOffset: { width: 2, height: 2 }, // Manji offset za oštriji efekat
    textShadowRadius: 3, // Manji radijus za oštriji glow
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
    backgroundColor: "transparent",
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
    color: "#1E3A8A",
    fontSize: 50,
    fontFamily: "BebasNeue-Regular",
    textShadowColor: "#FFF", // Neon bela boja za ivice
    textShadowOffset: { width: 2, height: 2 }, // Manji offset za oštriji efekat
    textShadowRadius: 3, // Manji radijus za oštriji glow
  }
});

export default HomeScreen;


