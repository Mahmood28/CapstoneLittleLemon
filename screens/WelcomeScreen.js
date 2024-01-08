import * as React from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  // Add welcome screen code here.
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../img/little-lemon-logo.png')}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel={'Little Lemon Logo Grey'}
      />
      <Text style={styles.regularText}>
        Little Lemon, your local Mediterranean Bistro
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate('Subscribe')}
          style={styles.button}>
          <Text style={styles.buttonText}>Newsletter</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginVertical: 100,
  },
  regularText: {
    fontSize: 22,
    padding: 20,
    marginVertical: 8,
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 100,
  },
  button: {
    padding: 6,
    borderColor: '#406050',
    backgroundColor: '#406050',
    borderWidth: 2,
    borderRadius: 6,
    width: 280,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default WelcomeScreen;
