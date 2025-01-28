import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Image } from "react-native";
import { getCurrentUser, addUser, setCurrentUser } from "../utils/storage/highScoreUtils";

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [currentUser, setLocalCurrentUser] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  // Initialize with the current user
  useEffect(() => {
    const user = getCurrentUser();
    setLocalCurrentUser(user);
    setUsername(user); // Pre-fill with the current username
  }, []);

  const handleUsernameChange = async () => {
    if (username.trim() !== "") {
      const result = await addUser(username); // Wait for the result of addUser
      if (result) {
        setLocalCurrentUser(username); // Update locally
        setUsernameError(false); // Clear any previous error
      } else {
        setUsernameError(true); // Show error if adding user failed
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/mathgame.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Text with outline */}
        <Text style={[styles.title, styles.titleOutline]}>MATH</Text>
        <Text style={[styles.title, styles.titleOutline]}>GAME</Text>
        {/* Username Input Section */}
        {currentUser ? (
          <>
            <Text style={styles.greeting}>Hi, {currentUser}!</Text>
            <TouchableOpacity onPress={() => setLocalCurrentUser("")} style={styles.button}>
              <Text style={styles.userButtonText}>CHANGE USERNAME</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#cfd4dd"
              value={username}
              onChangeText={setUsername}
            />
            {usernameError && <Text style={styles.userButtonText}>USERNAME ALREADY EXISTS!</Text>}
            <TouchableOpacity onPress={handleUsernameChange} style={styles.button}>
              <Text style={styles.userButtonText}>CONFIRM USERNAME</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity title="Play"
          onPress={() => navigation.navigate('Difficulty')} style={styles.button}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} style={styles.button}>
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
  userButtonText: {
    color: "#cfd4dd",
    fontSize: 30,
    fontFamily: "BebasNeue-Regular",
  },
  buttonText: {
    color: "#cfd4dd",
    fontSize: 50,
    fontFamily: "BebasNeue-Regular",
  },
  greeting: {
    fontSize: 34,
    color: "#cfd4dd",
    marginBottom: 20,
    fontFamily: "BebasNeue-Regular",
  },
  input: {
    width: 300,
    height: 50,
    borderColor: "#cfd4dd",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "#cfd4dd",
    fontSize: 20,
    fontFamily: "BebasNeue-Regular",
  },
});

export default HomeScreen;
