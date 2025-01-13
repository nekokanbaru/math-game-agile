import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { getAllUsersWithScores, getCurrentUser, getTotalHighScore, getGlobalLeaderboard } from '../utils/storage/highScoreUtils'; // Import functions

const LeaderboardScreen = ({ navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [viewMode, setViewMode] = useState('local'); // local or global

  // Fetch leaderboard data based on the viewMode
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (viewMode === 'local') {
        const usersWithScores = getAllUsersWithScores();
        const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score); // Sort by highest score
        setLeaderboardData(sortedUsers);
      } else if (viewMode === 'global') {
        const globalData = await getGlobalLeaderboard(); // Fetch global leaderboard data from Firebase
        const sortedGlobalUsers = globalData.sort((a, b) => b.score - a.score);
        setLeaderboardData(sortedGlobalUsers);
      }
    };

    fetchLeaderboardData();
  }, [viewMode]); // Run when viewMode changes

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const toggleLeaderboardView = () => {
    setViewMode(prevMode => (prevMode === 'local' ? 'global' : 'local')); // Toggle between local and global
  };

  return (
    <ImageBackground
      source={require('../assets/images/mathgame.png')}
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBackToHome}>
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Leaderboard View Mode Toggle Button */}
        <TouchableOpacity style={styles.headerButton} onPress={toggleLeaderboardView}>
          <Text style={styles.headerButtonText}>
            {viewMode === 'local' ? 'Global' : 'Local'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText}>{viewMode != 'local' ? 'GLOBAL LEADERBOARD' : 'LOCAL LEADERBOARD'}</Text>

      {/* Leaderboard */}
      <ScrollView style={styles.leaderboardContainer}>
        {leaderboardData.map((item, index) => (
          <View key={index} style={styles.leaderboardRow}>
            <Text style={styles.leaderboardText}>
              {index + 1}. {item.username}
            </Text>
            <Text style={styles.leaderboardText}>{item.score}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your Best Score: {getTotalHighScore()}
        </Text>
        <Text style={styles.footerText}>
          Your Place: {leaderboardData.findIndex(user => user.username === getCurrentUser()) + 1 + '.' || 'N/A'}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001a33',
  },
  header: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  headerText: {
    fontSize: 60,
    color: '#cfd4dd',
    fontFamily: 'BebasNeue-Regular',
    textAlign: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  leaderboardContainer: {
    flex: 1,
    marginVertical: 8,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#cfd4dd',
    width: '95%',
    alignSelf: 'center',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11.5,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc50',
  },
  leaderboardText: {
    color: '#cfd4dd',
    fontSize: 20,
  },
  footer: {
    paddingVertical: 16,
  },
  footerText: {
    color: '#cfd4dd',
    fontSize: 21,
    textAlign: 'center',
  },
  headerButton: {
    width: 100,
    padding: 5,
    backgroundColor: '#002248',
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  headerButtonText: {
    color: '#cfd4dd',
    fontSize: 30,
    fontFamily: 'BebasNeue-Regular',
  },
});

export default LeaderboardScreen;
